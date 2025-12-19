import { useCallback, useEffect, useRef, useState } from "react";
import { ConsecutiveFailureError } from "../error/network-error";

/**
 * HOOK: 고정 간격 폴링을 위한 훅
 * - 이전 요청의 완료 여부와 관계없이(옵션에 따라) 고정된 간격으로 콜백 실행
 * - waitForPrevious=true 일 때, 동시에 한 번만 실행되도록 보장
 * - 연속 에러 개수를 기준으로 폴링 중단 및 에러 throw 가능
 *
 * @param callback - 실행할 비동기 콜백 함수
 * @param interval - 폴링 간격 (밀리초)
 * @param options - 추가 옵션
 */
interface UsePollingIntervalOptions {
  immediate?: boolean; // 즉시 실행 여부 (기본값: false)
  enabled?: boolean; // 활성화 여부 (기본값: true)
  waitForPrevious?: boolean; // 이전 요청 완료 대기 여부 (기본값: false)
  maxConsecutiveError?: number; // 연속 에러 허용 최대 개수: 지정하지 않으면 에러 카운트는 하지만 자동 중단은 하지 않음
  throwOnMaxError?: boolean; // 연속 에러가 maxConsecutiveError 이상이 되었을 때 에러를 throw할지 여부
}
export default function usePollingInterval(
  callback: () => Promise<void> | void,
  interval: number,
  options: UsePollingIntervalOptions = {}
) {
  const {
    immediate = false,
    enabled = true,
    waitForPrevious = false,
    maxConsecutiveError,
    throwOnMaxError = false,
  } = options;

  const savedCallback = useRef<typeof callback>(callback);
  const intervalIdRef = useRef<number | null>(null);
  const isProcessingRef = useRef(false);
  const isMountedRef = useRef(true);
  const errorCountRef = useRef(0);

  const [thrownError, setThrownError] = useState<Error | null>(null);

  savedCallback.current = callback;

  const executeCallback = useCallback(async () => {
    if (!isMountedRef.current) {
      return;
    }

    // waitForPrevious가 true이고 이전 요청이 진행 중이면 건너뜀
    if (waitForPrevious && isProcessingRef.current) {
      return;
    }

    isProcessingRef.current = true;

    try {
      await savedCallback.current();
      // 요청 및 응답 성공 시 연속 에러 카운트 초기화
      errorCountRef.current = 0;
    } catch (error) {
      console.error("폴링 콜백 실행 오류:", error);
      errorCountRef.current += 1;

      // 연속 에러가 설정값 이상이면 폴링 중단
      if (
        typeof maxConsecutiveError === "number" &&
        errorCountRef.current >= maxConsecutiveError
      ) {
        // 폴링 중단
        if (intervalIdRef.current !== null) {
          window.clearInterval(intervalIdRef.current);
          intervalIdRef.current = null;
        }

        // throwOnMaxError가 true면 Error Boundary로 에러 전파
        if (throwOnMaxError) {
          const networkError = new ConsecutiveFailureError(
            errorCountRef.current,
            error
          );
          setThrownError(networkError);
        }
      }
    } finally {
      isProcessingRef.current = false;
    }
  }, [waitForPrevious, maxConsecutiveError, throwOnMaxError]);

  // Error Boundary로 에러 전파
  if (thrownError) {
    throw thrownError;
  }

  // 폴링 시작
  const start = useCallback(() => {
    if (intervalIdRef.current !== null) {
      return; // 이미 실행 중
    }

    intervalIdRef.current = window.setInterval(() => {
      executeCallback();
    }, interval);

    // 즉시 실행 옵션
    if (immediate) {
      executeCallback();
    }
  }, [executeCallback, immediate, interval]);

  // 폴링 중지
  const stop = useCallback(() => {
    if (intervalIdRef.current !== null) {
      window.clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  }, []);

  // 폴링 재시작
  const restart = useCallback(() => {
    stop();
    start();
  }, [start, stop]);

  // 마운트/언마운트 처리
  useEffect(() => {
    isMountedRef.current = true;

    if (enabled) {
      start();
    }

    return () => {
      isMountedRef.current = false;
      stop();
    };
  }, [enabled, start, stop]);

  // interval 변경 시 재시작
  useEffect(() => {
    if (enabled && intervalIdRef.current !== null) {
      restart();
    }
  }, [interval, enabled, restart]);

  return {
    start,
    stop,
    restart,
    isProcessing: isProcessingRef.current,
    errorCount: errorCountRef.current,
  };
}

export type { UsePollingIntervalOptions };

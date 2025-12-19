import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import * as S from "./driver-video.style";
import usePollingInterval from "../../hooks/usePollingInterval";
import drawVideoSnapshot from "../../(routes)/record/_utils/drawVideoSnapshot";
import { SEND_DRIVER_IMAGE_INTERVAL_TIME } from "../../constants/constants";
import { usePostDriverAction } from "../../api/action";
import useWatchLocation from "../../hooks/useWatchLocation";
import { getCameraPermission } from "../../_utils/camera";

/**
 * COMPONENT: 운전자 모습을 녹화하는 비디오
 * - 고정 간격 폴링으로 주기적으로 프레임 캡처 및 서버 전송
 * - waitForPrevious=true + mutateAsync 사용으로 "동시 1개" 요청만 유지
 */
export default forwardRef<HTMLVideoElement>(function DriverVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { location } = useWatchLocation();

  // mutateAsync 사용 → 실패 시 throw 되어 폴링 훅에서 에러로 인식 가능
  const { mutateAsync: createDriverAction } = usePostDriverAction();

  const [isReady, setIsReady] = useState(false);
  const [stream, setStream] = useState<MediaStream>();

  // 녹화 화면 초기화
  useEffect(() => {
    if (!videoRef.current) return;
    if (stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // MOUNT: 녹화 허용 요청과 스트림 등록
  useEffect(() => {
    const startCameraStream = async () => {
      const driverStream = await getCameraPermission();
      setStream(driverStream);
    };

    startCameraStream();
  }, []);

  // 비디오 준비 상태 감지
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsReady(true);
    };

    // 이미 준비된 상태인지 확인
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      setIsReady(true);
    }

    video.addEventListener("canplay", handleCanPlay);
    return () => {
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [stream]);

  // 폴링 콜백 함수
  const captureAndSendFrame = useCallback(async () => {
    const video = videoRef.current;

    // 비디오가 준비되지 않았으면 스킵
    if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      return;
    }

    // 위치 정보가 없으면 스킵
    if (!location) {
      return;
    }

    const driverImageBlob = await drawVideoSnapshot(video);
    if (!driverImageBlob) {
      return;
    }

    const filename = `snapshot_${new Date().toISOString()}.jpg`;
    const driverImage = new File([driverImageBlob as BlobPart], filename, {
      type: "image/jpeg",
    });

    const { latitude, longitude } = location.coords;

    const driverActionData = new FormData();
    driverActionData.append("capture", driverImage);
    driverActionData.append("location_x", latitude.toString());
    driverActionData.append("location_y", longitude.toString());

    // mutateAsync 사용 → 실패 시 예외 발생 → usePollingInterval에서 에러로 카운트
    await createDriverAction(driverActionData);
  }, [createDriverAction, location]);

  // 연속 실패 시 ConsecutiveFailureError를 throw하여 NetworkErrorBoundary에서 처리
  usePollingInterval(captureAndSendFrame, SEND_DRIVER_IMAGE_INTERVAL_TIME, {
    enabled: isReady && !!location,
    waitForPrevious: true,
    immediate: false,
    maxConsecutiveError: 5,
    throwOnMaxError: true,
  });

  return (
    <S.VideoWrapper>
      <S.VideoElement
        ref={videoRef}
        id="local-video"
        autoPlay
        muted
        loop
        playsInline
      />
    </S.VideoWrapper>
  );
});

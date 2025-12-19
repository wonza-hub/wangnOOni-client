import * as S from "./network-error-fallback.style";
import { NetworkError } from "../../error/network-error";
import { startTransition } from "react";

interface NetworkErrorFallbackProps {
  error: NetworkError;
  onReset: () => void;
}

/**
 * 네트워크 에러 발생 시 표시되는 Fallback UI
 */
export default function NetworkErrorFallback({
  error,
  onReset,
}: NetworkErrorFallbackProps) {
  const handleRetry = () => {
    startTransition(() => {
      onReset();
    });
  };

  const handleGoHome = () => {
    onReset();
    window.location.href = "/";
  };

  return (
    <S.Container>
      <S.ErrorIcon>⚠️</S.ErrorIcon>
      <S.Title>네트워크 연결 불안정</S.Title>
      <S.Description>
        서버와의 연결이 원활하지 않습니다.
        <br />
        네트워크 상태를 확인하고 다시 시도해주세요.
      </S.Description>

      {error.consecutiveFailures > 0 && (
        <S.ErrorDetail>
          연속 {error.consecutiveFailures}회 요청 실패
        </S.ErrorDetail>
      )}

      <S.Suggestion>
        <S.SuggestionTitle>확인 사항</S.SuggestionTitle>
        <S.SuggestionList>
          <li>인터넷 연결 상태를 확인해주세요</li>
          <li>Wi-Fi 또는 모바일 데이터 연결을 확인해주세요</li>
          <li>잠시 후 다시 시도해주세요</li>
        </S.SuggestionList>
      </S.Suggestion>

      <S.ButtonGroup>
        <S.HomeButton onClick={handleGoHome}>로그인 페이지로 이동</S.HomeButton>
        <S.RetryButton onClick={handleRetry}>다시 시도</S.RetryButton>
      </S.ButtonGroup>
    </S.Container>
  );
}

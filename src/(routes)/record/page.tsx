import DriverVideo from "../../_components/driver-video/driver-video";
import NetworkErrorBoundary from "../../_components/error-boundary/network-error-boundary";
import * as S from "./page.style";
import RecentActionBanners from "./_components/recent-action-banners/recent-action-banners";
// import AlertBanner from "../../_components/alert-banner/alert-banner";
// import Notification from "../../_components/notification/notification";

/**
 * PAGE: 녹화 화면
 */
export default function Page() {
  return (
    <NetworkErrorBoundary
      onError={(error, errorInfo) => {
        console.error("네트워크 에러 발생:", error, errorInfo);
      }}
    >
      <S.Wrapper>
        {/* 촬영 화면 */}
        <DriverVideo />
        {/* 최근 운전 행위 결과 배너 */}
        <RecentActionBanners />
        {/* TODO: Toast 전역으로 통합 */}
        {/* 에러 배너 */}
        {/* {error && <AlertBanner error />} */}
        {/* 근처 운전자 위험 운전 행위 알림 */}
        {/* <Notification
          key={notificationData.key}
          message={notificationData.message}
          description={notificationData.description}
        /> */}
      </S.Wrapper>
    </NetworkErrorBoundary>
  );
}

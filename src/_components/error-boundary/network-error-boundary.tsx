import { Component, ReactNode } from "react";
import { NetworkError } from "../../error/network-error";
import NetworkErrorFallback from "./network-error-fallback";

interface NetworkErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: NetworkError, errorInfo: React.ErrorInfo) => void;
  fallback?: ReactNode;
}

interface NetworkErrorBoundaryState {
  hasError: boolean;
  error: NetworkError | null;
}

/**
 * 네트워크 에러 전용 Error Boundary
 * - NetworkError 인스턴스만 캐치하여 처리
 * - 다른 에러는 상위로 전파
 */
export default class NetworkErrorBoundary extends Component<
  NetworkErrorBoundaryProps,
  NetworkErrorBoundaryState
> {
  constructor(props: NetworkErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): NetworkErrorBoundaryState {
    // NetworkError 인스턴스인 경우에만 처리
    if (NetworkError.isNetworkError(error)) {
      return {
        hasError: true,
        error,
      };
    }

    throw error;
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // NetworkError인 경우에만 onError 콜백 호출
    if (NetworkError.isNetworkError(error) && this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // 커스텀 Fallback이 있으면 사용, 없으면 기본 Fallback 사용
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <NetworkErrorFallback
          error={this.state.error}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

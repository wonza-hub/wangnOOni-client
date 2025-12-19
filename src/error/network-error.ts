/**
 * 네트워크 관련 에러를 나타내는 커스텀 에러 클래스
 * Error Boundary에서 네트워크 에러를 구분하여 처리하기 위해 사용
 */
export class NetworkError extends Error {
  /** 연속 실패 횟수 */
  public readonly consecutiveFailures: number;
  /** 마지막 발생한 원본 에러 */
  public readonly originalError?: unknown;
  /** 에러 발생 시간 */
  public readonly timestamp: Date;

  constructor(
    message: string,
    options?: {
      consecutiveFailures?: number;
      originalError?: unknown;
    }
  ) {
    super(message);
    this.name = "NetworkError";
    this.consecutiveFailures = options?.consecutiveFailures ?? 0;
    this.originalError = options?.originalError;
    this.timestamp = new Date();

    // Error 클래스 상속 시 프로토타입 체인 유지
    Object.setPrototypeOf(this, NetworkError.prototype);
  }

  /**
   * 에러가 NetworkError 인스턴스인지 확인하는 타입 가드
   */
  static isNetworkError(error: unknown): error is NetworkError {
    return error instanceof NetworkError;
  }
}

/**
 * 타임아웃 에러를 나타내는 커스텀 에러 클래스
 */
export class TimeoutError extends NetworkError {
  constructor(
    message: string = "요청 시간이 초과되었습니다.",
    options?: {
      consecutiveFailures?: number;
      originalError?: unknown;
    }
  ) {
    super(message, options);
    this.name = "TimeoutError";
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

/**
 * 연속 실패로 인한 서비스 불가 에러
 */
export class ConsecutiveFailureError extends NetworkError {
  constructor(consecutiveFailures: number, originalError?: unknown) {
    super(
      `네트워크 연결이 불안정합니다. (연속 ${consecutiveFailures}회 실패)`,
      { consecutiveFailures, originalError }
    );
    this.name = "ConsecutiveFailureError";
    Object.setPrototypeOf(this, ConsecutiveFailureError.prototype);
  }
}

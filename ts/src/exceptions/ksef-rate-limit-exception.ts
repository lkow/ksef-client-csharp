import type { ApiErrorResponse } from "./api-error-response.js";
import { KsefApiException } from "./ksef-api-exception.js";

export class KsefRateLimitException extends KsefApiException {
  public readonly retryAfterSeconds?: number;
  public readonly retryAfterDate?: Date;
  public readonly recommendedDelay: number;

  constructor(
    message: string,
    retryAfterSeconds?: number,
    retryAfterDate?: Date,
    error?: ApiErrorResponse,
  ) {
    super(message, 429, error);
    this.name = "KsefRateLimitException";
    this.retryAfterSeconds = retryAfterSeconds;
    this.retryAfterDate = retryAfterDate;
    this.recommendedDelay = this.calculateRecommendedDelay();
  }

  public static fromRetryAfterHeader(message: string, retryAfter?: string | null, error?: ApiErrorResponse) {
    let retryAfterSeconds: number | undefined;
    let retryAfterDate: Date | undefined;

    if (retryAfter) {
      const parsedSeconds = Number.parseInt(retryAfter, 10);
      if (!Number.isNaN(parsedSeconds)) {
        retryAfterSeconds = parsedSeconds;
      } else {
        const asDate = new Date(retryAfter);
        if (!Number.isNaN(asDate.valueOf())) {
          retryAfterDate = asDate;
        }
      }
    }

    return new KsefRateLimitException(message, retryAfterSeconds, retryAfterDate, error);
  }

  public getRateLimitDescription(): string {
    if (this.retryAfterSeconds != null) {
      return `Przekroczono limit częstotliwości. Spróbuj ponownie po ${this.retryAfterSeconds} sekundach.`;
    }
    if (this.retryAfterDate) {
      return `Przekroczono limit częstotliwości. Spróbuj ponownie po ${this.retryAfterDate.toISOString()}.`;
    }
    return "Przekroczono limit częstotliwości. Rozważ wdrożenie mechanizmu ponawiania z wycofywaniem.";
  }

  private calculateRecommendedDelay(): number {
    if (this.retryAfterSeconds != null) {
      return this.retryAfterSeconds * 1000;
    }
    if (this.retryAfterDate) {
      const delta = this.retryAfterDate.getTime() - Date.now();
      return delta > 0 ? delta : 1000;
    }
    return 1000;
  }
}

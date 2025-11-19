import type { ApiErrorResponse } from "./api-error-response.js";

export class KsefApiException extends Error {
  public readonly statusCode: number;
  public readonly error?: ApiErrorResponse;

  constructor(message: string, statusCode: number, error?: ApiErrorResponse, options?: ErrorOptions) {
    super(message, options);
    this.name = "KsefApiException";
    this.statusCode = statusCode;
    this.error = error;
  }
}

/**
 * Shared domain models mirrored from KSeF.Client.Core.Models.
 */
export interface OperationResponse {
  /** Reference number returned by asynchronous operations. */
  readonly referenceNumber: string;
}

export interface StatusInfo {
  /** Numeric status code returned by KSeF. */
  readonly code: number;
  /** Human-readable description of the status. */
  readonly description: string;
  /** Optional list of detailed error messages. */
  readonly details?: readonly string[];
}

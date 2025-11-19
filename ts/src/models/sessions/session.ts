import type { StatusInfo } from '../common.js';

/** Represents a batch or online session returned by the API. */
export interface Session {
  readonly referenceNumber: string;
  readonly status: StatusInfo;
  readonly dateCreated: Date;
  readonly dateUpdated: Date;
  readonly validUntil: Date;
  readonly totalInvoiceCount: number;
  readonly successfulInvoiceCount: number;
  readonly failedInvoiceCount: number;
}

export interface SessionsListResponse {
  readonly continuationToken?: string;
  readonly sessions: readonly Session[];
}

import type { StatusInfo } from '../common.js';
import type { UpoResponse } from './upo.js';

export interface SessionStatusResponse {
  readonly status: StatusInfo;
  readonly upo?: UpoResponse;
  readonly invoiceCount?: number;
  readonly successfulInvoiceCount?: number;
  readonly failedInvoiceCount?: number;
  readonly validUntil?: Date;
}

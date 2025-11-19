import type { StatusInfo } from '../common.js';
import type { InvoicingMode } from '../invoices/invoicing-mode.js';

export interface SessionInvoice {
  readonly ordinalNumber: number;
  readonly invoiceNumber?: string;
  readonly ksefNumber?: string;
  readonly referenceNumber?: string;
  readonly invoiceHash?: string;
  readonly invoiceFileName?: string;
  readonly acquisitionDate?: Date;
  readonly invoicingDate: Date;
  readonly permanentStorageDate?: Date;
  readonly upoDownloadUrl?: URL;
  readonly status: StatusInfo;
  readonly invoicingMode: InvoicingMode;
  readonly upoDownloadUrlExpirationDate?: Date;
}

export interface SessionInvoicesResponse {
  readonly continuationToken?: string;
  readonly invoices: readonly SessionInvoice[];
}

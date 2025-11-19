export interface SendInvoiceRequest {
  readonly invoiceHash: string;
  readonly invoiceSize: number;
  readonly encryptedInvoiceHash?: string;
  readonly encryptedInvoiceSize?: number;
  readonly encryptedInvoiceContent?: string;
  readonly offlineMode?: boolean;
  readonly hashOfCorrectedInvoice?: string;
}

/**
 * Mirrors the .NET TestDataSessionLimitsBase type.
 */
export interface TestDataSessionLimitsBase {
  readonly maxInvoiceSizeInMB: number;
  readonly maxInvoiceWithAttachmentSizeInMB: number;
  readonly maxInvoices: number;
}

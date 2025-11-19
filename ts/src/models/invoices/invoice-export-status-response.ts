import type { StatusInfo } from "../common.js";
import type { InvoiceExportPackage } from "./invoice-export-package.js";

export interface InvoiceExportStatusResponse {
  readonly status: StatusInfo;
  readonly completedDate?: string;
  readonly packageExpirationDate?: string;
  readonly package?: InvoiceExportPackage;
}

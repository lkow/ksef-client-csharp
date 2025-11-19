import type { FormCode } from "../sessions/form-code.js";
import type { InvoicingMode } from "./invoicing-mode.js";
import type { InvoiceType } from "./invoice-type.js";
import type { Buyer } from "./buyer.js";
import type { Seller } from "./seller.js";
import type { ThirdSubjects } from "./third-subjects.js";
import type { AuthorizedSubject } from "./authorized-subject.js";

export interface InvoiceSummary {
  readonly ksefNumber: string;
  readonly invoiceNumber: string;
  readonly issueDate: string;
  readonly invoicingDate: string;
  readonly acquisitionDate: string;
  readonly permanentStorageDate: string;
  readonly seller: Seller;
  readonly buyer: Buyer;
  readonly netAmount: number;
  readonly grossAmount: number;
  readonly vatAmount: number;
  readonly currency: string;
  readonly invoicingMode: InvoicingMode;
  readonly invoiceType: InvoiceType;
  readonly formCode: FormCode;
  readonly isSelfInvoicing: boolean;
  readonly hasAttachment: boolean;
  readonly invoiceHash: string;
  readonly hashOfCorrectedInvoice?: string;
  readonly thirdSubjects?: readonly ThirdSubjects[];
  readonly authorizedSubject?: AuthorizedSubject;
}

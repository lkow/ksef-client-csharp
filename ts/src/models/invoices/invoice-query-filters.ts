import type { AmountFilter } from "./amount-filter.js";
import type { BuyerIdentifier } from "./buyer-identifier.js";
import type { CurrencyCode } from "./currency-code.js";
import type { DateRange } from "./date-range.js";
import type { InvoiceSubjectType } from "./invoice-subject-type.js";
import type { InvoiceType } from "./invoice-type.js";
import type { InvoicingMode } from "./invoicing-mode.js";

export type SortOrder = "Asc" | "Desc";
export type FormType = "FA" | "PEF" | "RR";

export interface InvoiceQueryFilters {
  readonly subjectType: InvoiceSubjectType;
  readonly dateRange?: DateRange;
  readonly ksefNumber?: string;
  readonly invoiceNumber?: string;
  readonly amount?: AmountFilter;
  readonly sellerNip?: string;
  readonly buyerIdentifier?: BuyerIdentifier;
  readonly currencyCodes?: readonly CurrencyCode[];
  readonly invoicingMode?: InvoicingMode;
  readonly isSelfInvoicing?: boolean;
  readonly formType?: FormType;
  readonly invoiceTypes?: readonly InvoiceType[];
  readonly hasAttachment?: boolean;
}

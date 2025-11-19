export type AmountType = "Brutto" | "Netto" | "Vat";

export interface AmountFilter {
  readonly type: AmountType;
  readonly from: number;
  readonly to: number;
}

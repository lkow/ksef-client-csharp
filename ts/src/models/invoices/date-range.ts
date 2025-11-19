export type DateType = "Issue" | "Invoicing" | "PermanentStorage";

export interface DateRange {
  readonly dateType: DateType;
  readonly from: string;
  readonly to?: string;
}

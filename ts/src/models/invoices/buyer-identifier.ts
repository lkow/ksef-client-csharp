export type BuyerIdentifierType = "None" | "Other" | "Nip" | "VatUe";

export interface BuyerIdentifier {
  readonly type: BuyerIdentifierType;
  readonly value: string;
}

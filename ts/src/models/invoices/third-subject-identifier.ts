export type ThirdSubjectIdentifierType = "None" | "Other" | "Nip" | "VatUe" | "InternalId";

export interface ThirdSubjectIdentifier {
  readonly type: ThirdSubjectIdentifierType;
  readonly value: string;
}

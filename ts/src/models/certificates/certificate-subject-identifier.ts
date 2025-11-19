import type { CertificateSubjectIdentifierType } from "./certificate-type.js";

export interface CertificateSubjectIdentifier {
  readonly type: CertificateSubjectIdentifierType;
  readonly value: string;
}

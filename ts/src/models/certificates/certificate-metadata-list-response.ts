import type { CertificateStatusEnum } from "./certificate-status.js";
import type { CertificateSubjectIdentifier } from "./certificate-subject-identifier.js";
import type { CertificateType } from "./certificate-type.js";

export interface CertificateMetadataListResponse {
  readonly certificates: readonly CertificateInfo[];
  readonly hasMore: boolean;
}

export interface CertificateInfo {
  readonly certificateSerialNumber: string;
  readonly name: string;
  readonly type: CertificateType;
  readonly commonName: string;
  readonly status: CertificateStatusEnum;
  readonly subjectIdentifier: CertificateSubjectIdentifier;
  readonly validFrom: string;
  readonly validTo: string;
  readonly lastUseDate?: string;
  readonly requestDate: string;
}

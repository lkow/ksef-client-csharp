import type { CertificateStatusEnum } from "./certificate-status.js";
import type { CertificateType } from "./certificate-type.js";

export interface CertificateMetadataListRequest {
  readonly certificateSerialNumber?: string;
  readonly name?: string;
  readonly type?: CertificateType;
  readonly status?: CertificateStatusEnum;
  readonly expiresAfter?: string;
}

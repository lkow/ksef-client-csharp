import type { CertificateType } from "./certificate-type.js";

export interface SendCertificateEnrollmentRequest {
  readonly certificateName: string;
  readonly certificateType: CertificateType;
  readonly csr: string;
  readonly validFrom?: string;
}

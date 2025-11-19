import type { CertificateType } from "./certificate-type.js";

export interface CertificateListResponse {
  readonly certificates: readonly CertificateResponse[];
}

export interface CertificateResponse {
  readonly certificate: string;
  readonly certificateName: string;
  readonly certificateSerialNumber: string;
  readonly certificateType: CertificateType;
}

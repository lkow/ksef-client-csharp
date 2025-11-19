import type { StatusInfo } from "../common.js";

export interface CertificateEnrollmentStatusResponse {
  readonly requestDate: string;
  readonly status: StatusInfo;
  readonly certificateSerialNumber?: string;
}

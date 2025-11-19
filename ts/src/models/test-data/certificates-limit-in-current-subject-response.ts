import type { TestDataCertificate } from "./test-data-certificate.js";
import type { TestDataEnrollment } from "./test-data-enrollment.js";

export interface CertificatesLimitInCurrentSubjectResponse {
  readonly enrollment?: TestDataEnrollment;
  readonly certificate?: TestDataCertificate;
}

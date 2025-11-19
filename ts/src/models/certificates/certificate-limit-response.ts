export interface CertificateLimitResponse {
  readonly canRequest: boolean;
  readonly enrollment?: CertificateLimitEntry;
  readonly certificate?: CertificateLimitEntry;
}

export interface CertificateLimitEntry {
  readonly remaining: number;
  readonly limit: number;
}

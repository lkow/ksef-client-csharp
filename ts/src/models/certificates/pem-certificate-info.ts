import type { PublicKeyCertificateUsage } from "./public-key-certificate-usage.js";

export interface PemCertificateInfo {
  readonly certificate: string;
  readonly validFrom: Date;
  readonly validTo: Date;
  readonly usage: readonly PublicKeyCertificateUsage[];
}

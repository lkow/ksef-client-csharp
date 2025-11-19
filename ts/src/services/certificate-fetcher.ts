import type { ICryptographyClient } from "../clients/cryptography-client.js";
import type { PemCertificateInfo } from "../models/certificates/pem-certificate-info.js";

export interface CertificateFetcher {
  getCertificates(signal?: AbortSignal): Promise<readonly PemCertificateInfo[]>;
}

export class DefaultCertificateFetcher implements CertificateFetcher {
  constructor(private readonly cryptographyClient: ICryptographyClient) {}

  public getCertificates(signal?: AbortSignal): Promise<readonly PemCertificateInfo[]> {
    return this.cryptographyClient.getPublicCertificatesAsync(signal);
  }
}

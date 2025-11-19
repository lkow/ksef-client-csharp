export interface ISignatureService {
  sign(xml: string, certificatePem: string, privateKeyPem: string): string;
}

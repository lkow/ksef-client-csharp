import forge from "node-forge";
import type { PemCertificateInfo } from "../../models/certificates/pem-certificate-info.js";

export function createSelfSignedCertificate(commonName: string) {
  const keys = forge.pki.rsa.generateKeyPair(2048);

  const cert = forge.pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = "01";
  const now = new Date();
  cert.validity.notBefore = now;
  cert.validity.notAfter = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const attrs = [{ name: "commonName", value: commonName }];
  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  cert.sign(keys.privateKey, forge.md.sha256.create());

  const certPem = forge.pki.certificateToPem(cert);
  const certDerBase64 = Buffer.from(forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes(), "binary").toString("base64");

  return {
    certificatePem: certPem,
    certificateBase64: certDerBase64,
    privateKeyPem: forge.pki.privateKeyToPem(keys.privateKey),
    validFrom: new Date(cert.validity.notBefore),
    validTo: new Date(cert.validity.notAfter),
  };
}

export function buildCertificateInfo(
  source: ReturnType<typeof createSelfSignedCertificate>,
  usage: "SymmetricKeyEncryption" | "KsefTokenEncryption",
): PemCertificateInfo {
  return {
    certificate: source.certificateBase64,
    validFrom: source.validFrom,
    validTo: source.validTo,
    usage: [usage],
  };
}

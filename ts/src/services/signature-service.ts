import { createHash } from "node:crypto";
import { DOMParser } from "@xmldom/xmldom";
import { SignedXml } from "xml-crypto";
import forge from "node-forge";
import type { ISignatureService } from "../types/signature-service.js";

const XADES_NS = "http://uri.etsi.org/01903/v1.3.2#";
const SIGNED_PROPERTIES_TYPE = "http://uri.etsi.org/01903#SignedProperties";

export class SignatureService implements ISignatureService {
  public sign(xml: string, certificatePem: string, privateKeyPem: string): string {
    const document = new DOMParser().parseFromString(xml);
    if (!document.documentElement) {
      throw new Error("Dokument XML nie ma elementu głównego");
    }

    const signatureId = "Signature";
    const signedPropertiesId = "SignedProperties";
    const signingTime = new Date();

    const cert = forge.pki.certificateFromPem(certificatePem);
    const certDer = Buffer.from(forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes(), "binary");
    const certDigest = createHash("sha256").update(certDer).digest("base64");
    const issuer = cert.issuer.attributes.map((a) => `${a.shortName}=${a.value}`).join(", ");
    const serialNumber = new forge.jsbn.BigInteger(cert.serialNumber, 16).toString();

    const qualifyingProperties = `<xades:QualifyingProperties Target="#${signatureId}" xmlns:xades="${XADES_NS}" xmlns="http://www.w3.org/2000/09/xmldsig#">
  <xades:SignedProperties Id="${signedPropertiesId}">
    <xades:SignedSignatureProperties>
      <xades:SigningTime>${signingTime.toISOString()}</xades:SigningTime>
      <xades:SigningCertificate>
        <xades:Cert>
          <xades:CertDigest>
            <DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" />
            <DigestValue>${certDigest}</DigestValue>
          </xades:CertDigest>
          <xades:IssuerSerial>
            <X509IssuerName>${issuer}</X509IssuerName>
            <X509SerialNumber>${serialNumber}</X509SerialNumber>
          </xades:IssuerSerial>
        </xades:Cert>
      </xades:SigningCertificate>
    </xades:SignedSignatureProperties>
  </xades:SignedProperties>
</xades:QualifyingProperties>`;

    const sig = new SignedXml({ idAttribute: "Id" });
    const rootName = document.documentElement.nodeName;
    sig.addReference(
      `//*[local-name()='${rootName}']`,
      ["http://www.w3.org/2000/09/xmldsig#enveloped-signature", "http://www.w3.org/2001/10/xml-exc-c14n#"],
      "http://www.w3.org/2001/04/xmlenc#sha256",
    );
    sig.signingKey = privateKeyPem;
    sig.keyInfoProvider = {
      getKeyInfo: () => `<X509Data><X509Certificate>${stripPemHeaders(certificatePem)}</X509Certificate></X509Data>`,
    };

    sig.computeSignature(document.toString());

    const signedDocument = new DOMParser().parseFromString(sig.getSignedXml());
    const signatureElement = signedDocument.documentElement?.getElementsByTagName("Signature")[0];
    if (signatureElement) {
      const qp = new DOMParser().parseFromString(qualifyingProperties).documentElement;
      const objectNode = signedDocument.createElement("Object");
      objectNode.setAttribute("Id", signedPropertiesId);
      objectNode.appendChild(qp);
      signatureElement.appendChild(objectNode);

      document.documentElement.appendChild(document.importNode(signatureElement, true));
    }

    return document.toString();
  }
}

function stripPemHeaders(pem: string): string {
  return pem
    .replace(/-----BEGIN CERTIFICATE-----/, "")
    .replace(/-----END CERTIFICATE-----/, "")
    .replace(/\s+/g, "");
}

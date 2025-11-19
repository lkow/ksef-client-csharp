import { describe, expect, it } from "vitest";
import { SignatureService } from "../signature-service.js";
import { createSelfSignedCertificate } from "./test-utils.js";

const cert = createSelfSignedCertificate("signer");
const service = new SignatureService();

describe("SignatureService", () => {
  it("signs XML and appends signature", () => {
    const xml = `<Root><Data>abc</Data></Root>`;
    const signed = service.sign(xml, cert.certificatePem, cert.privateKeyPem);
    expect(signed).toContain("<Signature");
    expect(signed).toContain("SignedProperties");
  });
});

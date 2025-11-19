import { describe, expect, it } from "vitest";
import { VerificationLinkService } from "../verification-link-service.js";

const service = new VerificationLinkService({ baseUrl: "https://ksef.example.com" });

describe("VerificationLinkService", () => {
  it("builds invoice verification url", () => {
    const result = service.buildInvoiceVerificationUrl("123", new Date("2024-01-02"), Buffer.from("hash").toString("base64"));
    expect(result).toContain("/invoice/123/02-01-2024/");
  });

  it("builds certificate verification url", () => {
    const result = service.buildCertificateVerificationUrl(
      "123",
      "Nip",
      "456",
      "SER",
      Buffer.from("hash").toString("base64"),
      "signed",
    );
    expect(result).toContain("/certificate/Nip/456/123/SER/");
    expect(result.endsWith("/signed")).toBe(true);
  });
});

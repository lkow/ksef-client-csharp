import { describe, expect, it, vi } from "vitest";
import { CryptographyService } from "../cryptography-service.js";
import { buildCertificateInfo, createSelfSignedCertificate } from "./test-utils.js";

const rsaCert = createSelfSignedCertificate("rsa-cert");
const ecdsaCert = createSelfSignedCertificate("ec-cert");

const fetcher = {
  getCertificates: vi.fn(async () => [
    buildCertificateInfo(rsaCert, "SymmetricKeyEncryption"),
    buildCertificateInfo(ecdsaCert, "KsefTokenEncryption"),
  ]),
};

describe("CryptographyService", () => {
  it("warms up and produces encryption data", async () => {
    const service = new CryptographyService(fetcher);
    await service.warmup();
    const data = service.getEncryptionData();
    expect(data.encryptionInfo.encryptedSymmetricKey).toBeTruthy();
    expect(data.encryptionInfo.initializationVector).toBeTruthy();
  });

  it("encrypts and decrypts bytes with AES", async () => {
    const service = new CryptographyService(fetcher);
    await service.warmup();
    const content = Buffer.from("hello world", "utf8");
    const { cipherKey, cipherIv } = service.getEncryptionData();
    const encrypted = service.encryptBytesWithAes256(content, cipherKey, cipherIv);
    const decrypted = service.decryptBytesWithAes256(encrypted, cipherKey, cipherIv);
    expect(Buffer.from(decrypted).toString("utf8")).toBe("hello world");
  });

  it("computes metadata for buffers", () => {
    const service = new CryptographyService(fetcher);
    service.setExternalMaterials(rsaCert.certificatePem, ecdsaCert.certificatePem);
    const meta = service.getMetaData(Buffer.from("abc"));
    expect(meta.fileSize).toBe(3);
    expect(meta.hashSha).toBe("ungWv48Bz+pBQUDeXa4iI7ADYaOWF3qctBD/YfIAFa0=");
  });

  it("generates CSRs", () => {
    const service = new CryptographyService(fetcher);
    const csrRsa = service.generateCsrWithRsa({ commonName: "test" });
    const csrEcdsa = service.generateCsrWithEcdsa({ commonName: "test" });
    expect(csrRsa.csr).toBeTruthy();
    expect(csrEcdsa.privateKey).toBeTruthy();
  });
});

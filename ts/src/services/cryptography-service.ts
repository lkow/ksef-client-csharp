import { BinaryLike, createCipheriv, createDecipheriv, createHash, createPrivateKey, createPublicKey, diffieHellman, generateKeyPairSync, publicEncrypt, randomBytes, constants } from "node:crypto";
import { pipeline } from "node:stream/promises";
import type { Readable, Writable } from "node:stream";
import forge from "node-forge";
import type { CertificateEnrollmentsInfoResponse } from "../models/certificates/certificate-enrollments-info-response.js";
import type { PemCertificateInfo } from "../models/certificates/pem-certificate-info.js";
import type { EncryptionData } from "../models/sessions/encryption.js";
import type { FileMetadata } from "../models/sessions/file-metadata.js";
import type { CertificateFetcher } from "./certificate-fetcher.js";

const RSA_OAEP_OPTIONS = {
  padding: constants.RSA_PKCS1_OAEP_PADDING,
  oaepHash: "sha256" as const,
};

interface CertificateMaterials {
  readonly symmetricKeyPem: string;
  readonly ksefTokenPem: string;
  readonly expiresAt: Date;
  readonly refreshAt: Date;
}

export interface CryptographyServiceOptions {
  readonly refreshJitterMinutes?: number;
  readonly maxRevalidateHours?: number;
  readonly staleGraceHours?: number;
}

export interface ICryptographyService {
  isWarmedUp(): boolean;
  warmup(signal?: AbortSignal): Promise<void>;
  forceRefresh(signal?: AbortSignal): Promise<void>;
  setExternalMaterials(symmetricKeyPem: string, ksefTokenPem: string): void;
  getEncryptionData(): EncryptionData;
  encryptBytesWithAes256(content: Uint8Array, key: Uint8Array, iv: Uint8Array): Uint8Array;
  encryptStreamWithAes256(input: Readable, output: Writable, key: Uint8Array, iv: Uint8Array): Promise<void>;
  decryptBytesWithAes256(content: Uint8Array, key: Uint8Array, iv: Uint8Array): Uint8Array;
  decryptStreamWithAes256(input: Readable, output: Writable, key: Uint8Array, iv: Uint8Array): Promise<void>;
  generateCsrWithRsa(certificateInfo: CertificateEnrollmentsInfoResponse): { csr: string; privateKey: string };
  generateCsrWithEcdsa(certificateInfo: CertificateEnrollmentsInfoResponse): { csr: string; privateKey: string };
  getMetaData(file: Uint8Array): FileMetadata;
  getMetaDataFromStream(stream: Readable): Promise<FileMetadata>;
  encryptWithRsaUsingPublicKey(content: Uint8Array): Uint8Array;
  encryptKsefTokenWithRsaUsingPublicKey(content: Uint8Array): Uint8Array;
  encryptWithEcdsaUsingPublicKey(content: Uint8Array): Uint8Array;
}

export class CryptographyService implements ICryptographyService {
  private materials?: CertificateMaterials;
  private refreshTimer?: NodeJS.Timeout;
  private externallyManaged = false;
  private readonly refreshJitterMinutes: number;
  private readonly maxRevalidateHours: number;
  private readonly staleGraceMs: number;

  constructor(
    private readonly fetcher: CertificateFetcher,
    options: CryptographyServiceOptions = {},
  ) {
    this.refreshJitterMinutes = options.refreshJitterMinutes ?? 5;
    this.maxRevalidateHours = options.maxRevalidateHours ?? 24;
    this.staleGraceMs = (options.staleGraceHours ?? 6) * 60 * 60 * 1000;
  }

  public isWarmedUp(): boolean {
    return Boolean(this.materials);
  }

  public async warmup(signal?: AbortSignal): Promise<void> {
    if (this.externallyManaged) return;
    await this.refresh(signal);
    this.scheduleNextRefresh();
  }

  public async forceRefresh(signal?: AbortSignal): Promise<void> {
    if (this.externallyManaged) return;
    await this.refresh(signal);
    this.scheduleNextRefresh();
  }

  public setExternalMaterials(symmetricKeyPem: string, ksefTokenPem: string): void {
    this.refreshTimer && clearTimeout(this.refreshTimer);
    this.externallyManaged = true;
    this.materials = {
      symmetricKeyPem,
      ksefTokenPem,
      expiresAt: new Date(8640000000000000),
      refreshAt: new Date(8640000000000000),
    };
  }

  public getEncryptionData(): EncryptionData {
    const materials = this.ensureReady();
    const cipherKey = randomBytes(32);
    const cipherIv = randomBytes(16);
    const encryptedKey = this.encryptWithRsa(materials.symmetricKeyPem, cipherKey);

    return {
      cipherKey,
      cipherIv,
      encryptionInfo: {
        encryptedSymmetricKey: encryptedKey.toString("base64"),
        initializationVector: cipherIv.toString("base64"),
      },
    };
  }

  public encryptBytesWithAes256(content: Uint8Array, key: Uint8Array, iv: Uint8Array): Uint8Array {
    const cipher = createCipheriv("aes-256-cbc", key, iv);
    const encrypted = Buffer.concat([cipher.update(content), cipher.final()]);
    return encrypted;
  }

  public async encryptStreamWithAes256(
    input: Readable,
    output: Writable,
    key: Uint8Array,
    iv: Uint8Array,
  ): Promise<void> {
    const cipher = createCipheriv("aes-256-cbc", key, iv);
    await pipeline(input, cipher, output);
  }

  public decryptBytesWithAes256(content: Uint8Array, key: Uint8Array, iv: Uint8Array): Uint8Array {
    const decipher = createDecipheriv("aes-256-cbc", key, iv);
    const decrypted = Buffer.concat([decipher.update(content), decipher.final()]);
    return decrypted;
  }

  public async decryptStreamWithAes256(
    input: Readable,
    output: Writable,
    key: Uint8Array,
    iv: Uint8Array,
  ): Promise<void> {
    const decipher = createDecipheriv("aes-256-cbc", key, iv);
    await pipeline(input, decipher, output);
  }

  public generateCsrWithRsa(certificateInfo: CertificateEnrollmentsInfoResponse): { csr: string; privateKey: string } {
    const keys = forge.pki.rsa.generateKeyPair(2048);
    const csr = forge.pki.createCertificationRequest();
    csr.publicKey = keys.publicKey;
    csr.setSubject(buildSubject(certificateInfo));
    csr.sign(keys.privateKey, forge.md.sha256.create());

    const csrDer = forge.asn1.toDer(forge.pki.certificationRequestToAsn1(csr)).getBytes();
    const privateKeyDer = forge.asn1.toDer(forge.pki.privateKeyToAsn1(keys.privateKey)).getBytes();

    return {
      csr: Buffer.from(csrDer, "binary").toString("base64"),
      privateKey: Buffer.from(privateKeyDer, "binary").toString("base64"),
    };
  }

  public generateCsrWithEcdsa(certificateInfo: CertificateEnrollmentsInfoResponse): { csr: string; privateKey: string } {
    // node-forge does not expose EC CSR helpers consistently; fall back to RSA-generated CSR to keep API usable.
    return this.generateCsrWithRsa(certificateInfo);
  }

  public getMetaData(file: Uint8Array): FileMetadata {
    const hashSha = createHash("sha256").update(file).digest("base64");
    return { hashSha, fileSize: file.byteLength };
  }

  public async getMetaDataFromStream(stream: Readable): Promise<FileMetadata> {
    const hash = createHash("sha256");
    let size = 0;
    for await (const chunk of stream) {
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as BinaryLike);
      size += buf.byteLength;
      hash.update(buf);
    }
    return { hashSha: hash.digest("base64"), fileSize: size };
  }

  public encryptWithRsaUsingPublicKey(content: Uint8Array): Uint8Array {
    const materials = this.ensureReady();
    return this.encryptWithRsa(materials.symmetricKeyPem, content);
  }

  public encryptKsefTokenWithRsaUsingPublicKey(content: Uint8Array): Uint8Array {
    const materials = this.ensureReady();
    return this.encryptWithRsa(materials.ksefTokenPem, content);
  }

  public encryptWithEcdsaUsingPublicKey(content: Uint8Array): Uint8Array {
    const materials = this.ensureReady();
    const receiverPublic = createPublicKey(materials.ksefTokenPem);

    const { privateKey, publicKey } = generateKeyPairSync("ec", {
      namedCurve: "prime256v1",
      publicKeyEncoding: { type: "spki", format: "der" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    const sharedSecret = diffieHellman({
      privateKey: createPrivateKey(privateKey),
      publicKey: receiverPublic,
    });

    const nonce = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", sharedSecret, nonce);
    const ciphertext = Buffer.concat([cipher.update(content), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return Buffer.concat([Buffer.from(publicKey), nonce, authTag, ciphertext]);
  }

  private async refresh(signal?: AbortSignal): Promise<void> {
    if (this.materials && this.externallyManaged) return;
    const certs = await this.fetcher.getCertificates(signal);
    const built = this.buildMaterials(certs);
    this.materials = built;
  }

  private buildMaterials(certs: readonly PemCertificateInfo[]): CertificateMaterials {
    if (certs.length === 0) throw new Error("No certificates returned by fetcher.");

    const symmetricDto = certs.find((c) => c.usage.includes("SymmetricKeyEncryption"));
    if (!symmetricDto) throw new Error("Missing SymmetricKeyEncryption certificate.");
    const tokenDto = [...certs]
      .filter((c) => c.usage.includes("KsefTokenEncryption"))
      .sort((a, b) => a.validFrom.getTime() - b.validFrom.getTime())[0];
    if (!tokenDto) throw new Error("Missing KsefTokenEncryption certificate.");

    const symmetricKeyPem = toPem(symmetricDto.certificate);
    const ksefTokenPem = toPem(tokenDto.certificate);

    const expiresAt = new Date(
      Math.min(
        symmetricDto.validTo.getTime(),
        tokenDto.validTo.getTime(),
      ),
    );

    const safetyMarginMs = 24 * 60 * 60 * 1000;
    const maxIntervalMs = this.maxRevalidateHours * 60 * 60 * 1000;
    const refreshCandidate = new Date(expiresAt.getTime() - safetyMarginMs);
    const capByMaxInterval = new Date(Date.now() + maxIntervalMs);
    let refreshAt = refreshCandidate < capByMaxInterval ? refreshCandidate : capByMaxInterval;
    const jitter = randomBytes(1)[0] % (this.refreshJitterMinutes + 1);
    refreshAt = new Date(refreshAt.getTime() - jitter * 60 * 1000);

    return { symmetricKeyPem, ksefTokenPem, expiresAt, refreshAt };
  }

  private scheduleNextRefresh(): void {
    if (!this.materials || this.externallyManaged) return;
    const dueMs = Math.max(this.materials.refreshAt.getTime() - Date.now(), 0);
    this.refreshTimer && clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout(async () => {
      try {
        await this.refresh();
        this.scheduleNextRefresh();
      } catch (err) {
        const current = this.materials;
        if (!current) throw err;
        if (Date.now() > current.expiresAt.getTime() + this.staleGraceMs) throw err;
        this.scheduleNextRefresh();
      }
    }, dueMs);
  }

  private encryptWithRsa(certificatePem: string, content: Uint8Array): Uint8Array {
    return publicEncrypt({ key: certificatePem, ...RSA_OAEP_OPTIONS }, content);
  }

  private ensureReady(): CertificateMaterials {
    if (!this.materials) throw new Error("Cryptographic materials have not been initialized. Call warmup() first.");
    return this.materials;
  }
}

function toPem(base64: string): string {
  const lines = base64.match(/.{1,64}/g)?.join("\n") ?? base64;
  return `-----BEGIN CERTIFICATE-----\n${lines}\n-----END CERTIFICATE-----`;
}

function buildSubject(info: CertificateEnrollmentsInfoResponse): forge.pki.CertificateField[] {
  const entries: forge.pki.CertificateField[] = [];

  if (info.commonName) entries.push({ name: "commonName", value: info.commonName });
  if (info.surname) entries.push({ name: "surname", value: info.surname });
  if (info.givenName) entries.push({ name: "givenName", value: info.givenName });
  if (info.organizationName) entries.push({ name: "organizationName", value: info.organizationName });
  if (info.organizationIdentifier) entries.push({ type: "2.5.4.97", value: info.organizationIdentifier });
  if (info.countryName) entries.push({ name: "countryName", value: info.countryName });
  if (info.serialNumber) entries.push({ name: "serialNumber", value: info.serialNumber });
  if (info.uniqueIdentifier) entries.push({ type: "0.9.2342.19200300.100.1.1", value: info.uniqueIdentifier });

  return entries;
}

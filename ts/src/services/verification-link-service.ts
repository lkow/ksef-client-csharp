import type { QRCodeContextIdentifierType } from "../models/qrcode/context.js";
import type { KsefClientOptions } from "../clients/ksef-client.js";

export interface IVerificationLinkService {
  buildInvoiceVerificationUrl(nip: string, issueDate: Date, invoiceHash: string): string;
  buildCertificateVerificationUrl(
    sellerNip: string,
    contextIdentifierType: QRCodeContextIdentifierType,
    contextIdentifierValue: string,
    certificateSerial: string,
    invoiceHash: string,
    signedHash: string,
  ): string;
}

export class VerificationLinkService implements IVerificationLinkService {
  private readonly baseUrl: string;

  constructor(options: KsefClientOptions) {
    this.baseUrl = `${options.baseUrl ?? ""}/client-app`;
  }

  public buildInvoiceVerificationUrl(nip: string, issueDate: Date, invoiceHash: string): string {
    const date = formatDate(issueDate);
    const urlEncoded = base64UrlEncode(Buffer.from(invoiceHash, "base64"));
    return `${this.baseUrl}/invoice/${nip}/${date}/${urlEncoded}`;
  }

  public buildCertificateVerificationUrl(
    sellerNip: string,
    contextIdentifierType: QRCodeContextIdentifierType,
    contextIdentifierValue: string,
    certificateSerial: string,
    invoiceHash: string,
    signedHash: string,
  ): string {
    const invoiceHashUrlEncoded = base64UrlEncode(Buffer.from(invoiceHash, "base64"));
    return `${this.baseUrl}/certificate/${contextIdentifierType}/${contextIdentifierValue}/${sellerNip}/${certificateSerial}/${invoiceHashUrlEncoded}/${signedHash}`;
  }
}

function formatDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function base64UrlEncode(bytes: Uint8Array): string {
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

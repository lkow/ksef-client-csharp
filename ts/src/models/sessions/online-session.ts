import type { EncryptionInfo } from "./encryption.js";
import type { FormCode } from "./form-code.js";

export interface OpenOnlineSessionRequest {
  readonly formCode: FormCode;
  readonly encryption: EncryptionInfo;
}

export interface OpenOnlineSessionResponse {
  readonly referenceNumber: string;
  readonly validUntil: string;
}

export interface SendInvoiceResponse {
  readonly referenceNumber: string;
}

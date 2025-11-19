import type { EncryptionInfo } from "./encryption.js";
import type { FileMetadata } from "./file-metadata.js";
import type { FormCode } from "./form-code.js";

export interface BatchFilePartInfo {
  readonly ordinalNumber: number;
  /**
   * @deprecated FileName is obsolete in the .NET library and kept only for backward compatibility.
   */
  readonly fileName?: string;
  readonly fileSize: number;
  readonly fileHash: string;
}

export interface BatchFileInfo {
  readonly fileSize: number;
  readonly fileHash: string;
  readonly fileParts: readonly BatchFilePartInfo[];
}

export interface OpenBatchSessionRequest {
  readonly formCode: FormCode;
  readonly batchFile: BatchFileInfo;
  readonly encryption: EncryptionInfo;
  readonly offlineMode?: boolean;
}

export interface PackagePartSignatureInitResponseType {
  readonly method: string;
  readonly ordinalNumber: number;
  readonly url: string;
  readonly headers?: Record<string, string>;
}

export interface OpenBatchSessionResponse {
  readonly referenceNumber: string;
  readonly partUploadRequests: readonly PackagePartSignatureInitResponseType[];
}

export interface BatchPartSendingInfo {
  readonly data: Uint8Array;
  readonly metadata?: FileMetadata;
  readonly ordinalNumber: number;
}

export interface BatchPartStreamSendingInfo {
  readonly dataStream: ReadableStream | NodeJS.ReadableStream;
  readonly metadata?: FileMetadata;
  readonly ordinalNumber: number;
}

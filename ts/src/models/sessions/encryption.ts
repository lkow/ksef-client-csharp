export interface EncryptionInfo {
  readonly encryptedSymmetricKey: string;
  readonly initializationVector: string;
}

export interface EncryptionData {
  readonly cipherKey: Uint8Array;
  readonly cipherIv: Uint8Array;
  readonly encryptionInfo: EncryptionInfo;
}

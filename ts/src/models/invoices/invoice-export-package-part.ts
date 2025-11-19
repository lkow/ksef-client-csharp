export interface InvoiceExportPackagePart {
  readonly ordinalNumber: number;
  readonly partName: string;
  readonly method: string;
  readonly url: string;
  readonly partSize: number;
  readonly partHash: string;
  readonly encryptedPartSize: number;
  readonly encryptedPartHash: string;
  readonly expirationDate: string;
}

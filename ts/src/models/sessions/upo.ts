/** Metadata for a single UPO download page. */
export interface UpoPageResponse {
  readonly referenceNumber: string;
  readonly downloadUrl: URL;
  readonly downloadUrlExpirationDate: Date;
}

export interface UpoResponse {
  readonly pages: readonly UpoPageResponse[];
}

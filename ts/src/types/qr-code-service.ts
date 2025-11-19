export interface IQrCodeService {
  generateQrCode(payloadUrl: string, pixelsPerModule?: number, qrCodeResolutionInPx?: number): Promise<Uint8Array>;
  addLabelToQrCode(qrCodePng: Uint8Array, label: string, fontSizePx?: number): Promise<Uint8Array>;
}

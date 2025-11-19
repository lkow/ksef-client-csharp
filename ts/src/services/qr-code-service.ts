import QRCode from "qrcode";
import Jimp from "jimp";
import type { IQrCodeService } from "../types/qr-code-service.js";

export class QrCodeService implements IQrCodeService {
  public async generateQrCode(payloadUrl: string, pixelsPerModule = 20, qrCodeSize = 300): Promise<Uint8Array> {
    const buffer = await QRCode.toBuffer(payloadUrl, {
      scale: pixelsPerModule,
      width: qrCodeSize,
      margin: 0,
      color: { dark: "#000000", light: "#FFFFFF" },
      type: "png",
    });
    return new Uint8Array(buffer);
  }

  public async addLabelToQrCode(qrPng: Uint8Array, label: string, fontSizePx = 14): Promise<Uint8Array> {
    const base = await Jimp.read(Buffer.from(qrPng));
    const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    const textHeight = Jimp.measureTextHeight(font, label, base.bitmap.width) + 4;

    const canvas = await Jimp.create(base.bitmap.width, base.bitmap.height + textHeight, 0xffffffff);

    canvas.composite(base, 0, 0);
    canvas.print(font, 0, base.bitmap.height + 2, {
      text: label,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    }, base.bitmap.width, textHeight);

    const result = await canvas.getBufferAsync(Jimp.MIME_PNG);
    return new Uint8Array(result);
  }
}

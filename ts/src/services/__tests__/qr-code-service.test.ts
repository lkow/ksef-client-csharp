import { describe, expect, it } from "vitest";
import Jimp from "jimp";
import { QrCodeService } from "../qr-code-service.js";

describe("QrCodeService", () => {
  it("creates QR code PNG and adds label", async () => {
    const service = new QrCodeService();
    const qr = await service.generateQrCode("https://example.com", 4, 120);
    expect(Buffer.from(qr).subarray(0, 4).toString("hex")).toBe("89504e47");

    const labeled = await service.addLabelToQrCode(qr, "label");
    const base = await Jimp.read(Buffer.from(qr));
    const withLabel = await Jimp.read(Buffer.from(labeled));
    expect(withLabel.bitmap.height).toBeGreaterThan(base.bitmap.height);
  });
});

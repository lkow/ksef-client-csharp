import { describe, expect, it } from "vitest";
import { buildApiErrorMessage } from "../api-error-response.js";

describe("buildApiErrorMessage", () => {
  it("concatenates detail codes and descriptions", () => {
    const text = buildApiErrorMessage(
      {
        exception: {
          exceptionDetailList: [
            { exceptionCode: 1, exceptionDescription: "Missing" },
            { exceptionCode: 2, exceptionDescription: "Invalid", details: ["Field"] },
          ],
        },
      },
      () => "fallback",
    );
    expect(text).toContain("1");
    expect(text).toContain("Missing.");
    expect(text).toContain("2");
    expect(text).toContain("Field");
  });

  it("uses fallback when no details", () => {
    const text = buildApiErrorMessage({}, () => "fallback");
    expect(text).toBe("fallback");
  });
});

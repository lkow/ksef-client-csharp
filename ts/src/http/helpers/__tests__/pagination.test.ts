import { describe, expect, it } from "vitest";
import { appendPagination } from "../pagination.js";

describe("appendPagination", () => {
  it("appends size and offset preserving order", () => {
    const result = appendPagination("path", 5, 20);

    expect(result).toEqual("path?pageSize=20&pageOffset=5");
  });

  it("skips null or non-positive values", () => {
    const result = appendPagination("path", 0, null);

    expect(result).toEqual("path");
  });

  it("adds ampersand when query already exists", () => {
    const result = appendPagination("path?status=Active", undefined, 50);

    expect(result).toEqual("path?status=Active&pageSize=50");
  });
});

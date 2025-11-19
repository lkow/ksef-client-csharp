import { describe, expect, it } from "vitest";
import { PersonTokenService } from "../person-token-service.js";

function buildJwt(payload: object): string {
  const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${header}.${body}.`;
}

describe("PersonTokenService", () => {
  it("maps claims to person token", () => {
    const service = new PersonTokenService();
    const payload = {
      iss: "issuer",
      aud: ["a"],
      exp: 1700000000,
      iat: 1600000000,
      per: ["p1"],
      rol: ["r1"],
      pep: ["e1"],
      typ: "type",
      cit: "cit",
      civ: "civ",
      aum: "auth",
      arn: "arn",
      sud: { givenNames: ["A"], surname: "B" },
      ipp: { onClientIpChange: "block" },
    };

    const jwt = buildJwt(payload);
    const token = service.mapFromJwt(jwt);
    expect(token.issuer).toBe("issuer");
    expect(token.audiences).toEqual(["a"]);
    expect(token.roles).toContain("p1");
    expect(token.rolesRaw).toContain("r1");
    expect(token.permissionsEffective).toContain("e1");
    expect(token.subjectDetails?.surname).toBe("B");
  });
});

import type { PersonToken, TokenIppPolicy, TokenSubjectDetails } from "../models/token/index.js";

export interface IPersonTokenService {
  mapFromJwt(jwt: string): PersonToken;
}

export class PersonTokenService implements IPersonTokenService {
  public mapFromJwt(jwt: string): PersonToken {
    if (!jwt || jwt.trim().length === 0) {
      throw new Error("jwt cannot be empty");
    }

    const [, payloadSegment] = jwt.split(".");
    if (!payloadSegment) {
      throw new Error("Invalid JWT");
    }

    const payloadJson = decodeBase64Url(payloadSegment);
    const payload = JSON.parse(payloadJson) as Record<string, unknown>;
    const claims = payload ?? {};

    const get = (key: string): string | undefined => {
      const value = (claims as Record<string, unknown>)[key];
      return typeof value === "string" ? value : undefined;
    };

    const getMany = (...keys: string[]): string[] => {
      const values: string[] = [];
      for (const key of keys) {
        const val = (claims as Record<string, unknown>)[key];
        if (typeof val === "string") values.push(val);
        if (Array.isArray(val)) {
          values.push(...val.filter((v): v is string => typeof v === "string"));
        }
      }
      return [...new Set(values.map((v) => v))];
    };

    const exp = typeof claims["exp"] === "number" ? new Date((claims["exp"] as number) * 1000) : undefined;
    const iat = typeof claims["iat"] === "number" ? new Date((claims["iat"] as number) * 1000) : undefined;

    const subjectDetails = parseJson<TokenSubjectDetails>(unwrapIfQuoted((claims as any)["sud"] as string));
    const ipPolicy = parseJson<TokenIppPolicy>(unwrapIfQuoted((claims as any)["ipp"] as string));

    const per = parseStringArray((claims as any)["per"] as string | string[] | undefined);
    const pec = parseStringArray((claims as any)["pec"] as string | string[] | undefined);
    const rol = parseStringArray((claims as any)["rol"] as string | string[] | undefined);
    const pep = parseStringArray((claims as any)["pep"] as string | string[] | undefined);

    const roleTypes = [
      "role",
      "roles",
      "permissions",
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
    ];
    const classicRoles = getMany(...roleTypes);
    const unifiedRoles = Array.from(new Set([...classicRoles, ...per, ...rol]));

    return {
      issuer: get("iss"),
      audiences: parseStringArray(claims["aud"] as string | string[] | undefined),
      issuedAt: iat,
      expiresAt: exp,
      roles: unifiedRoles,
      tokenType: get("typ"),
      contextIdType: get("cit"),
      contextIdValue: get("civ"),
      authMethod: get("aum"),
      authRequestNumber: get("arn"),
      subjectDetails,
      permissions: per,
      permissionsExcluded: pec,
      rolesRaw: rol,
      permissionsEffective: pep,
      ipPolicy,
    };
  }
}

function decodeBase64Url(segment: string): string {
  segment = segment.replace(/-/g, "+").replace(/_/g, "/");
  const pad = segment.length % 4;
  if (pad) segment += "=".repeat(4 - pad);
  return Buffer.from(segment, "base64").toString("utf8");
}

function parseJson<T>(maybeJson?: string | object): T | undefined {
  if (!maybeJson) return undefined;
  if (typeof maybeJson === "object") return maybeJson as T;
  try {
    const unwrapped = unwrapIfQuoted(maybeJson);
    return JSON.parse(unwrapped) as T;
  } catch {
    return undefined;
  }
}

function unwrapIfQuoted(value?: string): string | undefined {
  if (!value) return value;
  if (value.length > 1 && value.startsWith("\"") && value.endsWith("\"")) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}

function parseStringArray(value?: string | string[]): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return Array.from(new Set(value.filter((x): x is string => typeof x === "string")));
  const unwrapped = unwrapIfQuoted(value);
  try {
    const parsed = JSON.parse(unwrapped);
    if (Array.isArray(parsed)) {
      return Array.from(new Set(parsed.filter((x): x is string => typeof x === "string")));
    }
  } catch {
    // ignore
  }
  if (unwrapped.includes(",")) {
    return Array.from(new Set(unwrapped.split(",").map((x) => x.trim()).filter((x) => x.length > 0)));
  }
  return [unwrapped];
}

import { describe, expect, it, vi } from "vitest";
import { AuthCoordinator } from "../auth-coordinator.js";
import type { IAuthorizationClient } from "../../clients/authorization-client.js";
import type { AuthenticationChallengeResponse } from "../../models/authorization/authentication-challenge.js";
import type { AuthStatus } from "../../models/auth-status.js";

function createAuthClient(): IAuthorizationClient {
  const statusSequence: AuthStatus[] = [
    {
      status: { code: 100, description: "Processing" },
    },
    {
      status: { code: 200, description: "Done" },
    },
  ];

  const client: IAuthorizationClient = {
    getAuthChallenge: vi.fn(async () => ({
      challenge: "abc",
      timestamp: new Date("2024-01-01T00:00:00Z"),
    } satisfies AuthenticationChallengeResponse)),
    submitXadesAuthRequest: vi.fn(async () => ({
      referenceNumber: "ref",
      authenticationToken: { token: "auth" },
    })),
    submitKsefTokenAuthRequest: vi.fn(async () => ({
      referenceNumber: "ref",
      authenticationToken: { token: "auth" },
    })),
    getAuthStatus: vi.fn(async () => statusSequence.shift() ?? statusSequence[statusSequence.length - 1]),
    getAccessToken: vi.fn(async () => ({ accessToken: { token: "access" } } as any)),
    refreshAccessToken: vi.fn(async () => ({ accessToken: { token: "refresh" } } as any)),
  } as unknown as IAuthorizationClient;

  return client;
}

describe("AuthCoordinator", () => {
  it("runs XML-based authentication flow", async () => {
    const client = createAuthClient();
    const coordinator = new AuthCoordinator(client, { pollIntervalMs: 0, timeoutMs: 2000 });
    const signer = vi.fn(async (xml: string) => xml + "<signed />");

    const result = await coordinator.authAsync("Nip", "123", "certificateSubject", signer);
    expect(result.accessToken.token).toBe("access");
    expect((client.getAuthChallenge as any).mock.calls.length).toBe(1);
    expect(signer).toHaveBeenCalled();
  });

  it("runs KSeF token authentication flow", async () => {
    const client = createAuthClient();
    const crypto = {
      encryptKsefTokenWithRsaUsingPublicKey: vi.fn(() => Buffer.from("enc")),
      encryptWithEcdsaUsingPublicKey: vi.fn(() => Buffer.from("enc")),
    } as any;

    const coordinator = new AuthCoordinator(client, { pollIntervalMs: 0, timeoutMs: 2000 });
    const result = await coordinator.authKsefTokenAsync("Nip", "123", "tok", crypto, "Rsa");
    expect(result.accessToken.token).toBe("access");
    expect(crypto.encryptKsefTokenWithRsaUsingPublicKey).toHaveBeenCalled();
  });
});

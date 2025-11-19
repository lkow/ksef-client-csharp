import type { IAuthorizationClient } from "../clients/authorization-client.js";
import type { AuthenticationKsefTokenRequest } from "../models/authorization/authentication-ksef-token-request.js";
import type { AuthenticationTokenAuthorizationPolicy, AuthenticationTokenContextIdentifierType, AuthenticationTokenRequest, AuthenticationTokenSubjectIdentifierType } from "../models/authorization/authentication-token.js";
import type { AuthenticationOperationStatusResponse, SignatureResponse, TokenInfo } from "../models/authorization/operation-tokens.js";
import { serializeAuthTokenRequest } from "../serialization/authTokenRequestSerializer.js";
import type { ICryptographyService } from "./cryptography-service.js";
import type { EncryptionMethod } from "../models/authorization/encryption-method.js";
import type { AuthStatus } from "../models/auth-status.js";

export interface AuthCoordinatorOptions {
  readonly pollIntervalMs?: number;
  readonly timeoutMs?: number;
}

export interface IAuthCoordinator {
  authAsync(
    contextIdentifierType: AuthenticationTokenContextIdentifierType,
    contextIdentifierValue: string,
    identifierType: AuthenticationTokenSubjectIdentifierType,
    xmlSigner: (unsignedXml: string) => Promise<string>,
    authorizationPolicy?: AuthenticationTokenAuthorizationPolicy,
    signal?: AbortSignal,
    verifyCertificateChain?: boolean,
  ): Promise<AuthenticationOperationStatusResponse>;

  authKsefTokenAsync(
    contextIdentifierType: AuthenticationTokenContextIdentifierType,
    contextIdentifierValue: string,
    tokenKsef: string,
    cryptographyService: ICryptographyService,
    encryptionMethod?: EncryptionMethod,
    authorizationPolicy?: AuthenticationTokenAuthorizationPolicy,
    signal?: AbortSignal,
  ): Promise<AuthenticationOperationStatusResponse>;

  refreshAccessTokenAsync(refreshToken: string, signal?: AbortSignal): Promise<TokenInfo>;
}

export class AuthCoordinator implements IAuthCoordinator {
  private readonly pollIntervalMs: number;
  private readonly timeoutMs: number;

  constructor(
    private readonly authorizationClient: IAuthorizationClient,
    options: AuthCoordinatorOptions = {},
  ) {
    this.pollIntervalMs = options.pollIntervalMs ?? 1000;
    this.timeoutMs = options.timeoutMs ?? 2 * 60 * 1000;
  }

  public async authAsync(
    contextIdentifierType: AuthenticationTokenContextIdentifierType,
    contextIdentifierValue: string,
    identifierType: AuthenticationTokenSubjectIdentifierType,
    xmlSigner: (unsignedXml: string) => Promise<string>,
    authorizationPolicy?: AuthenticationTokenAuthorizationPolicy,
    signal?: AbortSignal,
    verifyCertificateChain = false,
  ): Promise<AuthenticationOperationStatusResponse> {
    const challenge = await this.authorizationClient.getAuthChallenge(signal);

    const request: AuthenticationTokenRequest = {
      challenge: challenge.challenge,
      contextIdentifier: { type: contextIdentifierType, value: contextIdentifierValue },
      subjectIdentifierType: identifierType,
      authorizationPolicy,
    };

    const unsignedXml = serializeAuthTokenRequest(request);
    const signedXml = await xmlSigner(unsignedXml);

    const submission = await this.authorizationClient.submitXadesAuthRequest(signedXml, verifyCertificateChain, signal);
    await this.waitForAuthCompletion(submission, signal);
    return this.authorizationClient.getAccessToken(submission.authenticationToken.token, signal);
  }

  public async authKsefTokenAsync(
    contextIdentifierType: AuthenticationTokenContextIdentifierType,
    contextIdentifierValue: string,
    tokenKsef: string,
    cryptographyService: ICryptographyService,
    encryptionMethod: EncryptionMethod = "ECDsa",
    authorizationPolicy?: AuthenticationTokenAuthorizationPolicy,
    signal?: AbortSignal,
  ): Promise<AuthenticationOperationStatusResponse> {
    const challenge = await this.authorizationClient.getAuthChallenge(signal);
    const tokenWithTimestamp = `${tokenKsef}|${challenge.timestamp.getTime()}`;
    const tokenBytes = Buffer.from(tokenWithTimestamp, "utf8");

    const encrypted = encryptionMethod === "Rsa"
      ? cryptographyService.encryptKsefTokenWithRsaUsingPublicKey(tokenBytes)
      : cryptographyService.encryptWithEcdsaUsingPublicKey(tokenBytes);

    const request: AuthenticationKsefTokenRequest = {
      challenge: challenge.challenge,
      contextIdentifier: {
        type: contextIdentifierType,
        value: contextIdentifierValue,
      },
      authorizationPolicy,
      encryptedToken: Buffer.from(encrypted).toString("base64"),
    };

    const submission = await this.authorizationClient.submitKsefTokenAuthRequest(request, signal);
    await this.waitForAuthCompletion(submission, signal);
    return this.authorizationClient.getAccessToken(submission.authenticationToken.token, signal);
  }

  public refreshAccessTokenAsync(refreshToken: string, signal?: AbortSignal): Promise<TokenInfo> {
    return this.authorizationClient.refreshAccessToken(refreshToken, signal).then((r) => r.accessToken);
  }

  private async waitForAuthCompletion(
    submission: SignatureResponse,
    signal?: AbortSignal,
  ): Promise<void> {
    const start = Date.now();
    let lastStatus: AuthStatus | undefined;
    do {
      lastStatus = await this.authorizationClient.getAuthStatus(
        submission.referenceNumber,
        submission.authenticationToken.token,
        signal,
      );

      const code = lastStatus.status.code;
      if (code >= 400 && code < 500) {
        const details = lastStatus.status.details?.length
          ? lastStatus.status.details.join(", ")
          : "brak szczegółów";
        throw new Error(
          `Błąd autoryzacji KSeF. Status: ${code}, Opis: ${lastStatus.status.description}, Szczegóły: ${details}`,
        );
      }

      if (code === 200) {
        return;
      }

      if (!signal?.aborted) {
        await new Promise((resolve) => setTimeout(resolve, this.pollIntervalMs));
      }
    } while (Date.now() - start < this.timeoutMs && !signal?.aborted);

    const details = lastStatus?.status.details?.length
      ? lastStatus.status.details.join(", ")
      : "brak szczegółów";
    throw new Error(
      `Timeout uwierzytelniania: Brak tokena po ${Math.round(this.timeoutMs / 1000)}s. Status: ${lastStatus?.status.code}, Opis: ${lastStatus?.status.description}, Szczegóły: ${details}`,
    );
  }
}

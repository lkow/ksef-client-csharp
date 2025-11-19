import { ClientBase } from "./client-base.js";
import type { RestClientExecutor } from "../http/rest-client.js";
import type { RouteBuilder } from "../http/route-builder.js";
import { Routes } from "../http/routes.js";
import { RestRequest } from "../http/rest-request.js";
import { RestContentType } from "../http/rest-content-type.js";
import type { AuthenticationChallengeResponse } from "../models/authorization/authentication-challenge.js";
import type { SignatureResponse } from "../models/authorization/operation-tokens.js";
import type { AuthStatus } from "../models/auth-status.js";
import type { AuthenticationOperationStatusResponse, RefreshTokenResponse } from "../models/authorization/operation-tokens.js";
import type { AuthenticationKsefTokenRequest } from "../models/authorization/authentication-ksef-token-request.js";

export interface AuthorizationClientDependencies {
  readonly restClient: RestClientExecutor;
  readonly routeBuilder: RouteBuilder;
}

export interface IAuthorizationClient {
  getAuthChallenge(signal?: AbortSignal): Promise<AuthenticationChallengeResponse>;
  submitXadesAuthRequest(
    signedXml: string,
    verifyCertificateChain?: boolean,
    signal?: AbortSignal,
  ): Promise<SignatureResponse>;
  submitKsefTokenAuthRequest(
    requestPayload: AuthenticationKsefTokenRequest,
    signal?: AbortSignal,
  ): Promise<SignatureResponse>;
  getAuthStatus(
    authOperationReferenceNumber: string,
    authenticationToken: string,
    signal?: AbortSignal,
  ): Promise<AuthStatus>;
  getAccessToken(authenticationToken: string, signal?: AbortSignal): Promise<AuthenticationOperationStatusResponse>;
  refreshAccessToken(refreshToken: string, signal?: AbortSignal): Promise<RefreshTokenResponse>;
}

export class AuthorizationClient extends ClientBase implements IAuthorizationClient {
  constructor(dependencies: AuthorizationClientDependencies) {
    super(dependencies.restClient, dependencies.routeBuilder);
  }

  public getAuthChallenge(signal?: AbortSignal): Promise<AuthenticationChallengeResponse> {
    return this.executeWithResponse(Routes.Authorization.Challenge, "POST", { signal });
  }

  public async submitXadesAuthRequest(
    signedXml: string,
    verifyCertificateChain = false,
    signal?: AbortSignal,
  ): Promise<SignatureResponse> {
    const trimmed = signedXml?.trim();
    if (!trimmed) {
      throw new Error("signedXml cannot be empty");
    }

    const verifyValue = String(verifyCertificateChain).toLowerCase();
    const endpoint = `${Routes.Authorization.XadesSignature}?verifyCertificateChain=${verifyValue}`;
    const request = RestRequest.new(this.routeBuilder.build(endpoint), "POST").withBody(trimmed, RestContentType.Xml);

    return this.restClient.sendWithBody<SignatureResponse, string>(request, signal);
  }

  public submitKsefTokenAuthRequest(
    requestPayload: AuthenticationKsefTokenRequest,
    signal?: AbortSignal,
  ): Promise<SignatureResponse> {
    if (!requestPayload) {
      throw new Error("requestPayload cannot be null");
    }

    return this.executeWithBodyAndResponse(Routes.Authorization.KsefToken, requestPayload, { signal });
  }

  public getAuthStatus(
    authOperationReferenceNumber: string,
    authenticationToken: string,
    signal?: AbortSignal,
  ): Promise<AuthStatus> {
    if (!authOperationReferenceNumber || authOperationReferenceNumber.trim().length === 0) {
      throw new Error("authOperationReferenceNumber cannot be empty");
    }

    if (!authenticationToken || authenticationToken.trim().length === 0) {
      throw new Error("authenticationToken cannot be empty");
    }

    const encodedReference = encodeURIComponent(authOperationReferenceNumber);
    const endpoint = Routes.Authorization.Status(encodedReference);
    return this.executeWithResponse(endpoint, "GET", { accessToken: authenticationToken, signal });
  }

  public getAccessToken(
    authenticationToken: string,
    signal?: AbortSignal,
  ): Promise<AuthenticationOperationStatusResponse> {
    if (!authenticationToken || authenticationToken.trim().length === 0) {
      throw new Error("authenticationToken cannot be empty");
    }

    return this.executeWithResponse(Routes.Authorization.Token.Redeem, "POST", {
      accessToken: authenticationToken,
      signal,
    });
  }

  public refreshAccessToken(refreshToken: string, signal?: AbortSignal): Promise<RefreshTokenResponse> {
    if (!refreshToken || refreshToken.trim().length === 0) {
      throw new Error("refreshToken cannot be empty");
    }

    return this.executeWithResponse(Routes.Authorization.Token.Refresh, "POST", {
      accessToken: refreshToken,
      signal,
    });
  }
}

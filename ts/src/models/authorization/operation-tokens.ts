/**
 * Simple token container models.
 */
export interface TokenInfo {
  readonly token: string;
  readonly validUntil: Date;
}

export interface OperationToken {
  readonly token: string;
  readonly validUntil: Date;
}

export interface AuthenticationOperationStatusResponse {
  readonly accessToken: TokenInfo;
  readonly refreshToken?: TokenInfo;
}

export interface RefreshTokenResponse {
  readonly accessToken: TokenInfo;
}

export interface SignatureResponse {
  readonly referenceNumber: string;
  readonly authenticationToken: OperationToken;
}

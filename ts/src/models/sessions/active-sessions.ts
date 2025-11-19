import { StatusInfo } from '../common.js';

export type AuthenticationMethod =
  | 'Token'
  | 'TrustedProfile'
  | 'InternalCertificate'
  | 'QualifiedSignature'
  | 'QualifiedSeal'
  | 'PersonalSignature'
  | 'PeppolSignature';

export interface ActiveSessionStatus extends StatusInfo {}

export interface AuthenticationListItem {
  readonly startDate: Date;
  readonly authenticationMethod: AuthenticationMethod;
  readonly status: ActiveSessionStatus;
  readonly isTokenRedeemed: boolean;
  readonly lastTokenRefreshDate: Date;
  readonly refreshTokenValidUntil: Date;
  readonly referenceNumber: string;
  readonly isCurrent: boolean;
}

export interface AuthenticationListResponse {
  readonly continuationToken?: string;
  readonly items: readonly AuthenticationListItem[];
}

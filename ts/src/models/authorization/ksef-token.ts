import { AuthenticationTokenAuthorizationPolicy, AuthenticationTokenContextIdentifier } from './authentication-token.js';

export type KsefTokenPermissionType =
  | 'InvoiceRead'
  | 'InvoiceWrite'
  | 'CredentialsRead'
  | 'CredentialsManage'
  | 'SubunitManage'
  | 'EnforcementOperations'
  | 'PeppolId';

export interface KsefTokenRequest {
  readonly permissions: readonly KsefTokenPermissionType[];
  readonly description?: string;
}

export interface KsefTokenResponse {
  readonly referenceNumber: string;
  readonly token: string;
}

export type AuthenticationKsefTokenSubjectIdentifierType = 'nip' | 'pesel' | 'fingerprint';

export interface AuthenticationKsefTokenSubjectIdentifier {
  readonly type: AuthenticationKsefTokenSubjectIdentifierType;
  readonly value: string;
}

export interface AuthenticationKsefTokenRequest {
  readonly challenge: string;
  readonly contextIdentifier: AuthenticationTokenContextIdentifier;
  readonly encryptedToken: string;
  readonly authorizationPolicy?: AuthenticationTokenAuthorizationPolicy;
}

export type AuthenticationKsefTokenStatus = 'Pending' | 'Active' | 'Revoking' | 'Revoked' | 'Failed';

export interface AuthenticationKsefToken {
  readonly referenceNumber: string;
  readonly authorIdentifier: AuthenticationKsefTokenSubjectIdentifier;
  readonly contextIdentifier: AuthenticationTokenContextIdentifier;
  readonly description?: string;
  readonly requestedPermissions: readonly KsefTokenPermissionType[];
  readonly dateCreated: Date;
  readonly lastUseDate?: Date;
  readonly status: AuthenticationKsefTokenStatus;
  readonly statusDetails?: readonly string[];
}

export interface QueryKsefTokensResponse {
  readonly continuationToken?: string;
  readonly tokens: readonly AuthenticationKsefToken[];
}

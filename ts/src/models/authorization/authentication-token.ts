/**
 * Shared types used across the authorization/token generation workflows.
 */
export type AuthenticationTokenContextIdentifierType = 'Nip' | 'InternalId' | 'NipVatUe' | 'PeppolId';

export interface AuthenticationTokenContextIdentifier {
  readonly type: AuthenticationTokenContextIdentifierType;
  readonly value?: string;
}

export type AuthenticationTokenSubjectIdentifierType = 'certificateSubject' | 'certificateFingerprint';

export interface AuthenticationTokenAllowedIps {
  readonly ip4Addresses?: readonly string[];
  readonly ip4Ranges?: readonly string[];
  readonly ip4Masks?: readonly string[];
}

export interface AuthenticationTokenAuthorizationPolicy {
  readonly allowedIps?: AuthenticationTokenAllowedIps;
}

export interface AuthenticationTokenRequest {
  readonly challenge: string;
  readonly contextIdentifier: AuthenticationTokenContextIdentifier;
  readonly subjectIdentifierType: AuthenticationTokenSubjectIdentifierType;
  readonly authorizationPolicy?: AuthenticationTokenAuthorizationPolicy;
}

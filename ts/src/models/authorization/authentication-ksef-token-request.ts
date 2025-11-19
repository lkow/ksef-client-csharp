import type {
  AuthenticationTokenAuthorizationPolicy,
  AuthenticationTokenContextIdentifier,
} from './authentication-token.js';

/**
 * Mirrors AuthenticationKsefTokenRequest from the .NET client.
 */
export interface AuthenticationKsefTokenRequest {
  readonly challenge: string;
  readonly contextIdentifier: AuthenticationTokenContextIdentifier;
  readonly encryptedToken: string;
  readonly authorizationPolicy?: AuthenticationTokenAuthorizationPolicy;
}

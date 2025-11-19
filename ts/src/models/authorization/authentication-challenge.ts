/**
 * Mirrors AuthenticationChallengeResponse from the .NET client.
 */
export interface AuthenticationChallengeResponse {
  readonly challenge: string;
  readonly timestamp: Date;
}

import { StatusInfo } from './common.js';
import { AuthenticationMethod } from './sessions/active-sessions.js';

export interface AuthStatus {
  readonly startDate: Date;
  readonly authenticationMethod: AuthenticationMethod;
  readonly status: StatusInfo;
  readonly isTokenRedeemed?: boolean;
  readonly lastTokenRefreshDate?: Date;
  readonly refreshTokenValidUntil?: Date;
}

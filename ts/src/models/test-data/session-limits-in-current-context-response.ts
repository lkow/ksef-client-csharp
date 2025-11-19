import type { TestDataSessionLimitsBase } from "./test-data-session-limits-base.js";

export interface SessionLimitsInCurrentContextResponse {
  readonly onlineSession?: TestDataSessionLimitsBase;
  readonly batchSession?: TestDataSessionLimitsBase;
}

import type { StatusInfo } from '../common.js';

export interface PermissionsOperationStatusResponse {
  readonly status: StatusInfo;
}

export interface PermissionsAttachmentAllowedResponse {
  readonly isAttachmentAllowed: boolean;
  readonly revokedDate?: Date;
}

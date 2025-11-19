export type SessionStatus = 'Succeeded' | 'InProgress' | 'Failed';

export type SessionType = 'Online' | 'Batch';

export interface SessionsFilter {
  readonly referenceNumber?: string;
  readonly dateCreatedFrom?: Date;
  readonly dateCreatedTo?: Date;
  readonly dateClosedFrom?: Date;
  readonly dateClosedTo?: Date;
  readonly dateModifiedFrom?: Date;
  readonly dateModifiedTo?: Date;
  readonly statuses?: readonly SessionStatus[];
}

import { ClientBase } from './client-base.js';
import { Routes } from '../http/routes.js';
import type { RestClientExecutor } from '../http/rest-client.js';
import type { RouteBuilder } from '../http/route-builder.js';
import type {
  PermissionsAttachmentAllowedResponse,
  PermissionsOperationStatusResponse,
} from '../models/permissions/index.js';

export interface PermissionOperationClientDependencies {
  readonly restClient: RestClientExecutor;
  readonly routeBuilder: RouteBuilder;
}

export interface IPermissionOperationClient {
  getOperationStatus(
    operationReferenceNumber: string,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<PermissionsOperationStatusResponse>;
  getAttachmentPermissionStatus(
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<PermissionsAttachmentAllowedResponse>;
}

export class PermissionOperationClient extends ClientBase implements IPermissionOperationClient {
  constructor(dependencies: PermissionOperationClientDependencies) {
    super(dependencies.restClient, dependencies.routeBuilder);
  }

  public getOperationStatus(
    operationReferenceNumber: string,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<PermissionsOperationStatusResponse> {
    ensureString(operationReferenceNumber, 'operationReferenceNumber');
    ensureString(accessToken, 'accessToken');

    const endpoint = Routes.Permissions.Operations.ByReference(encodeURIComponent(operationReferenceNumber));
    return this.executeWithResponse(endpoint, 'GET', { accessToken, signal });
  }

  public getAttachmentPermissionStatus(
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<PermissionsAttachmentAllowedResponse> {
    ensureString(accessToken, 'accessToken');
    return this.executeWithResponse(Routes.Permissions.Attachments.Status, 'GET', { accessToken, signal });
  }
}

function ensureString(value: string | null | undefined, name: string): asserts value is string {
  if (!value || value.trim().length === 0) {
    throw new Error(`${name} cannot be empty`);
  }
}

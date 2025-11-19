import { ClientBase } from './client-base.js';
import { Routes } from '../http/routes.js';
import type { RouteBuilder } from '../http/route-builder.js';
import type { RestClientExecutor } from '../http/rest-client.js';
import type { OperationResponse } from '../models/common.js';

export interface RevokePermissionClientDependencies {
  readonly restClient: RestClientExecutor;
  readonly routeBuilder: RouteBuilder;
}

export interface IRevokePermissionClient {
  revokeCommonPermission(permissionId: string, accessToken: string, signal?: AbortSignal): Promise<OperationResponse>;
  revokeAuthorizationPermission(
    permissionId: string,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<OperationResponse>;
}

export class RevokePermissionClient extends ClientBase implements IRevokePermissionClient {
  constructor(dependencies: RevokePermissionClientDependencies) {
    super(dependencies.restClient, dependencies.routeBuilder);
  }

  public revokeCommonPermission(
    permissionId: string,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<OperationResponse> {
    ensureString(permissionId, 'permissionId');
    ensureString(accessToken, 'accessToken');

    const endpoint = Routes.Permissions.Common.GrantById(encodeURIComponent(permissionId));
    return this.executeWithResponse(endpoint, 'DELETE', { accessToken, signal });
  }

  public revokeAuthorizationPermission(
    permissionId: string,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<OperationResponse> {
    ensureString(permissionId, 'permissionId');
    ensureString(accessToken, 'accessToken');

    const endpoint = Routes.Permissions.Authorizations.GrantById(encodeURIComponent(permissionId));
    return this.executeWithResponse(endpoint, 'DELETE', { accessToken, signal });
  }
}

function ensureString(value: string | null | undefined, name: string): asserts value is string {
  if (!value || value.trim().length === 0) {
    throw new Error(`${name} cannot be empty`);
  }
}

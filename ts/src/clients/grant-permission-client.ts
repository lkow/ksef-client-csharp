import { ClientBase } from './client-base.js';
import { Routes } from '../http/routes.js';
import type { RestClientExecutor } from '../http/rest-client.js';
import type { RouteBuilder } from '../http/route-builder.js';
import type { OperationResponse } from '../models/common.js';
import type {
  GrantPermissionsAuthorizationRequest,
  GrantPermissionsEntityRequest,
  GrantPermissionsEuEntityRepresentativeRequest,
  GrantPermissionsEuEntityRequest,
  GrantPermissionsIndirectEntityRequest,
  GrantPermissionsPersonRequest,
  GrantPermissionsSubunitRequest,
} from '../models/permissions/index.js';

export interface GrantPermissionClientDependencies {
  readonly restClient: RestClientExecutor;
  readonly routeBuilder: RouteBuilder;
}

export interface IGrantPermissionClient {
  grantPermissionsForPerson(
    requestPayload: GrantPermissionsPersonRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<OperationResponse>;
  grantPermissionsForEntity(
    requestPayload: GrantPermissionsEntityRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<OperationResponse>;
  grantAuthorizationPermissions(
    requestPayload: GrantPermissionsAuthorizationRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<OperationResponse>;
  grantPermissionsForIndirectEntity(
    requestPayload: GrantPermissionsIndirectEntityRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<OperationResponse>;
  grantPermissionsForSubunit(
    requestPayload: GrantPermissionsSubunitRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<OperationResponse>;
  grantPermissionsForEuEntity(
    requestPayload: GrantPermissionsEuEntityRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<OperationResponse>;
  grantPermissionsForEuEntityRepresentative(
    requestPayload: GrantPermissionsEuEntityRepresentativeRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<OperationResponse>;
}

export class GrantPermissionClient extends ClientBase implements IGrantPermissionClient {
  constructor(dependencies: GrantPermissionClientDependencies) {
    super(dependencies.restClient, dependencies.routeBuilder);
  }

  public grantPermissionsForPerson(
    requestPayload: GrantPermissionsPersonRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<OperationResponse> {
    ensurePayload(requestPayload, 'requestPayload');
    ensureAccessToken(accessToken);

    return this.executeWithBodyAndResponse(Routes.Permissions.Grants.Persons, requestPayload, {
      accessToken,
      signal,
    });
  }

  public grantPermissionsForEntity(
    requestPayload: GrantPermissionsEntityRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<OperationResponse> {
    ensurePayload(requestPayload, 'requestPayload');
    ensureAccessToken(accessToken);

    return this.executeWithBodyAndResponse(Routes.Permissions.Grants.Entities, requestPayload, {
      accessToken,
      signal,
    });
  }

  public grantAuthorizationPermissions(
    requestPayload: GrantPermissionsAuthorizationRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<OperationResponse> {
    ensurePayload(requestPayload, 'requestPayload');
    ensureAccessToken(accessToken);

    return this.executeWithBodyAndResponse(Routes.Permissions.Grants.Authorizations, requestPayload, {
      accessToken,
      signal,
    });
  }

  public grantPermissionsForIndirectEntity(
    requestPayload: GrantPermissionsIndirectEntityRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<OperationResponse> {
    ensurePayload(requestPayload, 'requestPayload');
    ensureAccessToken(accessToken);

    return this.executeWithBodyAndResponse(Routes.Permissions.Grants.Indirect, requestPayload, {
      accessToken,
      signal,
    });
  }

  public grantPermissionsForSubunit(
    requestPayload: GrantPermissionsSubunitRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<OperationResponse> {
    ensurePayload(requestPayload, 'requestPayload');
    ensureAccessToken(accessToken);

    return this.executeWithBodyAndResponse(Routes.Permissions.Grants.Subunits, requestPayload, {
      accessToken,
      signal,
    });
  }

  public grantPermissionsForEuEntity(
    requestPayload: GrantPermissionsEuEntityRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<OperationResponse> {
    ensurePayload(requestPayload, 'requestPayload');
    ensureAccessToken(accessToken);

    return this.executeWithBodyAndResponse(Routes.Permissions.Grants.EuEntities, requestPayload, {
      accessToken,
      signal,
    });
  }

  public grantPermissionsForEuEntityRepresentative(
    requestPayload: GrantPermissionsEuEntityRepresentativeRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<OperationResponse> {
    ensurePayload(requestPayload, 'requestPayload');
    ensureAccessToken(accessToken);

    return this.executeWithBodyAndResponse(
      Routes.Permissions.Grants.EuEntitiesRepresentatives,
      requestPayload,
      {
        accessToken,
        signal,
      },
    );
  }
}

function ensurePayload<T>(payload: T | null | undefined, name: string): asserts payload is T {
  if (!payload) {
    throw new Error(`${name} cannot be null`);
  }
}

function ensureAccessToken(token: string | null | undefined): asserts token is string {
  if (!token || token.trim().length === 0) {
    throw new Error('accessToken cannot be empty');
  }
}

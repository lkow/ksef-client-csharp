import { ClientBase } from './client-base.js';
import { Routes } from '../http/routes.js';
import { appendPagination } from '../http/helpers/pagination.js';
import type { RestClientExecutor } from '../http/rest-client.js';
import type { RouteBuilder } from '../http/route-builder.js';
import type {
  AuthorizationGrant,
  EntityAuthorizationsQueryRequest,
  EntityRole,
  EuEntityPermission,
  EuEntityPermissionsQueryRequest,
  PagedAuthorizationsResponse,
  PagedPermissionsResponse,
  PagedRolesResponse,
  PersonalPermission,
  PersonalPermissionsQueryRequest,
  PersonPermission,
  PersonPermissionsQueryRequest,
  SubordinateEntityRole,
  SubordinateEntityRolesQueryRequest,
  SubunitPermission,
  SubunitPermissionsQueryRequest,
} from '../models/permissions/index.js';

export interface SearchPermissionClientDependencies {
  readonly restClient: RestClientExecutor;
  readonly routeBuilder: RouteBuilder;
}

export interface ISearchPermissionClient {
  searchGrantedPersonalPermissions(
    requestPayload: PersonalPermissionsQueryRequest,
    accessToken: string,
    pageOffset?: number | null,
    pageSize?: number | null,
    signal?: AbortSignal,
  ): Promise<PagedPermissionsResponse<PersonalPermission>>;
  searchGrantedPersonPermissions(
    requestPayload: PersonPermissionsQueryRequest,
    accessToken: string,
    pageOffset?: number | null,
    pageSize?: number | null,
    signal?: AbortSignal,
  ): Promise<PagedPermissionsResponse<PersonPermission>>;
  searchSubunitAdminPermissions(
    requestPayload: SubunitPermissionsQueryRequest,
    accessToken: string,
    pageOffset?: number | null,
    pageSize?: number | null,
    signal?: AbortSignal,
  ): Promise<PagedPermissionsResponse<SubunitPermission>>;
  searchEntityInvoiceRoles(
    accessToken: string,
    pageOffset?: number | null,
    pageSize?: number | null,
    signal?: AbortSignal,
  ): Promise<PagedRolesResponse<EntityRole>>;
  searchSubordinateEntityInvoiceRoles(
    requestPayload: SubordinateEntityRolesQueryRequest,
    accessToken: string,
    pageOffset?: number | null,
    pageSize?: number | null,
    signal?: AbortSignal,
  ): Promise<PagedRolesResponse<SubordinateEntityRole>>;
  searchEntityAuthorizationGrants(
    requestPayload: EntityAuthorizationsQueryRequest,
    accessToken: string,
    pageOffset?: number | null,
    pageSize?: number | null,
    signal?: AbortSignal,
  ): Promise<PagedAuthorizationsResponse<AuthorizationGrant>>;
  searchGrantedEuEntityPermissions(
    requestPayload: EuEntityPermissionsQueryRequest,
    accessToken: string,
    pageOffset?: number | null,
    pageSize?: number | null,
    signal?: AbortSignal,
  ): Promise<PagedPermissionsResponse<EuEntityPermission>>;
}

export class SearchPermissionClient extends ClientBase implements ISearchPermissionClient {
  constructor(dependencies: SearchPermissionClientDependencies) {
    super(dependencies.restClient, dependencies.routeBuilder);
  }

  public searchGrantedPersonalPermissions(
    requestPayload: PersonalPermissionsQueryRequest,
    accessToken: string,
    pageOffset?: number | null,
    pageSize?: number | null,
    signal?: AbortSignal,
  ): Promise<PagedPermissionsResponse<PersonalPermission>> {
    ensurePayload(requestPayload, 'requestPayload');
    ensureString(accessToken, 'accessToken');

    const endpoint = withPagination(Routes.Permissions.Query.PersonalGrants, pageOffset, pageSize);
    return this.executeWithBodyAndResponse<PagedPermissionsResponse<PersonalPermission>, PersonalPermissionsQueryRequest>(
      endpoint,
      requestPayload,
      { accessToken, signal },
    );
  }

  public searchGrantedPersonPermissions(
    requestPayload: PersonPermissionsQueryRequest,
    accessToken: string,
    pageOffset?: number | null,
    pageSize?: number | null,
    signal?: AbortSignal,
  ): Promise<PagedPermissionsResponse<PersonPermission>> {
    ensurePayload(requestPayload, 'requestPayload');
    ensureString(accessToken, 'accessToken');

    const endpoint = withPagination(Routes.Permissions.Query.PersonsGrants, pageOffset, pageSize);
    return this.executeWithBodyAndResponse<PagedPermissionsResponse<PersonPermission>, PersonPermissionsQueryRequest>(
      endpoint,
      requestPayload,
      { accessToken, signal },
    );
  }

  public searchSubunitAdminPermissions(
    requestPayload: SubunitPermissionsQueryRequest,
    accessToken: string,
    pageOffset?: number | null,
    pageSize?: number | null,
    signal?: AbortSignal,
  ): Promise<PagedPermissionsResponse<SubunitPermission>> {
    ensurePayload(requestPayload, 'requestPayload');
    ensureString(accessToken, 'accessToken');

    const endpoint = withPagination(Routes.Permissions.Query.SubunitsGrants, pageOffset, pageSize);
    return this.executeWithBodyAndResponse<PagedPermissionsResponse<SubunitPermission>, SubunitPermissionsQueryRequest>(
      endpoint,
      requestPayload,
      { accessToken, signal },
    );
  }

  public searchEntityInvoiceRoles(
    accessToken: string,
    pageOffset?: number | null,
    pageSize?: number | null,
    signal?: AbortSignal,
  ): Promise<PagedRolesResponse<EntityRole>> {
    ensureString(accessToken, 'accessToken');

    const endpoint = withPagination(Routes.Permissions.Query.EntitiesRoles, pageOffset, pageSize);
    return this.executeWithResponse<PagedRolesResponse<EntityRole>>(endpoint, 'GET', { accessToken, signal });
  }

  public searchSubordinateEntityInvoiceRoles(
    requestPayload: SubordinateEntityRolesQueryRequest,
    accessToken: string,
    pageOffset?: number | null,
    pageSize?: number | null,
    signal?: AbortSignal,
  ): Promise<PagedRolesResponse<SubordinateEntityRole>> {
    ensurePayload(requestPayload, 'requestPayload');
    ensureString(accessToken, 'accessToken');

    const endpoint = withPagination(Routes.Permissions.Query.SubordinateEntitiesRoles, pageOffset, pageSize);
    return this.executeWithBodyAndResponse<
      PagedRolesResponse<SubordinateEntityRole>,
      SubordinateEntityRolesQueryRequest
    >(endpoint, requestPayload, { accessToken, signal });
  }

  public searchEntityAuthorizationGrants(
    requestPayload: EntityAuthorizationsQueryRequest,
    accessToken: string,
    pageOffset?: number | null,
    pageSize?: number | null,
    signal?: AbortSignal,
  ): Promise<PagedAuthorizationsResponse<AuthorizationGrant>> {
    ensurePayload(requestPayload, 'requestPayload');
    ensureString(accessToken, 'accessToken');

    const endpoint = withPagination(Routes.Permissions.Query.AuthorizationsGrants, pageOffset, pageSize);
    return this.executeWithBodyAndResponse<
      PagedAuthorizationsResponse<AuthorizationGrant>,
      EntityAuthorizationsQueryRequest
    >(endpoint, requestPayload, { accessToken, signal });
  }

  public searchGrantedEuEntityPermissions(
    requestPayload: EuEntityPermissionsQueryRequest,
    accessToken: string,
    pageOffset?: number | null,
    pageSize?: number | null,
    signal?: AbortSignal,
  ): Promise<PagedPermissionsResponse<EuEntityPermission>> {
    ensurePayload(requestPayload, 'requestPayload');
    ensureString(accessToken, 'accessToken');

    const endpoint = withPagination(Routes.Permissions.Query.EuEntitiesGrants, pageOffset, pageSize);
    return this.executeWithBodyAndResponse<PagedPermissionsResponse<EuEntityPermission>, EuEntityPermissionsQueryRequest>(
      endpoint,
      requestPayload,
      { accessToken, signal },
    );
  }
}

function withPagination(path: string, pageOffset?: number | null, pageSize?: number | null): string {
  return appendPagination(path, pageOffset, pageSize);
}

function ensurePayload<T>(payload: T | null | undefined, name: string): asserts payload is T {
  if (!payload) {
    throw new Error(`${name} cannot be null`);
  }
}

function ensureString(value: string | null | undefined, name: string): asserts value is string {
  if (!value || value.trim().length === 0) {
    throw new Error(`${name} cannot be empty`);
  }
}

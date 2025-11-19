export interface PagedPermissionsResponse<TPermission> {
  readonly permissions: readonly TPermission[];
  readonly hasMore: boolean;
}

export interface PagedAuthorizationsResponse<TAuthorization> {
  readonly authorizationGrants: readonly TAuthorization[];
  readonly hasMore: boolean;
}

export interface PagedRolesResponse<TRole> {
  readonly roles: readonly TRole[];
  readonly hasMore: boolean;
}

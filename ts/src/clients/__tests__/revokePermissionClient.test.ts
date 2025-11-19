import { describe, expect, it } from 'vitest';
import { RouteBuilder } from '../../http/route-builder.js';
import { FakeRestClient } from './test-utils.js';
import { RevokePermissionClient } from '../revoke-permission-client.js';

describe('RevokePermissionClient', () => {
  const buildClient = () => {
    const rest = new FakeRestClient({ referenceNumber: 'done' });
    const client = new RevokePermissionClient({ restClient: rest, routeBuilder: new RouteBuilder() });
    return { rest, client };
  };

  it('revokes common permissions', async () => {
    const { client, rest } = buildClient();

    await client.revokeCommonPermission('perm/123', 'access');

    expect(rest.lastRequest?.path).toBe('/api/v2/permissions/common/grants/perm%2F123');
    expect(rest.lastRequest?.method).toBe('DELETE');
    expect(rest.lastRequest?.accessToken).toBe('access');
  });

  it('revokes authorization permissions', async () => {
    const { client, rest } = buildClient();

    await client.revokeAuthorizationPermission('perm-1', 'access');

    expect(rest.lastRequest?.path).toBe('/api/v2/permissions/authorizations/grants/perm-1');
  });

  it('validates input', async () => {
    const { client } = buildClient();

    expect(() => client.revokeCommonPermission('', 'token')).toThrow('permissionId cannot be empty');
    expect(() => client.revokeCommonPermission('perm', '   ')).toThrow('accessToken cannot be empty');
  });
});

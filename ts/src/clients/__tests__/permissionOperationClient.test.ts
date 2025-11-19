import { describe, expect, it } from 'vitest';
import { RouteBuilder } from '../../http/route-builder.js';
import { FakeRestClient } from './test-utils.js';
import { PermissionOperationClient } from '../permission-operation-client.js';

describe('PermissionOperationClient', () => {
  const buildClient = () => {
    const rest = new FakeRestClient({ status: { code: 1, description: 'OK' } });
    const client = new PermissionOperationClient({ restClient: rest, routeBuilder: new RouteBuilder() });
    return { rest, client };
  };

  it('fetches operation status', async () => {
    const { client, rest } = buildClient();

    await client.getOperationStatus('op/123', 'token');

    expect(rest.lastRequest?.path).toBe('/api/v2/permissions/operations/op%2F123');
    expect(rest.lastRequest?.method).toBe('GET');
    expect(rest.lastRequest?.accessToken).toBe('token');
  });

  it('fetches attachment status', async () => {
    const { client, rest } = buildClient();

    await client.getAttachmentPermissionStatus('token');

    expect(rest.lastRequest?.path).toBe('/api/v2/permissions/attachments/status');
  });

  it('validates arguments', async () => {
    const { client } = buildClient();

    expect(() => client.getOperationStatus('', 'token')).toThrow('operationReferenceNumber cannot be empty');
    expect(() => client.getAttachmentPermissionStatus('')).toThrow('accessToken cannot be empty');
  });
});

import type { RestClientExecutor, RestClientOptions } from "../http/rest-client.js";
import { RestClient } from "../http/rest-client.js";
import { RouteBuilder, type RouteBuilderOptions } from "../http/route-builder.js";
import type { IActiveSessionsClient } from "./active-sessions-client.js";
import { ActiveSessionsClient } from "./active-sessions-client.js";
import type { IAuthorizationClient } from "./authorization-client.js";
import { AuthorizationClient } from "./authorization-client.js";
import type { IBatchSessionClient } from "./batch-session-client.js";
import { BatchSessionClient } from "./batch-session-client.js";
import type { ICertificateClient } from "./certificate-client.js";
import { CertificateClient } from "./certificate-client.js";
import type { IInvoiceDownloadClient } from "./invoice-download-client.js";
import { InvoiceDownloadClient } from "./invoice-download-client.js";
import type { IKsefTokenClient } from "./ksef-token-client.js";
import { KsefTokenClient } from "./ksef-token-client.js";
import type { IOnlineSessionClient } from "./online-session-client.js";
import { OnlineSessionClient } from "./online-session-client.js";
import type { IPeppolClient } from "./peppol-client.js";
import { PeppolClient } from "./peppol-client.js";
import type { IPermissionOperationClient } from "./permission-operation-client.js";
import { PermissionOperationClient } from "./permission-operation-client.js";
import type { IGrantPermissionClient } from "./grant-permission-client.js";
import { GrantPermissionClient } from "./grant-permission-client.js";
import type { IRevokePermissionClient } from "./revoke-permission-client.js";
import { RevokePermissionClient } from "./revoke-permission-client.js";
import type { ISearchPermissionClient } from "./search-permission-client.js";
import { SearchPermissionClient } from "./search-permission-client.js";
import type { ISessionStatusClient } from "./session-status-client.js";
import { SessionStatusClient } from "./session-status-client.js";

export interface KsefClientOptions {
  readonly baseUrl?: string;
  readonly customHeaders?: Record<string, string>;
  readonly fetchFn?: RestClientOptions["fetchFn"];
  readonly routeBuilder?: RouteBuilder;
  readonly routeBuilderOptions?: RouteBuilderOptions;
  readonly restClient?: RestClientExecutor;
}

export interface IKsefClient
  extends IActiveSessionsClient,
    IAuthorizationClient,
    IOnlineSessionClient,
    IBatchSessionClient,
    ISessionStatusClient,
    IInvoiceDownloadClient,
    IGrantPermissionClient,
    IRevokePermissionClient,
    ISearchPermissionClient,
    IPermissionOperationClient,
    ICertificateClient,
    IKsefTokenClient,
    IPeppolClient {}

interface InternalDeps {
  readonly restClient: RestClientExecutor;
  readonly routeBuilder: RouteBuilder;
}

export class KsefClient implements IKsefClient {
  private readonly activeSessionsClient: ActiveSessionsClient;
  private readonly authorizationClient: AuthorizationClient;
  private readonly onlineSessionClient: OnlineSessionClient;
  private readonly batchSessionClient: BatchSessionClient;
  private readonly sessionStatusClient: SessionStatusClient;
  private readonly invoiceDownloadClient: InvoiceDownloadClient;
  private readonly grantPermissionClient: GrantPermissionClient;
  private readonly revokePermissionClient: RevokePermissionClient;
  private readonly searchPermissionClient: SearchPermissionClient;
  private readonly permissionOperationClient: PermissionOperationClient;
  private readonly certificateClient: CertificateClient;
  private readonly ksefTokenClient: KsefTokenClient;
  private readonly peppolClient: PeppolClient;

  public getActiveSessions: IActiveSessionsClient["getActiveSessions"];
  public revokeCurrentSession: IActiveSessionsClient["revokeCurrentSession"];
  public revokeSession: IActiveSessionsClient["revokeSession"];

  public getAuthChallenge: IAuthorizationClient["getAuthChallenge"];
  public submitXadesAuthRequest: IAuthorizationClient["submitXadesAuthRequest"];
  public submitKsefTokenAuthRequest: IAuthorizationClient["submitKsefTokenAuthRequest"];
  public getAuthStatus: IAuthorizationClient["getAuthStatus"];
  public getAccessToken: IAuthorizationClient["getAccessToken"];
  public refreshAccessToken: IAuthorizationClient["refreshAccessToken"];

  public openOnlineSessionAsync: IOnlineSessionClient["openOnlineSessionAsync"];
  public sendOnlineSessionInvoiceAsync: IOnlineSessionClient["sendOnlineSessionInvoiceAsync"];
  public closeOnlineSessionAsync: IOnlineSessionClient["closeOnlineSessionAsync"];

  public openBatchSessionAsync: IBatchSessionClient["openBatchSessionAsync"];
  public closeBatchSessionAsync: IBatchSessionClient["closeBatchSessionAsync"];
  public sendBatchPartsAsync: IBatchSessionClient["sendBatchPartsAsync"];
  public sendBatchPartsWithStreamAsync: IBatchSessionClient["sendBatchPartsWithStreamAsync"];

  public getSessions: ISessionStatusClient["getSessions"];
  public getSessionStatus: ISessionStatusClient["getSessionStatus"];
  public getSessionInvoices: ISessionStatusClient["getSessionInvoices"];
  public getSessionInvoice: ISessionStatusClient["getSessionInvoice"];
  public getSessionFailedInvoices: ISessionStatusClient["getSessionFailedInvoices"];
  public getSessionInvoiceUpoByKsefNumber: ISessionStatusClient["getSessionInvoiceUpoByKsefNumber"];
  public getSessionInvoiceUpoByReferenceNumber: ISessionStatusClient["getSessionInvoiceUpoByReferenceNumber"];
  public getSessionUpo: ISessionStatusClient["getSessionUpo"];
  public getUpo: ISessionStatusClient["getUpo"];

  public getInvoiceAsync: IInvoiceDownloadClient["getInvoiceAsync"];
  public queryInvoiceMetadataAsync: IInvoiceDownloadClient["queryInvoiceMetadataAsync"];
  public exportInvoicesAsync: IInvoiceDownloadClient["exportInvoicesAsync"];
  public getInvoiceExportStatusAsync: IInvoiceDownloadClient["getInvoiceExportStatusAsync"];

  public grantPermissionsForPerson: IGrantPermissionClient["grantPermissionsForPerson"];
  public grantPermissionsForEntity: IGrantPermissionClient["grantPermissionsForEntity"];
  public grantAuthorizationPermissions: IGrantPermissionClient["grantAuthorizationPermissions"];
  public grantPermissionsForIndirectEntity: IGrantPermissionClient["grantPermissionsForIndirectEntity"];
  public grantPermissionsForSubunit: IGrantPermissionClient["grantPermissionsForSubunit"];
  public grantPermissionsForEuEntity: IGrantPermissionClient["grantPermissionsForEuEntity"];
  public grantPermissionsForEuEntityRepresentative: IGrantPermissionClient["grantPermissionsForEuEntityRepresentative"];

  public revokeCommonPermission: IRevokePermissionClient["revokeCommonPermission"];
  public revokeAuthorizationPermission: IRevokePermissionClient["revokeAuthorizationPermission"];

  public searchGrantedPersonalPermissions: ISearchPermissionClient["searchGrantedPersonalPermissions"];
  public searchGrantedPersonPermissions: ISearchPermissionClient["searchGrantedPersonPermissions"];
  public searchSubunitAdminPermissions: ISearchPermissionClient["searchSubunitAdminPermissions"];
  public searchEntityInvoiceRoles: ISearchPermissionClient["searchEntityInvoiceRoles"];
  public searchSubordinateEntityInvoiceRoles: ISearchPermissionClient["searchSubordinateEntityInvoiceRoles"];
  public searchEntityAuthorizationGrants: ISearchPermissionClient["searchEntityAuthorizationGrants"];
  public searchGrantedEuEntityPermissions: ISearchPermissionClient["searchGrantedEuEntityPermissions"];

  public getOperationStatus: IPermissionOperationClient["getOperationStatus"];
  public getAttachmentPermissionStatus: IPermissionOperationClient["getAttachmentPermissionStatus"];

  public getCertificateLimitsAsync: ICertificateClient["getCertificateLimitsAsync"];
  public getCertificateEnrollmentDataAsync: ICertificateClient["getCertificateEnrollmentDataAsync"];
  public sendCertificateEnrollmentAsync: ICertificateClient["sendCertificateEnrollmentAsync"];
  public getCertificateEnrollmentStatusAsync: ICertificateClient["getCertificateEnrollmentStatusAsync"];
  public getCertificateListAsync: ICertificateClient["getCertificateListAsync"];
  public revokeCertificateAsync: ICertificateClient["revokeCertificateAsync"];
  public getCertificateMetadataListAsync: ICertificateClient["getCertificateMetadataListAsync"];

  public generateKsefToken: IKsefTokenClient["generateKsefToken"];
  public queryKsefTokens: IKsefTokenClient["queryKsefTokens"];
  public getKsefToken: IKsefTokenClient["getKsefToken"];
  public revokeKsefToken: IKsefTokenClient["revokeKsefToken"];

  public queryPeppolProvidersAsync: IPeppolClient["queryPeppolProvidersAsync"];

  constructor(deps: InternalDeps) {
    this.activeSessionsClient = new ActiveSessionsClient(deps);
    this.authorizationClient = new AuthorizationClient(deps);
    this.onlineSessionClient = new OnlineSessionClient(deps);
    this.batchSessionClient = new BatchSessionClient(deps);
    this.sessionStatusClient = new SessionStatusClient(deps);
    this.invoiceDownloadClient = new InvoiceDownloadClient(deps);
    this.grantPermissionClient = new GrantPermissionClient(deps);
    this.revokePermissionClient = new RevokePermissionClient(deps);
    this.searchPermissionClient = new SearchPermissionClient(deps);
    this.permissionOperationClient = new PermissionOperationClient(deps);
    this.certificateClient = new CertificateClient(deps);
    this.ksefTokenClient = new KsefTokenClient(deps);
    this.peppolClient = new PeppolClient(deps);

    this.getActiveSessions = this.activeSessionsClient.getActiveSessions.bind(this.activeSessionsClient);
    this.revokeCurrentSession = this.activeSessionsClient.revokeCurrentSession.bind(this.activeSessionsClient);
    this.revokeSession = this.activeSessionsClient.revokeSession.bind(this.activeSessionsClient);

    this.getAuthChallenge = this.authorizationClient.getAuthChallenge.bind(this.authorizationClient);
    this.submitXadesAuthRequest = this.authorizationClient.submitXadesAuthRequest.bind(this.authorizationClient);
    this.submitKsefTokenAuthRequest = this.authorizationClient.submitKsefTokenAuthRequest.bind(this.authorizationClient);
    this.getAuthStatus = this.authorizationClient.getAuthStatus.bind(this.authorizationClient);
    this.getAccessToken = this.authorizationClient.getAccessToken.bind(this.authorizationClient);
    this.refreshAccessToken = this.authorizationClient.refreshAccessToken.bind(this.authorizationClient);

    this.openOnlineSessionAsync = this.onlineSessionClient.openOnlineSessionAsync.bind(this.onlineSessionClient);
    this.sendOnlineSessionInvoiceAsync = this.onlineSessionClient.sendOnlineSessionInvoiceAsync.bind(
      this.onlineSessionClient,
    );
    this.closeOnlineSessionAsync = this.onlineSessionClient.closeOnlineSessionAsync.bind(this.onlineSessionClient);

    this.openBatchSessionAsync = this.batchSessionClient.openBatchSessionAsync.bind(this.batchSessionClient);
    this.closeBatchSessionAsync = this.batchSessionClient.closeBatchSessionAsync.bind(this.batchSessionClient);
    this.sendBatchPartsAsync = this.batchSessionClient.sendBatchPartsAsync.bind(this.batchSessionClient);
    this.sendBatchPartsWithStreamAsync = this.batchSessionClient.sendBatchPartsWithStreamAsync.bind(
      this.batchSessionClient,
    );

    this.getSessions = this.sessionStatusClient.getSessions.bind(this.sessionStatusClient);
    this.getSessionStatus = this.sessionStatusClient.getSessionStatus.bind(this.sessionStatusClient);
    this.getSessionInvoices = this.sessionStatusClient.getSessionInvoices.bind(this.sessionStatusClient);
    this.getSessionInvoice = this.sessionStatusClient.getSessionInvoice.bind(this.sessionStatusClient);
    this.getSessionFailedInvoices = this.sessionStatusClient.getSessionFailedInvoices.bind(this.sessionStatusClient);
    this.getSessionInvoiceUpoByKsefNumber = this.sessionStatusClient.getSessionInvoiceUpoByKsefNumber.bind(
      this.sessionStatusClient,
    );
    this.getSessionInvoiceUpoByReferenceNumber = this.sessionStatusClient.getSessionInvoiceUpoByReferenceNumber.bind(
      this.sessionStatusClient,
    );
    this.getSessionUpo = this.sessionStatusClient.getSessionUpo.bind(this.sessionStatusClient);
    this.getUpo = this.sessionStatusClient.getUpo.bind(this.sessionStatusClient);

    this.getInvoiceAsync = this.invoiceDownloadClient.getInvoiceAsync.bind(this.invoiceDownloadClient);
    this.queryInvoiceMetadataAsync = this.invoiceDownloadClient.queryInvoiceMetadataAsync.bind(
      this.invoiceDownloadClient,
    );
    this.exportInvoicesAsync = this.invoiceDownloadClient.exportInvoicesAsync.bind(this.invoiceDownloadClient);
    this.getInvoiceExportStatusAsync = this.invoiceDownloadClient.getInvoiceExportStatusAsync.bind(
      this.invoiceDownloadClient,
    );

    this.grantPermissionsForPerson = this.grantPermissionClient.grantPermissionsForPerson.bind(
      this.grantPermissionClient,
    );
    this.grantPermissionsForEntity = this.grantPermissionClient.grantPermissionsForEntity.bind(
      this.grantPermissionClient,
    );
    this.grantAuthorizationPermissions = this.grantPermissionClient.grantAuthorizationPermissions.bind(
      this.grantPermissionClient,
    );
    this.grantPermissionsForIndirectEntity = this.grantPermissionClient.grantPermissionsForIndirectEntity.bind(
      this.grantPermissionClient,
    );
    this.grantPermissionsForSubunit = this.grantPermissionClient.grantPermissionsForSubunit.bind(
      this.grantPermissionClient,
    );
    this.grantPermissionsForEuEntity = this.grantPermissionClient.grantPermissionsForEuEntity.bind(
      this.grantPermissionClient,
    );
    this.grantPermissionsForEuEntityRepresentative = this.grantPermissionClient.grantPermissionsForEuEntityRepresentative.bind(
      this.grantPermissionClient,
    );

    this.revokeCommonPermission = this.revokePermissionClient.revokeCommonPermission.bind(
      this.revokePermissionClient,
    );
    this.revokeAuthorizationPermission = this.revokePermissionClient.revokeAuthorizationPermission.bind(
      this.revokePermissionClient,
    );

    this.searchGrantedPersonalPermissions = this.searchPermissionClient.searchGrantedPersonalPermissions.bind(
      this.searchPermissionClient,
    );
    this.searchGrantedPersonPermissions = this.searchPermissionClient.searchGrantedPersonPermissions.bind(
      this.searchPermissionClient,
    );
    this.searchSubunitAdminPermissions = this.searchPermissionClient.searchSubunitAdminPermissions.bind(
      this.searchPermissionClient,
    );
    this.searchEntityInvoiceRoles = this.searchPermissionClient.searchEntityInvoiceRoles.bind(this.searchPermissionClient);
    this.searchSubordinateEntityInvoiceRoles = this.searchPermissionClient.searchSubordinateEntityInvoiceRoles.bind(
      this.searchPermissionClient,
    );
    this.searchEntityAuthorizationGrants = this.searchPermissionClient.searchEntityAuthorizationGrants.bind(
      this.searchPermissionClient,
    );
    this.searchGrantedEuEntityPermissions = this.searchPermissionClient.searchGrantedEuEntityPermissions.bind(
      this.searchPermissionClient,
    );

    this.getOperationStatus = this.permissionOperationClient.getOperationStatus.bind(this.permissionOperationClient);
    this.getAttachmentPermissionStatus = this.permissionOperationClient.getAttachmentPermissionStatus.bind(
      this.permissionOperationClient,
    );

    this.getCertificateLimitsAsync = this.certificateClient.getCertificateLimitsAsync.bind(this.certificateClient);
    this.getCertificateEnrollmentDataAsync = this.certificateClient.getCertificateEnrollmentDataAsync.bind(
      this.certificateClient,
    );
    this.sendCertificateEnrollmentAsync = this.certificateClient.sendCertificateEnrollmentAsync.bind(
      this.certificateClient,
    );
    this.getCertificateEnrollmentStatusAsync = this.certificateClient.getCertificateEnrollmentStatusAsync.bind(
      this.certificateClient,
    );
    this.getCertificateListAsync = this.certificateClient.getCertificateListAsync.bind(this.certificateClient);
    this.revokeCertificateAsync = this.certificateClient.revokeCertificateAsync.bind(this.certificateClient);
    this.getCertificateMetadataListAsync = this.certificateClient.getCertificateMetadataListAsync.bind(
      this.certificateClient,
    );

    this.generateKsefToken = this.ksefTokenClient.generateKsefToken.bind(this.ksefTokenClient);
    this.queryKsefTokens = this.ksefTokenClient.queryKsefTokens.bind(this.ksefTokenClient);
    this.getKsefToken = this.ksefTokenClient.getKsefToken.bind(this.ksefTokenClient);
    this.revokeKsefToken = this.ksefTokenClient.revokeKsefToken.bind(this.ksefTokenClient);

    this.queryPeppolProvidersAsync = this.peppolClient.queryPeppolProvidersAsync.bind(this.peppolClient);
  }

  private static resolveDependencies(options: KsefClientOptions): InternalDeps {
    const restClient = options.restClient ??
      new RestClient({
        baseUrl: options.baseUrl,
        defaultHeaders: options.customHeaders,
        fetchFn: options.fetchFn,
      });

    const routeBuilder = options.routeBuilder ?? new RouteBuilder(options.routeBuilderOptions);

    return {
      restClient,
      routeBuilder,
    };
  }

  public static create(options: KsefClientOptions = {}): IKsefClient {
    return new KsefClient(KsefClient.resolveDependencies(options));
  }
}

export function createKsefClient(options: KsefClientOptions = {}): IKsefClient {
  return KsefClient.create(options);
}

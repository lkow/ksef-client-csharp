/**
 * Effective API rate limit models mirrored from the .NET version.
 */
export interface EffectiveApiRateLimitValues {
  /** Number of requests allowed per second. */
  readonly perSecond: number;
  /** Number of requests allowed per minute. */
  readonly perMinute: number;
  /** Number of requests allowed per hour. */
  readonly perHour: number;
}

export interface EffectiveApiRateLimits {
  readonly onlineSession?: EffectiveApiRateLimitValues;
  readonly batchSession?: EffectiveApiRateLimitValues;
  readonly invoiceSend?: EffectiveApiRateLimitValues;
  readonly invoiceStatus?: EffectiveApiRateLimitValues;
  readonly sessionList?: EffectiveApiRateLimitValues;
  readonly sessionInvoiceList?: EffectiveApiRateLimitValues;
  readonly sessionMisc?: EffectiveApiRateLimitValues;
  readonly invoiceMetadata?: EffectiveApiRateLimitValues;
  readonly invoiceExport?: EffectiveApiRateLimitValues;
  readonly invoiceDownload?: EffectiveApiRateLimitValues;
  readonly other?: EffectiveApiRateLimitValues;
}

export interface EffectiveApiRateLimitsRequest {
  readonly rateLimits: EffectiveApiRateLimits;
}

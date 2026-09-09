/**
 * Configuration options for SDKVisioner7Module.
 */
export interface SDKVisioner7ModuleOptions {
  /**
   * Base URL of the contracted Visioner7 service.
   * Default: https://service1.visioner7-api.com/api
   */
  baseUrl?: string;

  /**
   * Bearer token required by endpoints marked as "Auth required".
   * Sent as header `Authorization: Bearer <token>`.
   */
  authToken?: string;

  /**
   * Business token used by the exchange-rate endpoint (the `token` body field).
   * Defaults to "v7" per the provider documentation.
   */
  businessToken?: string;

  /**
   * HTTP request timeout in milliseconds. Default: 15000 ms.
   */
  timeout?: number;
}

/**
 * Async factory to configure the module (e.g. using ConfigService).
 */
export interface SDKVisioner7ModuleAsyncOptions {
  imports?: any[];
  useFactory: (
    ...args: any[]
  ) => Promise<SDKVisioner7ModuleOptions> | SDKVisioner7ModuleOptions;
  inject?: any[];
}

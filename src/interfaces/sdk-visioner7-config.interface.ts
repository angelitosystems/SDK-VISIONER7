/**
 * Opciones de configuración del módulo SDKVisioner7Module.
 */
export interface SDKVisioner7ModuleOptions {
  /**
   * URL base del servicio (por defecto: https://service1.visioner7-api.com/api)
   */
  baseUrl?: string;

  /**
   * Token/Bearer de autenticación requerido por los endpoints marcados como "Auth requerida".
   * Se enviará como header `Authorization: Bearer <token>`.
   */
  authToken?: string;

  /**
   * Token propio de negocio usado en el endpoint de Tipo de Cambio (campo `token` del body).
   * Por defecto "v7" según la documentación del proveedor.
   */
  businessToken?: string;

  /**
   * Timeout de las peticiones HTTP en milisegundos (por defecto 15000 ms).
   */
  timeout?: number;
}

/**
 * Factory asíncrona para configurar el módulo (ej. usando ConfigService).
 */
export interface SDKVisioner7ModuleAsyncOptions {
  imports?: any[];
  useFactory: (
    ...args: any[]
  ) => Promise<SDKVisioner7ModuleOptions> | SDKVisioner7ModuleOptions;
  inject?: any[];
}

/** @deprecated Usa {@link SDKVisioner7ModuleOptions} en su lugar. */
export type SunatModuleOptions = SDKVisioner7ModuleOptions;

/** @deprecated Usa {@link SDKVisioner7ModuleAsyncOptions} en su lugar. */
export type SunatModuleAsyncOptions = SDKVisioner7ModuleAsyncOptions;

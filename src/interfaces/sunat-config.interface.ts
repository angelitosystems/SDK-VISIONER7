/**
 * Opciones de configuración del módulo SunatModule.
 */
export interface SunatModuleOptions {
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
export interface SunatModuleAsyncOptions {
  imports?: any[];
  useFactory: (
    ...args: any[]
  ) => Promise<SunatModuleOptions> | SunatModuleOptions;
  inject?: any[];
}

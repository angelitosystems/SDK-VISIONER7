import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import {
  DEFAULT_BASE_URL,
  DEFAULT_BUSINESS_TOKEN,
  DEFAULT_TIMEOUT,
  SDK_VISIONER7_MODULE_OPTIONS,
} from './constants.js';
import { SDKVisioner7ApiException } from './exceptions/sdk-visioner7-api.exception.js';
import {
  ConsultarDniResponse,
  ConsultarRucResponse,
  GenerarCpeRequest,
  GenerarCpeResponse,
  GuiaRemisionRequest,
  GuiaRemisionResponse,
  GuiaRemisionTicketStatusRequest,
  GuiaRemisionTicketStatusResponse,
  LocalesEstablecimientosResponse,
  SDKVisioner7ModuleOptions,
  TipoCambioRequest,
  TipoCambioResponse,
  TipoConsultaLocal,
} from './interfaces/index.js';

@Injectable()
export class SDKVisioner7Service {
  private readonly logger = new Logger(SDKVisioner7Service.name);
  private readonly baseUrl: string;
  private readonly authToken?: string;
  private readonly businessToken: string;
  private readonly timeout: number;

  constructor(
    private readonly httpService: HttpService,
    @Inject(SDK_VISIONER7_MODULE_OPTIONS)
    private readonly options: SDKVisioner7ModuleOptions,
  ) {
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
    this.authToken = options.authToken;
    this.businessToken = options.businessToken ?? DEFAULT_BUSINESS_TOKEN;
    this.timeout = options.timeout ?? DEFAULT_TIMEOUT;
  }

  /* ============================================================
   * Consulta RUC-DNI
   * ============================================================ */

  /**
   * Consulta los datos de un contribuyente a partir de su RUC.
   * GET /sunatv1/consultar-ruc/{ruc}
   */
  async consultarRuc(ruc: string | number): Promise<ConsultarRucResponse> {
    const url = `${this.baseUrl}/sunatv1/consultar-ruc/${ruc}`;
    return this.request<ConsultarRucResponse>('GET', url);
  }

  /**
   * Consulta el domicilio fiscal o los establecimientos anexos de un RUC.
   * GET /sunatv1/locales-establecimientos/{ruc}/{tipo_consulta}
   *
   * @param tipoConsulta 1 = Domicilio fiscal, 2 = Establecimientos anexos
   */
  async consultarLocalesEstablecimientos(
    ruc: string | number,
    tipoConsulta: TipoConsultaLocal | number,
  ): Promise<LocalesEstablecimientosResponse> {
    const url = `${this.baseUrl}/sunatv1/locales-establecimientos/${ruc}/${tipoConsulta}`;
    return this.request<LocalesEstablecimientosResponse>('GET', url);
  }

  /**
   * Consulta los datos de una persona natural a partir de su DNI.
   * GET /sunatv1/consultar-personas/{dni}
   */
  async consultarDni(dni: string | number): Promise<ConsultarDniResponse> {
    const url = `${this.baseUrl}/sunatv1/consultar-personas/${dni}`;
    return this.request<ConsultarDniResponse>('GET', url);
  }

  /* ============================================================
   * Tipo de cambio
   * ============================================================ */

  /**
   * Obtiene el tipo de cambio SUNAT (compra/venta) para un año y mes dados.
   * POST /sunatv1/tipo-cambio
   */
  async obtenerTipoCambio(
    params: TipoCambioRequest,
  ): Promise<TipoCambioResponse> {
    const url = `${this.baseUrl}/sunatv1/tipo-cambio`;
    const body: TipoCambioRequest = {
      token: this.businessToken,
      ...params,
    };
    return this.request<TipoCambioResponse>('POST', url, body);
  }

  /* ============================================================
   * Emisión de Guías de Remisión
   * ============================================================ */

  /**
   * Emite una guía de remisión (remitente público, remitente privado o
   * transportista). El "tipo" de guía depende exclusivamente de los
   * campos incluidos en el payload; ver README para ejemplos de cada caso.
   * POST /v1/sunat/guia-remision
   */
  async emitirGuiaRemision(
    payload: GuiaRemisionRequest,
  ): Promise<GuiaRemisionResponse> {
    const url = `${this.baseUrl}/v1/sunat/guia-remision`;
    return this.request<GuiaRemisionResponse>('POST', url, payload);
  }

  /** Alias semántico de {@link emitirGuiaRemision} para remitente público. */
  async emitirGuiaRemisionRemitentePublico(
    payload: GuiaRemisionRequest,
  ): Promise<GuiaRemisionResponse> {
    return this.emitirGuiaRemision(payload);
  }

  /** Alias semántico de {@link emitirGuiaRemision} para remitente privado. */
  async emitirGuiaRemisionRemitentePrivado(
    payload: GuiaRemisionRequest,
  ): Promise<GuiaRemisionResponse> {
    return this.emitirGuiaRemision(payload);
  }

  /** Alias semántico de {@link emitirGuiaRemision} para transportista. */
  async emitirGuiaRemisionTransportista(
    payload: GuiaRemisionRequest,
  ): Promise<GuiaRemisionResponse> {
    return this.emitirGuiaRemision(payload);
  }

  /**
   * Consulta el estado de un ticket generado al emitir una guía de remisión.
   * POST /v1/sunat/guia-remision/ticket-status
   */
  async consultarTicketGuiaRemision(
    payload: GuiaRemisionTicketStatusRequest,
  ): Promise<GuiaRemisionTicketStatusResponse> {
    const url = `${this.baseUrl}/v1/sunat/guia-remision/ticket-status`;
    return this.request<GuiaRemisionTicketStatusResponse>(
      'POST',
      url,
      payload,
    );
  }

  /* ============================================================
   * Emisión de CPE (Comprobantes de Pago Electrónicos)
   * ============================================================ */

  /**
   * Genera un comprobante de pago electrónico (Factura al contado o al
   * crédito). El tipo de operación depende del contenido de
   * `detalle_forma_pago`: un único ítem "Contado" o "Credito" + cuotas.
   * POST /v1/sunat/generar-cpe
   */
  async generarCpe(payload: GenerarCpeRequest): Promise<GenerarCpeResponse> {
    const url = `${this.baseUrl}/v1/sunat/generar-cpe`;
    return this.request<GenerarCpeResponse>('POST', url, payload);
  }

  /** Alias semántico de {@link generarCpe} para facturación al contado. */
  async generarFacturaContado(
    payload: GenerarCpeRequest,
  ): Promise<GenerarCpeResponse> {
    return this.generarCpe(payload);
  }

  /** Alias semántico de {@link generarCpe} para facturación al crédito. */
  async generarFacturaCredito(
    payload: GenerarCpeRequest,
  ): Promise<GenerarCpeResponse> {
    return this.generarCpe(payload);
  }

  /* ============================================================
   * Helpers privados
   * ============================================================ */

  private async request<T>(
    method: 'GET' | 'POST',
    url: string,
    data?: unknown,
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...(this.authToken
          ? { Authorization: `Bearer ${this.authToken}` }
          : {}),
      },
    };

    const observable =
      method === 'GET'
        ? this.httpService.get<T>(url, config)
        : this.httpService.post<T>(url, data, config);

    const response = await firstValueFrom(
      observable.pipe(
        catchError((error: AxiosError) => {
          this.logger.error(
            `Error al llamar a ${url}: ${error.message}`,
            error.stack,
          );
          throw new SDKVisioner7ApiException(
            error.response?.data
              ? this.extractErrorMessage(error.response.data)
              : error.message,
            url,
            error.response?.data,
          );
        }),
      ),
    );

    return response.data;
  }

  private extractErrorMessage(data: unknown): string {
    if (data && typeof data === 'object') {
      const anyData = data as Record<string, unknown>;
      return (
        (anyData.msj_sunat as string) ||
        (anyData.message as string) ||
        (anyData.error as string) ||
        'Error desconocido al consultar el servicio SUNAT'
      );
    }
    return 'Error desconocido al consultar el servicio SUNAT';
  }
}

/** @deprecated Usa {@link SDKVisioner7Service} en su lugar. */
export const SunatService = SDKVisioner7Service;

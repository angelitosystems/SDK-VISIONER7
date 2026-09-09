import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Excepción lanzada cuando la API de Visioner7/SUNAT responde con un
 * error HTTP o con un `success: false` / `cod_sunat` distinto de "0".
 */
export class SDKVisioner7ApiException extends HttpException {
  public readonly providerResponse: unknown;
  public readonly endpoint: string;

  constructor(
    message: string,
    endpoint: string,
    providerResponse?: unknown,
    status: HttpStatus = HttpStatus.BAD_GATEWAY,
  ) {
    super(
      {
        message,
        endpoint,
        providerResponse,
      },
      status,
    );
    this.providerResponse = providerResponse;
    this.endpoint = endpoint;
  }
}

/** @deprecated Usa {@link SDKVisioner7ApiException} en su lugar. */
export const SunatApiException = SDKVisioner7ApiException;

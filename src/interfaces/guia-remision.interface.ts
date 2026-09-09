/* ============================================================
 * Emisión de Guía de Remisión (remitente público / privado / transportista)
 * POST /v1/sunat/guia-remision
 * ============================================================ */

export interface GuiaRemisionDetalleItem {
  ITEM: string;
  UNIDAD_MEDIDA: string;
  CANTIDAD: string;
  ORDER_ITEM: string;
  DESCRIPCION: string;
  CODIGO: string;
}

/**
 * Payload base común a los tres tipos de guía de remisión
 * (remitente público, remitente privado y transportista).
 * Todos los campos opcionales dependen del tipo de guía que se emita;
 * revisa la sección de documentación de cada caso en el README.
 */
export interface GuiaRemisionRequest {
  TIPO_PROCESO: string;
  NRO_DOCUMENTO_EMPRESA: string;
  USUARIO_SOL_EMPRESA: string;
  PASS_SOL_EMPRESA: string;
  PAS_FIRMA: string;
  COD_TIPO_DOCUMENTO: string;
  NRO_COMPROBANTE: string;
  ID_TOKEN: string;
  CLAVE_TOKEN: string;
  FECHA_DOCUMENTO: string;
  NOTA?: string;
  TIPO_DOCUMENTO_EMPRESA: string;
  RAZON_SOCIAL_EMPRESA: string;
  TIPO_DOCUMENTO_CLIENTE: string;
  NRO_DOCUMENTO_CLIENTE: string;
  RAZON_SOCIAL_CLIENTE: string;
  ITEM_ENVIO: string;
  COD_MOTIVO_TRASLADO: string;
  DESCRIPCION_MOTIVO_TRASLADO: string;
  COD_UND_PESO_BRUTO: string;
  PESO_BRUTO: string;
  TOTAL_BULTOS?: string;
  COD_MODALIDAD_TRASLADO: string;
  FECHA_INICIO: string;
  PLACA_VEHICULO?: string;
  COD_UBIGEO_DESTINO: string;
  DIRECCION_DESTINO: string;
  COD_UBIGEO_ORIGEN: string;
  DIRECCION_ORIGEN: string;
  NRO_DOCUMENTO_REFERENCIA?: string;
  COD_DOCUMENTO_RELACIODO?: string;
  DOCUMENTO_RELACIODO?: string;
  COD_DOCUMENTO_RELACIODO_EMPRESA?: string;
  NRO_DOCUMENTO_RELACIODO_EMPRESA?: string;
  FLG_ANULADO?: string;
  DOC_REFERENCIA_ANU?: string;
  COD_TIPO_DOC_REFANU?: string;

  // Datos de transportista (guía privada / transportista)
  TIPO_DOCUMENTO_TRANSPORTISTA?: string;
  NRO_DOCUMENTO_TRANSPORTISTA?: string;
  RAZON_SOCIAL_TRANSPORTISTA?: string;
  COD_TIPO_DOC_CHOFER?: string;
  NRO_DOC_CHOFER?: string;
  NOMBRES_CHOFER?: string;
  APELLIDOS_CHOFER?: string;
  LIC_CONDUCIR_CHOFER?: string;

  // Exclusivos de guía transportista
  NRO_DOCUMENTO_REMITENTE?: string;
  TIPO_DOCUMENTO_REMITENTE?: string;
  RAZON_SOCIAL_REMITENTE?: string;
  VEHICULO_ID_INSCRIPCION_MTC?: string;
  PLACA_CARRETA?: string;
  CARRETA_ID_INSCRIPCION_MTC?: string;
  COMPANY_ID_NROREG_MTC?: string;

  detalle: GuiaRemisionDetalleItem[];

  /** Permite extender con campos adicionales no documentados sin romper el tipado. */
  [key: string]: unknown;
}

export interface GuiaRemisionHashCdr {
  cod_sunat: string;
  msj_sunat: string;
  hash_cdr: string;
  ticket: string;
  url_guia: string;
}

export interface GuiaRemisionResponse {
  mensaje_xml: string;
  hash_cpe: string;
  hash_cdr: GuiaRemisionHashCdr;
}

/* ============================================================
 * Consulta de Ticket de Guía
 * POST /v1/sunat/guia-remision/ticket-status
 * ============================================================ */

export interface GuiaRemisionTicketStatusRequest {
  TICKET: string;
  NRO_DOCUMENTO_EMPRESA: string;
  USUARIO_SOL_EMPRESA: string;
  PASS_SOL_EMPRESA: string;
  ID_TOKEN: string;
  CLAVE_TOKEN: string;
  COD_TIPO_DOCUMENTO: string;
  NRO_COMPROBANTE: string;
  TIPO_PROCESO: string;
}

export type GuiaRemisionTicketStatusResponse = GuiaRemisionResponse;

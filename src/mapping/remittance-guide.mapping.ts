/**
 * Maps English SDK payloads/responses to the Spanish wire format
 * expected by the Visioner7 API for remittance guides
 * (guía de remisión electrónica).
 */

import {
  RemittanceGuideItem,
  RemittanceGuideRequest,
  RemittanceGuideResponse,
  RemittanceGuideTicketStatusRequest,
} from '../interfaces/remittance-guide.interface.js';

/* ============================================================
 * Request mapping
 * ============================================================ */

/** Wire item for the `detalle` array. */
export interface RemittanceGuideWireItem {
  ITEM: string;
  UNIDAD_MEDIDA: string;
  CANTIDAD: string;
  ORDER_ITEM: string;
  DESCRIPCION: string;
  CODIGO: string;
}

/** Wire payload for POST /v1/sunat/guia-remision. */
export interface RemittanceGuideWireRequest {
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

  TIPO_DOCUMENTO_TRANSPORTISTA?: string;
  NRO_DOCUMENTO_TRANSPORTISTA?: string;
  RAZON_SOCIAL_TRANSPORTISTA?: string;
  COD_TIPO_DOC_CHOFER?: string;
  NRO_DOC_CHOFER?: string;
  NOMBRES_CHOFER?: string;
  APELLIDOS_CHOFER?: string;
  LIC_CONDUCIR_CHOFER?: string;

  NRO_DOCUMENTO_REMITENTE?: string;
  TIPO_DOCUMENTO_REMITENTE?: string;
  RAZON_SOCIAL_REMITENTE?: string;
  VEHICULO_ID_INSCRIPCION_MTC?: string;
  PLACA_CARRETA?: string;
  CARRETA_ID_INSCRIPCION_MTC?: string;
  COMPANY_ID_NROREG_MTC?: string;

  detalle: RemittanceGuideWireItem[];

  [key: string]: unknown;
}

export function toWireRemittanceGuideItem(
  item: RemittanceGuideItem,
): RemittanceGuideWireItem {
  return {
    ITEM: item.item,
    UNIDAD_MEDIDA: item.unitOfMeasure,
    CANTIDAD: item.quantity,
    ORDER_ITEM: item.orderItem,
    DESCRIPCION: item.description,
    CODIGO: item.code,
  };
}

export function toWireRemittanceGuideRequest(
  request: RemittanceGuideRequest,
): RemittanceGuideWireRequest {
  return {
    TIPO_PROCESO: request.processType,
    NRO_DOCUMENTO_EMPRESA: request.companyDocumentNumber,
    USUARIO_SOL_EMPRESA: request.companySolUsername,
    PASS_SOL_EMPRESA: request.companySolPassword,
    PAS_FIRMA: request.signaturePassword,
    COD_TIPO_DOCUMENTO: request.documentTypeCode,
    NRO_COMPROBANTE: request.documentNumber,
    ID_TOKEN: request.idToken,
    CLAVE_TOKEN: request.tokenKey,
    FECHA_DOCUMENTO: request.documentDate,
    NOTA: request.note,
    TIPO_DOCUMENTO_EMPRESA: request.companyDocumentType,
    RAZON_SOCIAL_EMPRESA: request.companyBusinessName,
    TIPO_DOCUMENTO_CLIENTE: request.recipientDocumentType,
    NRO_DOCUMENTO_CLIENTE: request.recipientDocumentNumber,
    RAZON_SOCIAL_CLIENTE: request.recipientBusinessName,
    ITEM_ENVIO: request.shipmentItem,
    COD_MOTIVO_TRASLADO: request.transferReasonCode,
    DESCRIPCION_MOTIVO_TRASLADO: request.transferReasonDescription,
    COD_UND_PESO_BRUTO: request.grossWeightUnit,
    PESO_BRUTO: request.grossWeight,
    TOTAL_BULTOS: request.totalPackages,
    COD_MODALIDAD_TRASLADO: request.transportModalityCode,
    FECHA_INICIO: request.startDate,
    PLACA_VEHICULO: request.vehiclePlate,
    COD_UBIGEO_DESTINO: request.destinationUbigeoCode,
    DIRECCION_DESTINO: request.destinationAddress,
    COD_UBIGEO_ORIGEN: request.originUbigeoCode,
    DIRECCION_ORIGEN: request.originAddress,
    NRO_DOCUMENTO_REFERENCIA: request.relatedDocumentNumber,
    COD_DOCUMENTO_RELACIODO: request.relatedDocumentTypeCode,
    DOCUMENTO_RELACIODO: request.relatedDocumentDescription,
    COD_DOCUMENTO_RELACIODO_EMPRESA: request.relatedCompanyDocumentTypeCode,
    NRO_DOCUMENTO_RELACIODO_EMPRESA: request.relatedCompanyDocumentNumber,
    FLG_ANULADO: request.voidedFlag,
    DOC_REFERENCIA_ANU: request.voidedReferenceDocument,
    COD_TIPO_DOC_REFANU: request.voidedReferenceDocumentTypeCode,
    TIPO_DOCUMENTO_TRANSPORTISTA: request.carrierDocumentType,
    NRO_DOCUMENTO_TRANSPORTISTA: request.carrierDocumentNumber,
    RAZON_SOCIAL_TRANSPORTISTA: request.carrierBusinessName,
    COD_TIPO_DOC_CHOFER: request.driverDocumentType,
    NRO_DOC_CHOFER: request.driverDocumentNumber,
    NOMBRES_CHOFER: request.driverFirstName,
    APELLIDOS_CHOFER: request.driverLastNames,
    LIC_CONDUCIR_CHOFER: request.driverLicense,
    NRO_DOCUMENTO_REMITENTE: request.senderDocumentNumber,
    TIPO_DOCUMENTO_REMITENTE: request.senderDocumentType,
    RAZON_SOCIAL_REMITENTE: request.senderBusinessName,
    VEHICULO_ID_INSCRIPCION_MTC: request.vehicleMtcRegistrationId,
    PLACA_CARRETA: request.trailerPlate,
    CARRETA_ID_INSCRIPCION_MTC: request.trailerMtcRegistrationId,
    COMPANY_ID_NROREG_MTC: request.companyMtcRegistrationNumber,
    detalle: request.items.map(toWireRemittanceGuideItem),
  };
}

/* ============================================================
 * Response mapping
 * ============================================================ */

/** Wire result block (`hash_cdr`). */
export interface RemittanceGuideWireResult {
  cod_sunat: string;
  msj_sunat: string;
  hash_cdr: string;
  ticket: string;
  url_guia: string;
}

/** Wire response for POST /v1/sunat/guia-remision. */
export interface RemittanceGuideWireResponse {
  mensaje_xml: string;
  hash_cpe: string;
  hash_cdr: RemittanceGuideWireResult;
}

export function fromWireRemittanceGuideResponse(
  wire: RemittanceGuideWireResponse,
): RemittanceGuideResponse {
  return {
    xmlMessage: wire.mensaje_xml,
    voucherHash: wire.hash_cpe,
    providerResult: {
      sunatCode: wire.hash_cdr.cod_sunat,
      sunatMessage: wire.hash_cdr.msj_sunat,
      cdrHash: wire.hash_cdr.hash_cdr,
      ticket: wire.hash_cdr.ticket,
      guideUrl: wire.hash_cdr.url_guia,
    },
  };
}

/* ============================================================
 * Ticket status mapping
 * ============================================================ */

/** Wire payload for POST /v1/sunat/guia-remision/ticket-status. */
export interface RemittanceGuideTicketStatusWireRequest {
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

export function toWireRemittanceGuideTicketStatusRequest(
  request: RemittanceGuideTicketStatusRequest,
): RemittanceGuideTicketStatusWireRequest {
  return {
    TICKET: request.ticket,
    NRO_DOCUMENTO_EMPRESA: request.companyDocumentNumber,
    USUARIO_SOL_EMPRESA: request.companySolUsername,
    PASS_SOL_EMPRESA: request.companySolPassword,
    ID_TOKEN: request.idToken,
    CLAVE_TOKEN: request.tokenKey,
    COD_TIPO_DOCUMENTO: request.documentTypeCode,
    NRO_COMPROBANTE: request.documentNumber,
    TIPO_PROCESO: request.processType,
  };
}

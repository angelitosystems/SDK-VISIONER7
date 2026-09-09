/* ============================================================
 * Emisión de Comprobante de Pago Electrónico (Factura contado / crédito)
 * POST /v1/sunat/generar-cpe
 * ============================================================ */

export interface CpeFormaPago {
  COD_FORMA_PAGO: string;
  MONTO_FORMA_PAGO: string;
  /** Requerido solo para cuotas de crédito (Cuota001, Cuota002, ...) */
  FECHA_FORMA_PAGO?: string;
}

export interface CpeDetalleItem {
  txtITEM: string;
  txtUNIDAD_MEDIDA_DET: string;
  txtCANTIDAD_DET: string;
  txtPRECIO_DET: string;
  txtIMPORTE_DET: string;
  txtPRECIO_TIPO_CODIGO: string;
  txtIGV: string;
  POR_IGV: string;
  txtISC: string;
  txtCOD_TIPO_OPERACION: string;
  txtCODIGO_DET: string;
  txtDESCRIPCION_DET: string;
  txtPRECIO_SIN_IGV_DET: string;
  FLG_ICBPER: number;
  IMPUESTO_BP: string;
  IMPORTE_BP: string;
}

/**
 * Payload para generar una Factura electrónica (al contado o al crédito).
 * La diferencia entre ambos casos está en `detalle_forma_pago`:
 *  - Contado: un único ítem con COD_FORMA_PAGO = "Contado".
 *  - Crédito: un ítem "Credito" + N cuotas ("Cuota001", "Cuota002", ...).
 */
export interface GenerarCpeRequest {
  txtTIPO_OPERACION: string;
  txtTOTAL_GRAVADAS: string;
  txtTOTAL_INAFECTA: string;
  txtTOTAL_EXONERADAS: string;
  txtTOTAL_GRATUITAS: string;
  txtSUB_TOTAL: string;
  txtTOTAL_DESCUENTO: string;
  txtPOR_IGV: string;
  txtTOTAL_IGV: string;
  txtTOTAL: string;
  txtSUB_TOTAL_PERCEPCIONES?: string;
  txtPOR_PERCEPCIONES?: string;
  txtBI_PERCEPCIONES?: string;
  txtTOTAL_PERCEPCIONES?: string;
  txtPOR_RETENCIONES?: string;
  txtBI_RETENCIONES?: string;
  txtTOTAL_RETENCIONES?: string;
  txtTOTAL_BONIFICACIONES?: string;
  txtTOTAL_EXPORTACION?: string;
  txtCOD_MEDIO_PAGO?: string;
  txtCTA_BANCARIA_BN?: string;
  txtCODIGO_DETRACCION?: string;
  txtPOR_DETRACCION?: string;
  txtTOTAL_DETRACCIONES?: string;
  txtTOTAL_ISC?: string;
  txtTOTAL_OTR_IMP?: string;
  ICBP?: string;
  txtTOTAL_LETRAS: string;
  txtNRO_GUIA_REMISION?: string;
  txtCOD_GUIA_REMISION?: string;
  txtFECHA_GUIA_REMISION?: string;
  txtNRO_OTR_COMPROBANTE?: string;
  txtCOD_OTR_COMPROBANTE?: string;
  txtTIPO_COMPROBANTE_MODIFICA?: string;
  txtNRO_DOCUMENTO_MODIFICA?: string;
  txtCOD_TIPO_MOTIVO?: string;
  txtDESCRIPCION_MOTIVO?: string;
  txtNRO_COMPROBANTE: string;
  txtFECHA_DOCUMENTO: string;
  txtFECHA_VTO?: string;
  txtCOD_TIPO_DOCUMENTO: string;
  txtCOD_MONEDA: string;
  txtOBSERVACIONES?: string;
  detalle_forma_pago: CpeFormaPago[];
  txtNRO_DOCUMENTO_CLIENTE: string;
  txtRAZON_SOCIAL_CLIENTE: string;
  txtTIPO_DOCUMENTO_CLIENTE: string;
  txtDIRECCION_CLIENTE?: string;
  txtCOD_UBIGEO_CLIENTE?: string;
  txtDEPARTAMENTO_CLIENTE?: string;
  txtPROVINCIA_CLIENTE?: string;
  txtDISTRITO_CLIENTE?: string;
  txtCIUDAD_CLIENTE?: string;
  txtNRO_DOCUMENTO_EMPRESA: string;
  txtTIPO_DOCUMENTO_EMPRESA: string;
  txtNOMBRE_COMERCIAL_EMPRESA?: string;
  txtCODIGO_UBIGEO_EMPRESA?: string;
  txtDIRECCION_EMPRESA?: string;
  txtDEPARTAMENTO_EMPRESA?: string;
  txtPROVINCIA_EMPRESA?: string;
  txtDISTRITO_EMPRESA?: string;
  txtCODIGO_PAIS_EMPRESA?: string;
  txtRAZON_SOCIAL_EMPRESA: string;
  txtCONTACTO_EMPRESA?: string;
  txtTELEFONO_EMPRESA?: string;
  txtFORMATO_IMPRESION?: string;
  txtFLG_ANTICIPO?: string;
  txtFLG_REGU_ANTICIPO?: string;
  txtNRO_COMPROBANTE_REF_ANT?: string;
  txtMONEDA_REGU_ANTICIPO?: string;
  txtMONTO_REGU_ANTICIPO?: string;
  txtMONTO_REGU_ANTICIPO_TOTAL?: string;
  txtTIPO_DOCUMENTO_EMP_REGU_ANT?: string;
  txtNRO_DOCUMENTO_EMP_REGU_ANT?: string;
  txtUSUARIO_SOL_EMPRESA: string;
  txtPASS_SOL_EMPRESA: string;
  txtCONTRA: string;
  txtPAS_FIRMA: string;
  txtTIPO_PROCESO: string;
  detalle: CpeDetalleItem[];

  /** Permite extender con campos adicionales no documentados sin romper el tipado. */
  [key: string]: unknown;
}

export interface CpeCdrData {
  description: string;
  reference_id: string;
  response_code: string;
  issue_date: string;
  issue_time: string;
  response_date: string;
  response_time: string;
  digest_value: string;
}

export interface GenerarCpeResponse {
  archivo: string;
  cod_sunat: string;
  msj_sunat: string;
  hash_cdr: string;
  cdr_data: CpeCdrData;
}

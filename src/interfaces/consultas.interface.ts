/* ============================================================
 * Consultar RUC contribuyente
 * GET /sunatv1/consultar-ruc/{ruc}
 * ============================================================ */

export interface UbigeoInfo {
  codUbigeo: string;
  desDepartamento: string;
  desProvincia: string;
  desDistrito: string;
}

export interface ContactoInfo {
  numTelefono1: string;
  numTelefono2: string;
  numTelefono3: string;
}

export interface TributoInfo {
  codTributo: string;
  fecVigencia: string;
  fecAlta: string;
}

export interface DatosContribuyente {
  desRazonSocial: string;
  desNomApe: string;
  codCorreo1: string;
  codCorreo2: string;
  ubigeo: UbigeoInfo;
  contacto: ContactoInfo;
  tributos: TributoInfo[];
  desDireccion: string;
  codEstado: string;
  codDomHabido: string;
}

export interface ConsultarRucResponse {
  success: boolean;
  comprobante: DatosContribuyente;
}

/* ============================================================
 * Locales y establecimientos
 * GET /sunatv1/locales-establecimientos/{ruc}/{tipo_consulta}
 * ============================================================ */

export enum TipoConsultaLocal {
  DOMICILIO_FISCAL = 1,
  ESTABLECIMIENTOS_ANEXOS = 2,
}

export interface LocalEstablecimiento {
  codTipvia: string;
  descTipvia: string;
  desNomvia: string;
  numVia: string;
  numKilom: string;
  numManza: string;
  numLote: string;
  numDpto: string;
  numInter: string;
  codTipzona: string;
  descTipzon: string;
  desNomZon: string;
  desRefer: string;
  codUbigeo: string;
  codDepar: string;
  codProvi: string;
  descDepar: string;
  descDistr: string;
  descProvi: string;
  direccion: string;
  indConLegDomi: string;
  desConlegdomi: string;
  codTipdocarr: string;
  desTipdocarr: string;
  numDocarr: string;
  codTipvinarr: string;
  desNomarr: string;
  codTipcat: string;
  descTipact: string;
  numLatitud: string | null;
  numLongitud: string | null;
  numCordgeo: string | null;
  numPrecision: string | null;
  numRuc: string;
}

export interface LocalesEstablecimientosResponse {
  success: boolean;
  domiciliofiscal?: LocalEstablecimiento[];
  establecimientos?: LocalEstablecimiento[];
}

/* ============================================================
 * Consultar DNI de persona natural
 * GET /sunatv1/consultar-personas/{dni}
 * ============================================================ */

export interface DatosPersonaNatural {
  apePaterno: string;
  apeMaterno: string;
  nomPerNat: string;
  desDir: string;
  numTel: string;
  ubigeo: UbigeoInfo;
}

export interface ConsultarDniResponse {
  success: boolean;
  comprobante: DatosPersonaNatural;
}

/* ============================================================
 * Tipo de cambio SUNAT
 * POST /sunatv1/tipo-cambio
 * ============================================================ */

export interface TipoCambioRequest {
  anio: number;
  mes: number;
  /**
   * Token de negocio (por defecto "v7"). Si no se especifica se
   * usará el `businessToken` configurado en el módulo.
   */
  token?: string;
}

export interface TipoCambioItem {
  fecPublica: string;
  /** Tipo de cambio compra */
  valTipo: string;
  /** "C" = compra, "V" = venta */
  codTipo: 'C' | 'V';
}

export interface TipoCambioResponse {
  success: boolean;
  data: TipoCambioItem[];
}

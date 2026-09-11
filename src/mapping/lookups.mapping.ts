/**
 * Maps English SDK payloads/responses to the Spanish wire format
 * expected by the Visioner7 API.
 *
 * Lookup group: taxpayer (RUC), establishments, natural person (DNI)
 * and SUNAT exchange rate.
 */

import {
  Establishment,
  EstablishmentLookupResponse,
  ExchangeRateRequest,
  ExchangeRateResponse,
  NaturalPersonData,
  NaturalPersonLookupResponse,
  TaxpayerData,
  TaxpayerLookupResponse,
} from '../interfaces/lookups.interface.js';
import { SDKVisioner7ApiException } from '../exceptions/sdk-visioner7-api.exception.js';

/* ============================================================
 * Exchange rate
 * ============================================================ */

/** Wire payload for POST /sunatv1/tipo-cambio. */
export interface ExchangeRateWireRequest {
  anio: number;
  mes: number;
  token: string;
}

/** Wire response for POST /sunatv1/tipo-cambio. */
export interface ExchangeRateWireResponse {
  success: boolean;
  data: {
    fecPublica: string;
    valTipo: string;
    codTipo: 'C' | 'V';
  }[];
}

export function toWireExchangeRateRequest(
  request: ExchangeRateRequest,
  businessToken: string,
): ExchangeRateWireRequest {
  return {
    anio: request.year,
    mes: request.month,
    token: request.token ?? businessToken,
  };
}

export function fromWireExchangeRateResponse(
  wire: ExchangeRateWireResponse,
): ExchangeRateResponse {
  return {
    success: wire.success,
    data: (wire.data ?? []).map((entry) => ({
      publicationDate: entry.fecPublica,
      value: entry.valTipo,
      side: entry.codTipo,
    })),
  };
}

/* ============================================================
 * Taxpayer (RUC) lookup
 * ============================================================ */

export interface WireUbigeo {
  codUbigeo?: string;
  desDepartamento?: string;
  desProvincia?: string;
  desDistrito?: string;
}

export interface WireContacto {
  numTelefono1?: string;
  numTelefono2?: string;
  numTelefono3?: string;
}

export interface WireTributo {
  codTributo?: string;
  fecVigencia?: string;
  fecAlta?: string;
}

export interface WireDatosContribuyente {
  desRazonSocial?: string;
  desNomApe?: string;
  codCorreo1?: string;
  codCorreo2?: string;
  ubigeo?: WireUbigeo;
  contacto?: WireContacto;
  tributos?: WireTributo[];
  desDireccion?: string;
  codEstado?: string;
  codDomHabido?: string;
  [key: string]: unknown;
}

export interface TaxpayerLookupWireResponse {
  success: boolean;
  message?: string;
  error?: string;
  msj_sunat?: string;
  comprobante?:
    | {
        datosContribuyente?: WireDatosContribuyente;
        [key: string]: unknown;
      }
    | WireDatosContribuyente;
  datosContribuyente?: WireDatosContribuyente;
  [key: string]: unknown;
}

export function fromWireTaxpayerLookupResponse(
  wire: TaxpayerLookupWireResponse,
  endpoint = 'consultar-ruc',
): TaxpayerLookupResponse {
  if (!wire) {
    throw new SDKVisioner7ApiException(
      'Respuesta vacía del servicio Visioner7',
      endpoint,
      wire,
    );
  }

  if (wire.success === false || wire.error) {
    const message =
      wire.message ||
      wire.error ||
      wire.msj_sunat ||
      'Error en la consulta de RUC';
    throw new SDKVisioner7ApiException(message, endpoint, wire);
  }

  const rawComprobante = wire.comprobante;
  const rawDatos =
    (rawComprobante as Record<string, unknown> | undefined)?.datosContribuyente ??
    wire.datosContribuyente ??
    (rawComprobante as Record<string, unknown> | undefined)?.data ??
    (wire as Record<string, unknown> | undefined)?.data ??
    rawComprobante;

  if (!rawDatos || typeof rawDatos !== 'object') {
    throw new SDKVisioner7ApiException(
      wire.message || 'No se encontraron datos del contribuyente',
      endpoint,
      wire,
    );
  }

  const data = rawDatos as WireDatosContribuyente;
  const ubigeo = data.ubigeo;
  const contacto = data.contacto;
  const tributos = Array.isArray(data.tributos) ? data.tributos : [];

  const taxpayer: TaxpayerData = {
    businessName: (data.desRazonSocial ?? '').trim(),
    personFullName: (data.desNomApe ?? '').trim(),
    primaryEmail: (data.codCorreo1 ?? '').trim(),
    secondaryEmail: (data.codCorreo2 ?? '').trim(),
    ubigeo: {
      code: (ubigeo?.codUbigeo ?? '').trim(),
      department: (ubigeo?.desDepartamento ?? '').trim(),
      province: (ubigeo?.desProvincia ?? '').trim(),
      district: (ubigeo?.desDistrito ?? '').trim(),
    },
    contact: {
      phone1: (contacto?.numTelefono1 ?? '').trim(),
      phone2: (contacto?.numTelefono2 ?? '').trim(),
      phone3: (contacto?.numTelefono3 ?? '').trim(),
    },
    taxes: tributos.map((t) => ({
      taxCode: (t.codTributo ?? '').trim(),
      effectiveDate: (t.fecVigencia ?? '').trim(),
      registrationDate: (t.fecAlta ?? '').trim(),
    })),
    fiscalAddress: (data.desDireccion ?? '').trim(),
    statusCode: (data.codEstado ?? '').trim(),
    presenceCode: (data.codDomHabido ?? '').trim(),

    desRazonSocial: data.desRazonSocial,
    desNomApe: data.desNomApe,
    codCorreo1: data.codCorreo1,
    codCorreo2: data.codCorreo2,
    desDireccion: data.desDireccion,
    codEstado: data.codEstado,
    codDomHabido: data.codDomHabido,
  };

  return {
    success: wire.success,
    message: wire.message,
    taxpayer,
    comprobante: rawComprobante as Record<string, unknown> | undefined,
    datosContribuyente: data,
  };
}

/* ============================================================
 * Natural person (DNI) lookup
 * ============================================================ */

export interface WireDatosPersonaNatural {
  apePaterno?: string;
  apeMaterno?: string;
  nomPerNat?: string;
  desDir?: string;
  numTel?: string;
  ubigeo?: WireUbigeo;
  [key: string]: unknown;
}

export interface NaturalPersonLookupWireResponse {
  success: boolean;
  message?: string;
  error?: string;
  msj_sunat?: string;
  comprobante?:
    | WireDatosPersonaNatural
    | {
        datosPersonaNatural?: WireDatosPersonaNatural;
        datosContribuyente?: WireDatosPersonaNatural;
        [key: string]: unknown;
      };
  [key: string]: unknown;
}

export function fromWireNaturalPersonLookupResponse(
  wire: NaturalPersonLookupWireResponse,
  endpoint = 'consultar-personas',
): NaturalPersonLookupResponse {
  if (!wire) {
    throw new SDKVisioner7ApiException(
      'Respuesta vacía del servicio Visioner7',
      endpoint,
      wire,
    );
  }

  if (wire.success === false || wire.error) {
    const message =
      wire.message ||
      wire.error ||
      wire.msj_sunat ||
      'Error en la consulta de DNI';
    throw new SDKVisioner7ApiException(message, endpoint, wire);
  }

  const rawComprobante = wire.comprobante;
  const rawData =
    (rawComprobante as Record<string, unknown> | undefined)?.datosPersonaNatural ??
    (rawComprobante as Record<string, unknown> | undefined)?.datosContribuyente ??
    (rawComprobante as Record<string, unknown> | undefined)?.data ??
    (wire as Record<string, unknown> | undefined)?.data ??
    rawComprobante;

  if (!rawData || typeof rawData !== 'object') {
    throw new SDKVisioner7ApiException(
      wire.message || 'No se encontraron datos de la persona',
      endpoint,
      wire,
    );
  }

  const data = rawData as WireDatosPersonaNatural;
  const ubigeo = data.ubigeo;

  const person: NaturalPersonData = {
    paternalSurname: (data.apePaterno ?? '').trim(),
    maternalSurname: (data.apeMaterno ?? '').trim(),
    givenNames: (data.nomPerNat ?? '').trim(),
    address: (data.desDir ?? '').trim(),
    phone: (data.numTel ?? '').trim(),
    ubigeo: {
      code: (ubigeo?.codUbigeo ?? '').trim(),
      department: (ubigeo?.desDepartamento ?? '').trim(),
      province: (ubigeo?.desProvincia ?? '').trim(),
      district: (ubigeo?.desDistrito ?? '').trim(),
    },

    apePaterno: data.apePaterno,
    apeMaterno: data.apeMaterno,
    nomPerNat: data.nomPerNat,
    desDir: data.desDir,
    numTel: data.numTel,
  };

  return {
    success: wire.success,
    message: wire.message,
    person,
    comprobante: rawComprobante,
  };
}

/* ============================================================
 * Establishments lookup
 * ============================================================ */

export interface WireLocalEstablecimiento {
  codTipvia?: string;
  descTipvia?: string;
  desNomvia?: string;
  numVia?: string;
  numKilom?: string;
  numManza?: string;
  numLote?: string;
  numDpto?: string;
  numInter?: string;
  codTipzona?: string;
  descTipzon?: string;
  desNomZon?: string;
  desRefer?: string;
  codUbigeo?: string;
  codDepar?: string;
  codProvi?: string;
  descDepar?: string;
  descDistr?: string;
  descProvi?: string;
  direccion?: string;
  indConLegDomi?: string;
  desConlegdomi?: string;
  codTipdocarr?: string;
  desTipdocarr?: string;
  numDocarr?: string;
  codTipvinarr?: string;
  desNomarr?: string;
  codTipcat?: string;
  descTipact?: string;
  numLatitud?: string | null;
  numLongitud?: string | null;
  numCordgeo?: string | null;
  numPrecision?: string | null;
  numRuc?: string;
  [key: string]: unknown;
}

export interface EstablishmentLookupWireResponse {
  success: boolean;
  message?: string;
  error?: string;
  msj_sunat?: string;
  domiciliofiscal?: WireLocalEstablecimiento[];
  establecimientosanexos?: WireLocalEstablecimiento[];
  establecimientos?: WireLocalEstablecimiento[];
  locales?: WireLocalEstablecimiento[];
  anexos?: WireLocalEstablecimiento[];
  [key: string]: unknown;
}

export function fromWireEstablishment(
  wire: WireLocalEstablecimiento,
): Establishment {
  return {
    streetTypeCode: (wire.codTipvia ?? '').trim(),
    streetType: (wire.descTipvia ?? '').trim(),
    streetName: (wire.desNomvia ?? '').trim(),
    streetNumber: (wire.numVia ?? '').trim(),
    kilometer: (wire.numKilom ?? '').trim(),
    block: (wire.numManza ?? '').trim(),
    lot: (wire.numLote ?? '').trim(),
    apartmentNumber: (wire.numDpto ?? '').trim(),
    interiorNumber: (wire.numInter ?? '').trim(),
    zoneTypeCode: (wire.codTipzona ?? '').trim(),
    zoneType: (wire.descTipzon ?? '').trim(),
    zoneName: (wire.desNomZon ?? '').trim(),
    reference: (wire.desRefer ?? '').trim(),
    ubigeoCode: (wire.codUbigeo ?? '').trim(),
    departmentCode: (wire.codDepar ?? '').trim(),
    provinceCode: (wire.codProvi ?? '').trim(),
    department: (wire.descDepar ?? '').trim(),
    district: (wire.descDistr ?? '').trim(),
    province: (wire.descProvi ?? '').trim(),
    address: (wire.direccion ?? '').trim(),
    legalRepresentativePresenceCode: (wire.indConLegDomi ?? '').trim(),
    legalRepresentativePresence: (wire.desConlegdomi ?? '').trim(),
    annexDocumentTypeCode: (wire.codTipdocarr ?? '').trim(),
    annexDocumentType: (wire.desTipdocarr ?? '').trim(),
    annexDocumentNumber: (wire.numDocarr ?? '').trim(),
    relationshipTypeCode: (wire.codTipvinarr ?? '').trim(),
    relationshipName: (wire.desNomarr ?? '').trim(),
    categoryCode: (wire.codTipcat ?? '').trim(),
    activityType: (wire.descTipact ?? '').trim(),
    latitude: wire.numLatitud ?? null,
    longitude: wire.numLongitud ?? null,
    geodesicCoordinate: wire.numCordgeo ?? null,
    coordinatePrecision: wire.numPrecision ?? null,
    ruc: (wire.numRuc ?? '').trim(),
  };
}

export function fromWireEstablishmentLookupResponse(
  wire: EstablishmentLookupWireResponse,
  endpoint = 'locales-establecimientos',
): EstablishmentLookupResponse {
  if (!wire) {
    throw new SDKVisioner7ApiException(
      'Respuesta vacía del servicio Visioner7',
      endpoint,
      wire,
    );
  }

  if (wire.success === false || wire.error) {
    const message =
      wire.message ||
      wire.error ||
      wire.msj_sunat ||
      'Error en la consulta de establecimientos';
    throw new SDKVisioner7ApiException(message, endpoint, wire);
  }

  const fiscalList = Array.isArray(wire.domiciliofiscal)
    ? wire.domiciliofiscal
    : undefined;
  const establishmentsList = Array.isArray(wire.establecimientosanexos)
    ? wire.establecimientosanexos
    : Array.isArray(wire.establecimientos)
    ? wire.establecimientos
    : Array.isArray(wire.locales)
    ? wire.locales
    : Array.isArray(wire.anexos)
    ? wire.anexos
    : undefined;

  return {
    success: wire.success,
    message: wire.message,
    fiscalAddress: fiscalList?.map(fromWireEstablishment),
    establishments: establishmentsList?.map(fromWireEstablishment),
    domiciliofiscal: fiscalList,
    establecimientosanexos: Array.isArray(wire.establecimientosanexos)
      ? wire.establecimientosanexos
      : undefined,
    establecimientos: establishmentsList,
  };
}

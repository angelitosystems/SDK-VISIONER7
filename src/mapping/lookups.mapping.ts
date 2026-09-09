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

interface WireUbigeo {
  codUbigeo: string;
  desDepartamento: string;
  desProvincia: string;
  desDistrito: string;
}

interface WireContacto {
  numTelefono1: string;
  numTelefono2: string;
  numTelefono3: string;
}

interface WireTributo {
  codTributo: string;
  fecVigencia: string;
  fecAlta: string;
}

interface WireDatosContribuyente {
  desRazonSocial: string;
  desNomApe: string;
  codCorreo1: string;
  codCorreo2: string;
  ubigeo: WireUbigeo;
  contacto: WireContacto;
  tributos: WireTributo[];
  desDireccion: string;
  codEstado: string;
  codDomHabido: string;
}

export interface TaxpayerLookupWireResponse {
  success: boolean;
  comprobante: WireDatosContribuyente;
}

export function fromWireTaxpayerLookupResponse(
  wire: TaxpayerLookupWireResponse,
): TaxpayerLookupResponse {
  const data = wire.comprobante;
  return {
    success: wire.success,
    taxpayer: {
      businessName: data.desRazonSocial,
      personFullName: data.desNomApe,
      primaryEmail: data.codCorreo1,
      secondaryEmail: data.codCorreo2,
      ubigeo: {
        code: data.ubigeo.codUbigeo,
        department: data.ubigeo.desDepartamento,
        province: data.ubigeo.desProvincia,
        district: data.ubigeo.desDistrito,
      },
      contact: {
        phone1: data.contacto.numTelefono1,
        phone2: data.contacto.numTelefono2,
        phone3: data.contacto.numTelefono3,
      },
      taxes: (data.tributos ?? []).map((t) => ({
        taxCode: t.codTributo,
        effectiveDate: t.fecVigencia,
        registrationDate: t.fecAlta,
      })),
      fiscalAddress: data.desDireccion,
      statusCode: data.codEstado,
      presenceCode: data.codDomHabido,
    },
  };
}

/* ============================================================
 * Natural person (DNI) lookup
 * ============================================================ */

interface WireDatosPersonaNatural {
  apePaterno: string;
  apeMaterno: string;
  nomPerNat: string;
  desDir: string;
  numTel: string;
  ubigeo: WireUbigeo;
}

export interface NaturalPersonLookupWireResponse {
  success: boolean;
  comprobante: WireDatosPersonaNatural;
}

export function fromWireNaturalPersonLookupResponse(
  wire: NaturalPersonLookupWireResponse,
): NaturalPersonLookupResponse {
  const data = wire.comprobante;
  return {
    success: wire.success,
    person: {
      paternalSurname: data.apePaterno,
      maternalSurname: data.apeMaterno,
      givenNames: data.nomPerNat,
      address: data.desDir,
      phone: data.numTel,
      ubigeo: {
        code: data.ubigeo.codUbigeo,
        department: data.ubigeo.desDepartamento,
        province: data.ubigeo.desProvincia,
        district: data.ubigeo.desDistrito,
      },
    },
  };
}

/* ============================================================
 * Establishments lookup
 * ============================================================ */

interface WireLocalEstablecimiento {
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

export interface EstablishmentLookupWireResponse {
  success: boolean;
  domiciliofiscal?: WireLocalEstablecimiento[];
  establecimientos?: WireLocalEstablecimiento[];
}

export function fromWireEstablishment(
  wire: WireLocalEstablecimiento,
): Establishment {
  return {
    streetTypeCode: wire.codTipvia,
    streetType: wire.descTipvia,
    streetName: wire.desNomvia,
    streetNumber: wire.numVia,
    kilometer: wire.numKilom,
    block: wire.numManza,
    lot: wire.numLote,
    apartmentNumber: wire.numDpto,
    interiorNumber: wire.numInter,
    zoneTypeCode: wire.codTipzona,
    zoneType: wire.descTipzon,
    zoneName: wire.desNomZon,
    reference: wire.desRefer,
    ubigeoCode: wire.codUbigeo,
    departmentCode: wire.codDepar,
    provinceCode: wire.codProvi,
    department: wire.descDepar,
    district: wire.descDistr,
    province: wire.descProvi,
    address: wire.direccion,
    legalRepresentativePresenceCode: wire.indConLegDomi,
    legalRepresentativePresence: wire.desConlegdomi,
    annexDocumentTypeCode: wire.codTipdocarr,
    annexDocumentType: wire.desTipdocarr,
    annexDocumentNumber: wire.numDocarr,
    relationshipTypeCode: wire.codTipvinarr,
    relationshipName: wire.desNomarr,
    categoryCode: wire.codTipcat,
    activityType: wire.descTipact,
    latitude: wire.numLatitud,
    longitude: wire.numLongitud,
    geodesicCoordinate: wire.numCordgeo,
    coordinatePrecision: wire.numPrecision,
    ruc: wire.numRuc,
  };
}

export function fromWireEstablishmentLookupResponse(
  wire: EstablishmentLookupWireResponse,
): EstablishmentLookupResponse {
  return {
    success: wire.success,
    fiscalAddress: wire.domiciliofiscal?.map(fromWireEstablishment),
    establishments: wire.establecimientos?.map(fromWireEstablishment),
  };
}

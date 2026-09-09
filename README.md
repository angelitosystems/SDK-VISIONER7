# SDK-VISIONER7

SDK de integración para **NestJS + TypeScript** desarrollado para facilitar la comunicación entre aplicaciones NestJS y un **servicio de API de Visioner7 contratado por el desarrollador/cliente**.

El SDK proporciona una capa tipada y organizada para consumir las funcionalidades contratadas del servicio, incluyendo consultas relacionadas con SUNAT, emisión de documentos electrónicos y otras operaciones disponibles según el servicio contratado.

> **Importante:** Este proyecto es una integración de software desarrollada de forma independiente para uso de clientes y/o proyectos que cuentan con acceso autorizado al servicio correspondiente.
> No es un producto oficial de Visioner7, no representa a Visioner7 y no implica afiliación, asociación, patrocinio o respaldo por parte de Visioner7.

**Servicio utilizado:**
[https://visioner7-api.com/](https://visioner7-api.com/?utm_source=chatgpt.com)

---

## Características

El SDK proporciona una interfaz tipada para trabajar con las funcionalidades disponibles en el servicio contratado, entre ellas:

* Consulta de RUC (contribuyentes).
* Consulta de información de domicilio fiscal.
* Consulta de establecimientos anexos.
* Consulta de DNI (personas naturales).
* Consulta de tipo de cambio.
* Emisión de Guías de Remisión.
* Consulta de estado/ticket de Guías de Remisión.
* Emisión de Comprobantes de Pago Electrónicos (CPE).
* Manejo centralizado de errores.
* Configuración mediante `forRoot`.
* Configuración mediante `forRootAsync`.
* Interfaces TypeScript para requests y responses.
* Integración con `@nestjs/axios`.

Desde la **versión 2.0.0** la API pública del SDK (métodos, clases e interfaces) está nombrada en **inglés**, y el SDK se encarga internamente de traducir los payloads hacia el formato que espera el proveedor (capa de *mapping*). Tu aplicación solo trabaja con nombres en inglés.

---

# Instalación

El SDK utiliza `@nestjs/axios` para realizar las peticiones HTTP.

```bash
npm install @angelitosystems/sdk-visioner7
npm install @nestjs/axios axios reflect-metadata rxjs
```

Si el proyecto se utiliza dentro de un monorepo o como código interno, también puede integrarse directamente como una librería privada.

Por ejemplo:

```text
libs/sdk-visioner7/
```

También puede distribuirse mediante un registro privado de paquetes.

---

# Migración v1 → v2

La versión 2.0.0 renombra la API pública al inglés y **elimina los alias antiguos** (`SunatModule`, `SunatService`, `consultarRuc`, etc.). Correspondencia principal:

| v1 (anterior)                    | v2 (actual)                              |
| -------------------------------- | ---------------------------------------- |
| `SunatModule`                    | `SDKVisioner7Module`                     |
| `SunatService`                   | `SDKVisioner7Service`                    |
| `SunatApiException`              | `SDKVisioner7ApiException`               |
| `consultarRuc()`                 | `lookupTaxpayer()`                       |
| `consultarLocalesEstablecimientos()` | `lookupEstablishments()`             |
| `consultarDni()`                 | `lookupPerson()`                         |
| `obtenerTipoCambio()`            | `getExchangeRate()`                      |
| `emitirGuiaRemision()`           | `issueRemittanceGuide()`                 |
| `consultarTicketGuiaRemision()`  | `getRemittanceGuideTicketStatus()`       |
| `generarCpe()`                   | `generateVoucher()`                      |
| `TipoConsultaLocal`              | `EstablishmentQueryType`                 |
| `SUNAT_*` (variables de entorno) | `SDK_VISIONER7_*`                        |

Los payloads y respuestas también llegan tipados en inglés (por ejemplo `response.taxpayer.businessName` en vez de `response.comprobante.desRazonSocial`). El SDK mapea automáticamente hacia/desde el formato del proveedor.

---

# Configuración

## Opción 1: `forRoot`

Configuración síncrona:

```ts
import { Module } from '@nestjs/common';
import { SDKVisioner7Module } from '@angelitosystems/sdk-visioner7';

@Module({
  imports: [
    SDKVisioner7Module.forRoot({
      baseUrl: 'https://visioner7-api.com/api',
      authToken: process.env.SDK_VISIONER7_AUTH_TOKEN,
      businessToken: process.env.SDK_VISIONER7_BUSINESS_TOKEN,
      timeout: 15000,
    }),
  ],
})
export class AppModule {}
```

### Opciones

| Opción          | Descripción                                           |
| --------------- | ----------------------------------------------------- |
| `baseUrl`       | URL base del servicio contratado                      |
| `authToken`     | Token de autenticación proporcionado para el servicio |
| `businessToken` | Token utilizado por determinadas operaciones          |
| `timeout`       | Tiempo máximo de espera de las solicitudes HTTP       |

El valor de `baseUrl` debe corresponder al entorno y servicio que tenga habilitado el cliente.

---

# Opción 2: `forRootAsync`

Se recomienda utilizar `forRootAsync` cuando las credenciales y configuración provienen de variables de entorno o `ConfigService`.

```ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SDKVisioner7Module } from '@angelitosystems/sdk-visioner7';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    SDKVisioner7Module.forRootAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        baseUrl: config.get<string>('SDK_VISIONER7_BASE_URL'),
        authToken: config.get<string>('SDK_VISIONER7_AUTH_TOKEN'),
        businessToken: config.get<string>('SDK_VISIONER7_BUSINESS_TOKEN'),
        timeout: 15000,
      }),
    }),
  ],
})
export class AppModule {}
```

El módulo se registra como global para evitar importaciones repetidas en los módulos que utilicen `SDKVisioner7Service`.

---

# Variables de entorno

Ejemplo:

```env
SDK_VISIONER7_BASE_URL=https://visioner7-api.com/api
SDK_VISIONER7_AUTH_TOKEN=your_token_here
SDK_VISIONER7_BUSINESS_TOKEN=your_business_token_here
```

**Nunca almacenes credenciales reales directamente dentro del código fuente.**

Se recomienda utilizar:

* Variables de entorno.
* Secret managers.
* Sistemas seguros de configuración.
* Secretos administrados por el proveedor de infraestructura.

---

# Uso del servicio

Una vez configurado el módulo, puedes inyectar `SDKVisioner7Service` en cualquier servicio de NestJS.

```ts
import { Injectable } from '@nestjs/common';
import { SDKVisioner7Service } from '@angelitosystems/sdk-visioner7';

@Injectable()
export class FacturacionService {
  constructor(
    private readonly sdkVisioner7Service: SDKVisioner7Service,
  ) {}

  async validarCliente(ruc: string) {
    const response = await this.sdkVisioner7Service.lookupTaxpayer(ruc);

    return response.taxpayer;
  }
}
```

---

# Métodos disponibles

## 1. Consultar RUC (contribuyente)

```ts
sdkVisioner7Service.lookupTaxpayer(
  ruc: string | number,
): Promise<TaxpayerLookupResponse>
```

Realiza una consulta de RUC mediante el servicio contratado.

```ts
const response = await sdkVisioner7Service.lookupTaxpayer(
  '20611187719',
);

console.log(
  response.taxpayer.businessName,
);
```

La aplicación debe contar con las credenciales y permisos correspondientes para utilizar esta operación.

---

# 2. Consultar domicilio fiscal / establecimientos anexos

```ts
sdkVisioner7Service.lookupEstablishments(
  ruc: string | number,
  queryType: EstablishmentQueryType | number,
): Promise<EstablishmentLookupResponse>
```

Tipos disponibles:

```ts
EstablishmentQueryType.FISCAL_ADDRESS          // 1: domicilio fiscal
EstablishmentQueryType.ANNEXED_ESTABLISHMENTS  // 2: establecimientos anexos
```

Ejemplo:

```ts
const domicilio =
  await this.sdkVisioner7Service.lookupEstablishments(
    '20611187719',
    EstablishmentQueryType.FISCAL_ADDRESS,
  );

console.log(domicilio.fiscalAddress?.[0]?.address);
```

---

# 3. Consultar DNI (persona natural)

```ts
sdkVisioner7Service.lookupPerson(
  dni: string | number,
): Promise<NaturalPersonLookupResponse>
```

Ejemplo:

```ts
const persona = await this.sdkVisioner7Service.lookupPerson(
  '10292315',
);

console.log(
  persona.person.givenNames,
  persona.person.paternalSurname,
);
```

El uso de información personal debe realizarse de acuerdo con la normativa aplicable y con una finalidad legítima.

---

# 4. Tipo de cambio

```ts
sdkVisioner7Service.getExchangeRate(
  params: ExchangeRateRequest,
): Promise<ExchangeRateResponse>
```

Ejemplo:

```ts
const response =
  await this.sdkVisioner7Service.getExchangeRate({
    year: 2025,
    month: 7,
  });

const compra = response.data.find(
  item => item.side === 'C',
)?.value;

const venta = response.data.find(
  item => item.side === 'V',
)?.value;

console.log({
  compra,
  venta,
});
```

Cuando corresponda, el SDK utiliza el `businessToken` configurado en el módulo.

---

# 5. Emisión de Guías de Remisión

```ts
sdkVisioner7Service.issueRemittanceGuide(
  payload: RemittanceGuideRequest,
): Promise<RemittanceGuideResponse>
```

Emite una guía de remisión (remitente público, remitente privado o transportista). El "tipo" de guía depende exclusivamente de los campos incluidos en el payload.

Ejemplo conceptual:

```ts
const resultado =
  await this.sdkVisioner7Service.issueRemittanceGuide({
    processType: '1',
    companyDocumentNumber: 'YOUR_RUC',
    companySolUsername: 'YOUR_SOL_USER',
    companySolPassword: 'YOUR_SOL_PASSWORD',
    signaturePassword: 'YOUR_SIGNATURE_PASSWORD',

    documentTypeCode: '09',
    documentNumber: 'T001-00000002',

    idToken: 'YOUR_ID_TOKEN',
    tokenKey: 'YOUR_TOKEN_KEY',

    documentDate: '2025-08-10',

    companyDocumentType: '6',
    companyBusinessName: 'EMPRESA DE EJEMPLO S.A.C.',

    recipientDocumentType: '6',
    recipientDocumentNumber: 'YOUR_CLIENT_RUC',
    recipientBusinessName: 'CLIENTE DE EJEMPLO S.A.C.',

    shipmentItem: '1',
    transferReasonCode: '01',
    transferReasonDescription: 'VENTA',
    grossWeightUnit: 'KGM',
    grossWeight: '10.00',
    transportModalityCode: '01',
    startDate: '2025-08-10',

    originUbigeoCode: '150101',
    originAddress: 'AV. EJEMPLO 123',
    destinationUbigeoCode: '150101',
    destinationAddress: 'AV. DESTINO 456',

    items: [
      {
        item: '1',
        unitOfMeasure: 'NIU',
        quantity: '1',
        orderItem: '1',
        description: 'PRODUCTO DE EJEMPLO',
        code: 'PROD001',
      },
    ],
  });

console.log(resultado.providerResult.sunatMessage);
```

> Los valores mostrados son únicamente ilustrativos. Sustituye las credenciales y datos empresariales por valores correspondientes a tu propio entorno.

---

# 6. Consultar ticket de Guía de Remisión

```ts
sdkVisioner7Service.getRemittanceGuideTicketStatus(
  payload: RemittanceGuideTicketStatusRequest,
): Promise<RemittanceGuideTicketStatusResponse>
```

Ejemplo:

```ts
const estado =
  await this.sdkVisioner7Service.getRemittanceGuideTicketStatus({
    ticket: 'YOUR_TICKET',
    companyDocumentNumber: 'YOUR_RUC',
    companySolUsername: 'YOUR_SOL_USER',
    companySolPassword: 'YOUR_SOL_PASSWORD',
    idToken: 'YOUR_ID_TOKEN',
    tokenKey: 'YOUR_TOKEN_KEY',
    documentTypeCode: '31',
    documentNumber: 'V001-00000001',
    processType: '1',
  });
```

---

# 7. Generación de CPE (comprobantes electrónicos)

```ts
sdkVisioner7Service.generateVoucher(
  payload: GenerateVoucherRequest,
): Promise<GenerateVoucherResponse>
```

La modalidad de pago se determina mediante la información enviada en `paymentTerms`:

* **Contado**: una única entrada con `paymentFormCode: 'Contado'`.
* **Crédito**: una entrada `'Credito'` + cuotas (`'Cuota001'`, `'Cuota002'`, ...) con `dueDate`.

Ejemplo (factura al contado):

```ts
const factura =
  await this.sdkVisioner7Service.generateVoucher({
    operationType: '0101',
    totalTaxableAmount: '305.08',
    totalUntaxedAmount: '0.00',
    totalExemptAmount: '0.00',
    totalFreeAmount: '0.00',
    subtotal: '305.08',
    totalDiscount: '0.00',
    igvPercentage: '18.00',
    totalIgv: '54.92',
    total: '360.00',

    totalInWords: 'TRESCIENTOS SESENTA CON 00/100 SOLES',

    voucherTypeCode: '01',
    currencyCode: 'PEN',

    voucherNumber: 'F001-00000001',
    issueDate: '2025-08-10',

    clientDocumentNumber: 'YOUR_CLIENT_DOCUMENT',
    clientBusinessName: 'CLIENTE DE EJEMPLO',
    clientDocumentType: '6',

    companyDocumentNumber: 'YOUR_RUC',
    companyDocumentType: '6',
    companyBusinessName: 'EMPRESA DE EJEMPLO S.A.C.',

    companySolUsername: 'YOUR_SOL_USER',
    companySolPassword: 'YOUR_SOL_PASSWORD',
    certificatePassword: 'YOUR_CERT_PASSWORD',
    signaturePassword: 'YOUR_SIGNATURE_PASSWORD',
    processType: '1',

    paymentTerms: [
      {
        paymentFormCode: 'Contado',
        amount: '360.00',
      },
    ],

    items: [
      {
        item: '1',
        unitOfMeasure: 'NIU',
        quantity: '1.00',
        price: '360.00',
        amount: '305.08',
        priceTypeCode: '01',
        igv: '54.92',
        igvPercentage: '18.00',
        isc: '0.00',
        operationTypeCode: '10',
        code: 'PROD001',
        description: 'PRODUCTO DE EJEMPLO',
        priceWithoutIgv: '305.08',
        icbperFlag: 0,
        icbperTaxAmount: '0.00',
        icbperTotalAmount: '0.00',
      },
    ],
  });

console.log(factura.sunatMessage);
console.log(factura.file);
```

---

# Manejo de errores

El SDK centraliza los errores mediante `SDKVisioner7ApiException`, que extiende `HttpException` de NestJS.

Ejemplo:

```ts
import { SDKVisioner7ApiException } from
  '@angelitosystems/sdk-visioner7';

try {
  await this.sdkVisioner7Service.lookupTaxpayer(
    '00000000000',
  );
} catch (error) {
  if (error instanceof SDKVisioner7ApiException) {
    console.error(
      error.endpoint,
      error.providerResponse,
    );
  }

  throw error;
}
```

Esto permite integrar fácilmente el SDK con los `ExceptionFilter` globales de NestJS.

---

# Glosario

El servicio integra con conceptos tributarios y logísticos de Perú. Esta sección explica cada término que aparece en el SDK y en los payloads del proveedor:

| Término | Significado |
| --- | --- |
| **SUNAT** | Superintendencia Nacional de Aduanas y de Administración Tributaria: entidad del Estado peruano que administra impuestos y valida los comprobantes electrónicos. |
| **RUC** | Registro Único de Contribuyentes: número de 11 dígitos que identifica a una empresa o persona con negocio ante SUNAT. |
| **DNI** | Documento Nacional de Identidad: documento de identidad de personas naturales peruanas (8 dígitos). |
| **CPE** | Comprobante de Pago Electrónico: factura o boleta electrónica enviada a SUNAT para su validación antes de considerarse emitida. |
| **Factura / Boleta** | Tipos de comprobante. Códigos SUNAT: `01` = factura, `03` = boleta (campo `voucherTypeCode`). |
| **Guía de Remisión (GRE)** | Documento electrónico que sustenta el traslado de bienes (campo `documentTypeCode: '09'`). |
| **Remitente público / privado / transportista** | Modalidades de guía de remisión según quién traslada los bienes. Se definen por los campos incluidos en el payload. |
| **Ticket** | Código que devuelve el proveedor al emitir una guía; permite consultar después el resultado de la validación (`getRemittanceGuideTicketStatus`). |
| **CDR** | Constancia de Recepción: respuesta oficial de SUNAT con el resultado de la validación del comprobante. `responseCode`/`sunatCode` en `"0"` significa aceptado. |
| **Hash CDR / CPE** | Resumen criptográfico (huella) del XML del comprobante o de la constancia. |
| **XML / UBL** | Formato estándar en el que se genera y firma el comprobante electrónico. |
| **IGV** | Impuesto General a las Ventas: IVA peruano (18% habitual). Campos `igv`, `igvPercentage`, `totalIgv`. |
| **ISC** | Impuesto Selectivo al Consumo: aplica a ciertos bienes (bebidas, combustibles, etc.). Campos `isc`, `totalIsc`. |
| **ICBPER** | Impuesto a la Bolsa Plástica de un solo uso. En el proveedor aparece como `IMPUESTO_BP`/`IMPORTE_BP` y el flag `FLG_ICBPER` (mapeado a `icbperFlag`, `icbperTaxAmount`, `icbperTotalAmount`). |
| **Gravado** | Operación afecta al IGV (`totalTaxableAmount`). |
| **Exonerado** | Operación no afecta al IGV por ley (`totalExemptAmount`). |
| **Inafecto** | Operación no sujeta al IGV por naturaleza (`totalUntaxedAmount`). |
| **Gratuito** | Entregas gratuitas (`totalFreeAmount`). |
| **Detracción** | Retención de un porcentaje del pago a una cuenta del Banco de la Nación para ciertos bienes/servicios (campos `detractionCode`, `detractionPercentage`, `detractionsTotal`). |
| **Percepción** | Cobro anticipado del IGV en la venta (campos `perceptions*`). |
| **Retención** | Retención del IGV al proveedor (campos `retentions*`). |
| **Contado / Crédito** | Formas de pago del CPE. En el proveedor: `COD_FORMA_PAGO = 'Contado'` o `'Credito'` + cuotas `Cuota001`, `Cuota002`, ... (mapeado a `paymentTerms`). |
| **Tipo de cambio** | Precio de referencia del dólar (USD) publicado por SUNAT, con valores de compra (`side: 'C'`) y venta (`side: 'V'`). |
| **Ubigeo** | Código geográfico oficial (departamento / provincia / distrito) usado en direcciones. |
| **Usuario SOL / Clave SOL** | Credenciales del portal de SUNAT con las que se firma y envía el comprobante (`companySolUsername`, `companySolPassword`). |
| **Certificado digital / firma** | Certificado con el que se firma el XML del comprobante (`signaturePassword`, `certificatePassword`). |
| **Habido / condición de domicilio** | Condición del contribuyente frente a SUNAT (ubicable o no). Campos `statusCode` y `presenceCode` en el lookup de RUC. |
| **Establecimientos anexos** | Sucursales o locales adicionales declarados por un contribuyente además de su domicilio fiscal. |
| **Tipo de proceso (`processType`)** | Modo de emisión según el proveedor: producción o beta (`'1'` / `'2'`). |
| **MTC** | Ministerio de Transportes y Comunicaciones: registros de vehículos y conductores usados en guías transportista (campos `*MtcRegistrationId`). |
| **NIU / KGM** | Unidades de medida: NIU = unidades, KGM = kilogramos (campos `unitOfMeasure`, `grossWeightUnit`). |
| **PEN / USD** | Códigos de moneda ISO: sol peruano y dólar estadounidense (campo `currencyCode`). |

---

# Integración recomendada

Una arquitectura recomendada sería:

```text
Frontend
   │
   ▼
Backend / API
   │
   ├── Clientes
   ├── Facturación
   ├── Guías
   ├── Reportes
   │
   ▼
SDKVisioner7Service
   │
   ▼
Servicio API contratado
   │
   ▼
Operaciones correspondientes
```

El frontend **no debe comunicarse directamente con el servicio externo utilizando credenciales privadas**.

Las credenciales deben permanecer exclusivamente en el backend.

---

# Seguridad

Nunca expongas en frontend, JavaScript del navegador, aplicaciones móviles sin protección o repositorios públicos:

```text
SDK_VISIONER7_AUTH_TOKEN
SDK_VISIONER7_BUSINESS_TOKEN
USUARIO_SOL_EMPRESA
PASS_SOL_EMPRESA
PAS_FIRMA
CLAVE_TOKEN
ID_TOKEN
```

Utiliza variables de entorno:

```env
SDK_VISIONER7_AUTH_TOKEN=********
SDK_VISIONER7_BUSINESS_TOKEN=********
```

Y agrega `.env` al `.gitignore`:

```gitignore
.env
.env.local
.env.production
```

---

# Protección de datos

Las operaciones de consulta y emisión pueden involucrar información empresarial o datos personales.

La aplicación que utilice este SDK es responsable de:

* Gestionar adecuadamente las credenciales.
* Implementar controles de acceso.
* Proteger la información almacenada.
* Evitar registrar información sensible innecesariamente.
* Cumplir con la normativa que resulte aplicable.
* Utilizar las credenciales únicamente para las finalidades autorizadas.
* Implementar medidas adecuadas de seguridad.

El SDK no pretende sustituir las obligaciones legales, regulatorias o contractuales del sistema que lo utilice.

---

# Ejemplo de integración completa

La carpeta:

```text
example/
```

contiene una integración de referencia:

```text
example/
├── app.module.ts
└── app.controller.ts
```

Por ejemplo:

```ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    SDKVisioner7Module.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        baseUrl: config.get<string>(
          'SDK_VISIONER7_BASE_URL',
        ),

        authToken: config.get<string>(
          'SDK_VISIONER7_AUTH_TOKEN',
        ),

        businessToken: config.get<string>(
          'SDK_VISIONER7_BUSINESS_TOKEN',
        ),

        timeout: 15000,
      }),
    }),
  ],
})
export class AppModule {}
```

---

# Build

Instala las dependencias:

```bash
npm install
```

Compila el proyecto:

```bash
npm run build
```

El resultado normalmente se genera en:

```text
dist/
```

con los archivos JavaScript y declaraciones TypeScript correspondientes.

---

# Estructura del proyecto

```text
@angelitosystems/sdk-visioner7/
│
├── src/
│   ├── interfaces/
│   │   ├── sdk-visioner7-config.interface.ts
│   │   ├── lookups.interface.ts
│   │   ├── remittance-guide.interface.ts
│   │   ├── voucher.interface.ts
│   │   └── index.ts
│   │
│   ├── mapping/
│   │   ├── lookups.mapping.ts
│   │   ├── remittance-guide.mapping.ts
│   │   ├── voucher.mapping.ts
│   │   ├── voucher-response.mapping.ts
│   │   └── index.ts
│   │
│   ├── exceptions/
│   │   └── sdk-visioner7-api.exception.ts
│   │
│   ├── constants.ts
│   ├── sdk-visioner7.module.ts
│   ├── sdk-visioner7.service.ts
│   └── index.ts
│
├── example/
│   ├── app.module.ts
│   └── app.controller.ts
│
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

La carpeta `mapping/` contiene la capa de traducción entre la API pública del SDK (en inglés) y el formato que espera el proveedor (campos como `txtTOTAL`, `NRO_DOCUMENTO_EMPRESA`, etc.).

---

# Naturaleza del proyecto

Este proyecto debe considerarse una **librería de integración independiente**.

La implementación del SDK:

* No constituye una API propia de SUNAT.
* No constituye un producto oficial de Visioner7.
* No representa a Visioner7.
* No afirma una relación societaria, comercial o de representación con Visioner7.
* No modifica ni redistribuye la infraestructura del proveedor.
* Se limita a proporcionar una interfaz de software para facilitar la integración de una aplicación con un servicio externo al que el usuario/cliente tenga acceso autorizado.

La disponibilidad, características, límites, autenticación, endpoints y condiciones de uso del servicio externo dependen del proveedor y del servicio contratado.

---

# Servicio externo

La integración está diseñada para trabajar con el servicio correspondiente disponible en:

[visioner7-api.com](https://visioner7-api.com/?utm_source=chatgpt.com)

Para conocer las condiciones, disponibilidad y características actuales del servicio, consulta directamente la información proporcionada por el proveedor.

---

# Responsabilidad del usuario de la librería

El desarrollador o empresa que utilice este SDK es responsable de:

1. Contar con acceso legítimo al servicio externo.
2. Mantener vigentes sus credenciales.
3. Cumplir las condiciones de uso del servicio contratado.
4. Utilizar las funcionalidades de acuerdo con las autorizaciones correspondientes.
5. Proteger las credenciales de acceso.
6. Cumplir las obligaciones tributarias, comerciales, de privacidad y seguridad que correspondan.
7. Validar que los documentos generados cumplan con los requisitos aplicables a su operación.

---

# Descargo de responsabilidad

Este SDK se proporciona como una herramienta de integración de software.

El desarrollador de esta librería no garantiza la disponibilidad permanente, exactitud, continuidad, tiempos de respuesta o modificaciones futuras del servicio externo.

Los cambios realizados por el proveedor del servicio, incluyendo modificaciones de endpoints, autenticación, formatos de respuesta, límites, requisitos o funcionalidades, pueden requerir actualizaciones del SDK.

La utilización de este SDK no sustituye la revisión de la documentación, condiciones contractuales o requisitos técnicos del servicio externo.

---

# Licencia

La licencia de este proyecto debe definirse de acuerdo con la forma en que se distribuya la librería.

Si se trata de una herramienta privada para proyectos propios o de clientes, se recomienda mantener el repositorio privado y establecer mediante contrato las condiciones de uso, distribución y soporte.

---

## Nota final

Este SDK fue desarrollado como una **capa de integración para facilitar el consumo de un servicio externo contratado**, manteniendo tipado, organización y manejo de errores dentro de aplicaciones NestJS.

Para información sobre el servicio externo utilizado por la integración:

[https://visioner7-api.com/](https://visioner7-api.com/?utm_source=chatgpt.com)

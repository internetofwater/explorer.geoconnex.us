/**
 * RDF literal datatype IRIs used in SPARQL bindings.
 * These identify how a literal value should be interpreted.
 */
type XsdDecimal = 'http://www.w3.org/2001/XMLSchema#decimal';
type XsdInt = 'http://www.w3.org/2001/XMLSchema#int';
type XsdMonth = 'http://www.w3.org/2001/XMLSchema#gMonth';
type XsdYearMonth = 'http://www.w3.org/2001/XMLSchema#gYearMonth';

type GeoWktLiteral = 'http://www.opengis.net/ont/geosparql#wktLiteral';

/**
 * Month represented as a two-digit string (01–12).
 * This enforces valid calendar month formatting at the type level.
 */
type MonthNumber =
    | '01'
    | '02'
    | '03'
    | '04'
    | '05'
    | '06'
    | '07'
    | '08'
    | '09'
    | '10'
    | '11'
    | '12';

/**
 * SPARQL gMonth lexical form.
 * Always prefixed with `--` followed by a two-digit month.
 * Example: "--03" for March.
 */
type ApiMonth = `--${MonthNumber}`;

/**
 * SPARQL gYearMonth lexical form.
 *
 * Represented as CCYY-MM. TypeScript can't express the range 0001–9999 as a
 * template literal type due to its size, so simplifying to `number` here. Range
 * can be validated at runtime.
 *
 * Example: "1999-05" for May 1999.
 */
type ApiYearMonth = `${number}-${MonthNumber}`;

/**
 * Helper type for optionally attaching an XML Schema datatype IRI to a
 * binding. If no datatype is provided, this resolves to an empty object.
 */
type ApiDatatype<Datatype extends string | undefined> = Datatype extends string
    ? { datatype: Datatype }
    : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      {};

/**
 * Helper type for optionally attaching an `xml:lang` tag to a literal. If no
 * language is provided, this resolves to an empty object.
 */
type ApiXmlLang<XmlLang extends string | undefined> = XmlLang extends string
    ? { 'xml:lang': XmlLang }
    : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      {};

/**
 * Base representation of a SPARQL/RDF literal binding.
 * - `type: 'literal'` distinguishes it from URIs
 * - `value` is always a string (may be further constrained)
 * - `datatype` is optional and controls RDF interpretation
 * - `xml:lang` is optional and used for language-tagged strings
 */
export type ApiLiteralBinding<
    Value extends string = string,
    Datatype extends string | undefined = undefined,
    XmlLang extends string | undefined = undefined,
> = {
    type: 'literal';
    value: Value;
} & ApiDatatype<Datatype> &
    ApiXmlLang<XmlLang>;

/**
 * A URI binding represents a resource identifier (IRI).
 * Unlike literals, URIs are not typed or language-tagged.
 */
export type ApiUriBinding = { type: 'uri'; value: string };

/**
 * Union of all supported SPARQL binding types returned by the API.
 */
export type ApiBinding = ApiLiteralBinding | ApiUriBinding;

/**
 * A numeric decimal literal bound with the XSD decimal datatype.
 *
 * Value is still a string at runtime (as typical in RDF/SPARQL), but
 * semantically must represent a decimal number.
 */
export type ApiDecimalBinding = ApiLiteralBinding<string, XsdDecimal>;

/**
 * A numeric integer literal bound with the XSD int datatype.
 *
 * Value is still a string at runtime (as typical in RDF/SPARQL), but
 * semantically must represent a decimal number.
 */
export type ApiIntBinding = ApiLiteralBinding<string, XsdInt>;

/**
 * A year-month literal in SPARQL gMonth format with explicit datatype.
 *
 * Example value: "1999-05"
 */
export type ApiYearMonthBinding = ApiLiteralBinding<ApiYearMonth, XsdYearMonth>;

/**
 * A month literal in SPARQL gMonth format with explicit datatype.
 * Example value: "--07"
 */
export type ApiMonthBinding = ApiLiteralBinding<ApiMonth, XsdMonth>;

/**
 * A language-tagged string literal.
 */
export type ApiLangBinding<Value extends string> = ApiLiteralBinding<
    Value,
    undefined,
    string
>;

/**
 * A well-known text (WKT) representation of geometry.
 */
export type ApiGeoWKTBinding = ApiLiteralBinding<string, GeoWktLiteral>;

/**
 * Generic SPARQL query API response.
 */
export type ApiResponse<V, B> = {
    head: {
        vars: V[];
    };
    results: {
        bindings: B[];
    };
    meta: {
        'query-time-ms': number;
        'result-size-total': number;
    };
};

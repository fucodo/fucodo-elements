(() => {
  // node_modules/@cfworker/json-schema/dist/esm/deep-compare-strict.js
  function deepCompareStrict(a, b) {
    const typeofa = typeof a;
    if (typeofa !== typeof b) {
      return false;
    }
    if (Array.isArray(a)) {
      if (!Array.isArray(b)) {
        return false;
      }
      const length = a.length;
      if (length !== b.length) {
        return false;
      }
      for (let i = 0; i < length; i++) {
        if (!deepCompareStrict(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
    if (typeofa === "object") {
      if (!a || !b) {
        return a === b;
      }
      const aKeys = Object.keys(a);
      const bKeys = Object.keys(b);
      const length = aKeys.length;
      if (length !== bKeys.length) {
        return false;
      }
      for (const k of aKeys) {
        if (!deepCompareStrict(a[k], b[k])) {
          return false;
        }
      }
      return true;
    }
    return a === b;
  }

  // node_modules/@cfworker/json-schema/dist/esm/pointer.js
  function encodePointer(p) {
    return encodeURI(escapePointer(p));
  }
  function escapePointer(p) {
    return p.replace(/~/g, "~0").replace(/\//g, "~1");
  }

  // node_modules/@cfworker/json-schema/dist/esm/dereference.js
  var schemaArrayKeyword = {
    prefixItems: true,
    items: true,
    allOf: true,
    anyOf: true,
    oneOf: true
  };
  var schemaMapKeyword = {
    $defs: true,
    definitions: true,
    properties: true,
    patternProperties: true,
    dependentSchemas: true
  };
  var ignoredKeyword = {
    id: true,
    $id: true,
    $ref: true,
    $schema: true,
    $anchor: true,
    $vocabulary: true,
    $comment: true,
    default: true,
    enum: true,
    const: true,
    required: true,
    type: true,
    maximum: true,
    minimum: true,
    exclusiveMaximum: true,
    exclusiveMinimum: true,
    multipleOf: true,
    maxLength: true,
    minLength: true,
    pattern: true,
    format: true,
    maxItems: true,
    minItems: true,
    uniqueItems: true,
    maxProperties: true,
    minProperties: true
  };
  var initialBaseURI = typeof self !== "undefined" && self.location && self.location.origin !== "null" ? new URL(self.location.origin + self.location.pathname + location.search) : new URL("https://github.com/cfworker");
  function dereference(schema, lookup = /* @__PURE__ */ Object.create(null), baseURI = initialBaseURI, basePointer = "") {
    if (schema && typeof schema === "object" && !Array.isArray(schema)) {
      const id = schema.$id || schema.id;
      if (id) {
        const url = new URL(id, baseURI.href);
        if (url.hash.length > 1) {
          lookup[url.href] = schema;
        } else {
          url.hash = "";
          if (basePointer === "") {
            baseURI = url;
          } else {
            dereference(schema, lookup, baseURI);
          }
        }
      }
    } else if (schema !== true && schema !== false) {
      return lookup;
    }
    const schemaURI = baseURI.href + (basePointer ? "#" + basePointer : "");
    if (lookup[schemaURI] !== void 0) {
      throw new Error(`Duplicate schema URI "${schemaURI}".`);
    }
    lookup[schemaURI] = schema;
    if (schema === true || schema === false) {
      return lookup;
    }
    if (schema.__absolute_uri__ === void 0) {
      Object.defineProperty(schema, "__absolute_uri__", {
        enumerable: false,
        value: schemaURI
      });
    }
    if (schema.$ref && schema.__absolute_ref__ === void 0) {
      const url = new URL(schema.$ref, baseURI.href);
      url.hash = url.hash;
      Object.defineProperty(schema, "__absolute_ref__", {
        enumerable: false,
        value: url.href
      });
    }
    if (schema.$recursiveRef && schema.__absolute_recursive_ref__ === void 0) {
      const url = new URL(schema.$recursiveRef, baseURI.href);
      url.hash = url.hash;
      Object.defineProperty(schema, "__absolute_recursive_ref__", {
        enumerable: false,
        value: url.href
      });
    }
    if (schema.$anchor) {
      const url = new URL("#" + schema.$anchor, baseURI.href);
      lookup[url.href] = schema;
    }
    for (let key in schema) {
      if (ignoredKeyword[key]) {
        continue;
      }
      const keyBase = `${basePointer}/${encodePointer(key)}`;
      const subSchema = schema[key];
      if (Array.isArray(subSchema)) {
        if (schemaArrayKeyword[key]) {
          const length = subSchema.length;
          for (let i = 0; i < length; i++) {
            dereference(subSchema[i], lookup, baseURI, `${keyBase}/${i}`);
          }
        }
      } else if (schemaMapKeyword[key]) {
        for (let subKey in subSchema) {
          dereference(subSchema[subKey], lookup, baseURI, `${keyBase}/${encodePointer(subKey)}`);
        }
      } else {
        dereference(subSchema, lookup, baseURI, keyBase);
      }
    }
    return lookup;
  }

  // node_modules/@cfworker/json-schema/dist/esm/format.js
  var DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
  var DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var TIME = /^(\d\d):(\d\d):(\d\d)(\.\d+)?(z|[+-]\d\d(?::?\d\d)?)?$/i;
  var HOSTNAME = /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i;
  var URIREF = /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  var URITEMPLATE = /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i;
  var URL_ = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u{00a1}-\u{ffff}0-9]+-?)*[a-z\u{00a1}-\u{ffff}0-9]+)(?:\.(?:[a-z\u{00a1}-\u{ffff}0-9]+-?)*[a-z\u{00a1}-\u{ffff}0-9]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu;
  var UUID = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
  var JSON_POINTER = /^(?:\/(?:[^~/]|~0|~1)*)*$/;
  var JSON_POINTER_URI_FRAGMENT = /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i;
  var RELATIVE_JSON_POINTER = /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/;
  var EMAIL = (input) => {
    if (input[0] === '"')
      return false;
    const [name, host, ...rest] = input.split("@");
    if (!name || !host || rest.length !== 0 || name.length > 64 || host.length > 253)
      return false;
    if (name[0] === "." || name.endsWith(".") || name.includes(".."))
      return false;
    if (!/^[a-z0-9.-]+$/i.test(host) || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(name))
      return false;
    return host.split(".").every((part) => /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i.test(part));
  };
  var IPV4 = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
  var IPV6 = /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i;
  var DURATION = (input) => input.length > 1 && input.length < 80 && (/^P\d+([.,]\d+)?W$/.test(input) || /^P[\dYMDTHS]*(\d[.,]\d+)?[YMDHS]$/.test(input) && /^P([.,\d]+Y)?([.,\d]+M)?([.,\d]+D)?(T([.,\d]+H)?([.,\d]+M)?([.,\d]+S)?)?$/.test(input));
  function bind(r) {
    return r.test.bind(r);
  }
  var format = {
    date,
    time: time.bind(void 0, false),
    "date-time": date_time,
    duration: DURATION,
    uri,
    "uri-reference": bind(URIREF),
    "uri-template": bind(URITEMPLATE),
    url: bind(URL_),
    email: EMAIL,
    hostname: bind(HOSTNAME),
    ipv4: bind(IPV4),
    ipv6: bind(IPV6),
    regex,
    uuid: bind(UUID),
    "json-pointer": bind(JSON_POINTER),
    "json-pointer-uri-fragment": bind(JSON_POINTER_URI_FRAGMENT),
    "relative-json-pointer": bind(RELATIVE_JSON_POINTER)
  };
  function isLeapYear(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  }
  function date(str) {
    const matches = str.match(DATE);
    if (!matches)
      return false;
    const year = +matches[1];
    const month = +matches[2];
    const day = +matches[3];
    return month >= 1 && month <= 12 && day >= 1 && day <= (month == 2 && isLeapYear(year) ? 29 : DAYS[month]);
  }
  function time(full, str) {
    const matches = str.match(TIME);
    if (!matches)
      return false;
    const hour = +matches[1];
    const minute = +matches[2];
    const second = +matches[3];
    const timeZone = !!matches[5];
    return (hour <= 23 && minute <= 59 && second <= 59 || hour == 23 && minute == 59 && second == 60) && (!full || timeZone);
  }
  var DATE_TIME_SEPARATOR = /t|\s/i;
  function date_time(str) {
    const dateTime = str.split(DATE_TIME_SEPARATOR);
    return dateTime.length == 2 && date(dateTime[0]) && time(true, dateTime[1]);
  }
  var NOT_URI_FRAGMENT = /\/|:/;
  var URI_PATTERN = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function uri(str) {
    return NOT_URI_FRAGMENT.test(str) && URI_PATTERN.test(str);
  }
  var Z_ANCHOR = /[^\\]\\Z/;
  function regex(str) {
    if (Z_ANCHOR.test(str))
      return false;
    try {
      new RegExp(str, "u");
      return true;
    } catch (e) {
      return false;
    }
  }

  // node_modules/@cfworker/json-schema/dist/esm/types.js
  var OutputFormat;
  (function(OutputFormat2) {
    OutputFormat2[OutputFormat2["Flag"] = 1] = "Flag";
    OutputFormat2[OutputFormat2["Basic"] = 2] = "Basic";
    OutputFormat2[OutputFormat2["Detailed"] = 4] = "Detailed";
  })(OutputFormat || (OutputFormat = {}));

  // node_modules/@cfworker/json-schema/dist/esm/ucs2-length.js
  function ucs2length(s) {
    let result = 0;
    let length = s.length;
    let index = 0;
    let charCode;
    while (index < length) {
      result++;
      charCode = s.charCodeAt(index++);
      if (charCode >= 55296 && charCode <= 56319 && index < length) {
        charCode = s.charCodeAt(index);
        if ((charCode & 64512) == 56320) {
          index++;
        }
      }
    }
    return result;
  }

  // node_modules/@cfworker/json-schema/dist/esm/validate.js
  function validate(instance, schema, draft = "2019-09", lookup = dereference(schema), shortCircuit = true, recursiveAnchor = null, instanceLocation = "#", schemaLocation = "#", evaluated = /* @__PURE__ */ Object.create(null)) {
    if (schema === true) {
      return { valid: true, errors: [] };
    }
    if (schema === false) {
      return {
        valid: false,
        errors: [
          {
            instanceLocation,
            keyword: "false",
            keywordLocation: instanceLocation,
            error: "False boolean schema."
          }
        ]
      };
    }
    const rawInstanceType = typeof instance;
    let instanceType;
    switch (rawInstanceType) {
      case "boolean":
      case "number":
      case "string":
        instanceType = rawInstanceType;
        break;
      case "object":
        if (instance === null) {
          instanceType = "null";
        } else if (Array.isArray(instance)) {
          instanceType = "array";
        } else {
          instanceType = "object";
        }
        break;
      default:
        throw new Error(`Instances of "${rawInstanceType}" type are not supported.`);
    }
    const { $ref, $recursiveRef, $recursiveAnchor, type: $type, const: $const, enum: $enum, required: $required, not: $not, anyOf: $anyOf, allOf: $allOf, oneOf: $oneOf, if: $if, then: $then, else: $else, format: $format, properties: $properties, patternProperties: $patternProperties, additionalProperties: $additionalProperties, unevaluatedProperties: $unevaluatedProperties, minProperties: $minProperties, maxProperties: $maxProperties, propertyNames: $propertyNames, dependentRequired: $dependentRequired, dependentSchemas: $dependentSchemas, dependencies: $dependencies, prefixItems: $prefixItems, items: $items, additionalItems: $additionalItems, unevaluatedItems: $unevaluatedItems, contains: $contains, minContains: $minContains, maxContains: $maxContains, minItems: $minItems, maxItems: $maxItems, uniqueItems: $uniqueItems, minimum: $minimum, maximum: $maximum, exclusiveMinimum: $exclusiveMinimum, exclusiveMaximum: $exclusiveMaximum, multipleOf: $multipleOf, minLength: $minLength, maxLength: $maxLength, pattern: $pattern, __absolute_ref__, __absolute_recursive_ref__ } = schema;
    const errors = [];
    if ($recursiveAnchor === true && recursiveAnchor === null) {
      recursiveAnchor = schema;
    }
    if ($recursiveRef === "#") {
      const refSchema = recursiveAnchor === null ? lookup[__absolute_recursive_ref__] : recursiveAnchor;
      const keywordLocation = `${schemaLocation}/$recursiveRef`;
      const result = validate(instance, recursiveAnchor === null ? schema : recursiveAnchor, draft, lookup, shortCircuit, refSchema, instanceLocation, keywordLocation, evaluated);
      if (!result.valid) {
        errors.push({
          instanceLocation,
          keyword: "$recursiveRef",
          keywordLocation,
          error: "A subschema had errors."
        }, ...result.errors);
      }
    }
    if ($ref !== void 0) {
      const uri2 = __absolute_ref__ || $ref;
      const refSchema = lookup[uri2];
      if (refSchema === void 0) {
        let message = `Unresolved $ref "${$ref}".`;
        if (__absolute_ref__ && __absolute_ref__ !== $ref) {
          message += `  Absolute URI "${__absolute_ref__}".`;
        }
        message += `
Known schemas:
- ${Object.keys(lookup).join("\n- ")}`;
        throw new Error(message);
      }
      const keywordLocation = `${schemaLocation}/$ref`;
      const result = validate(instance, refSchema, draft, lookup, shortCircuit, recursiveAnchor, instanceLocation, keywordLocation, evaluated);
      if (!result.valid) {
        errors.push({
          instanceLocation,
          keyword: "$ref",
          keywordLocation,
          error: "A subschema had errors."
        }, ...result.errors);
      }
      if (draft === "4" || draft === "7") {
        return { valid: errors.length === 0, errors };
      }
    }
    if (Array.isArray($type)) {
      let length = $type.length;
      let valid = false;
      for (let i = 0; i < length; i++) {
        if (instanceType === $type[i] || $type[i] === "integer" && instanceType === "number" && instance % 1 === 0 && instance === instance) {
          valid = true;
          break;
        }
      }
      if (!valid) {
        errors.push({
          instanceLocation,
          keyword: "type",
          keywordLocation: `${schemaLocation}/type`,
          error: `Instance type "${instanceType}" is invalid. Expected "${$type.join('", "')}".`
        });
      }
    } else if ($type === "integer") {
      if (instanceType !== "number" || instance % 1 || instance !== instance) {
        errors.push({
          instanceLocation,
          keyword: "type",
          keywordLocation: `${schemaLocation}/type`,
          error: `Instance type "${instanceType}" is invalid. Expected "${$type}".`
        });
      }
    } else if ($type !== void 0 && instanceType !== $type) {
      errors.push({
        instanceLocation,
        keyword: "type",
        keywordLocation: `${schemaLocation}/type`,
        error: `Instance type "${instanceType}" is invalid. Expected "${$type}".`
      });
    }
    if ($const !== void 0) {
      if (instanceType === "object" || instanceType === "array") {
        if (!deepCompareStrict(instance, $const)) {
          errors.push({
            instanceLocation,
            keyword: "const",
            keywordLocation: `${schemaLocation}/const`,
            error: `Instance does not match ${JSON.stringify($const)}.`
          });
        }
      } else if (instance !== $const) {
        errors.push({
          instanceLocation,
          keyword: "const",
          keywordLocation: `${schemaLocation}/const`,
          error: `Instance does not match ${JSON.stringify($const)}.`
        });
      }
    }
    if ($enum !== void 0) {
      if (instanceType === "object" || instanceType === "array") {
        if (!$enum.some((value) => deepCompareStrict(instance, value))) {
          errors.push({
            instanceLocation,
            keyword: "enum",
            keywordLocation: `${schemaLocation}/enum`,
            error: `Instance does not match any of ${JSON.stringify($enum)}.`
          });
        }
      } else if (!$enum.some((value) => instance === value)) {
        errors.push({
          instanceLocation,
          keyword: "enum",
          keywordLocation: `${schemaLocation}/enum`,
          error: `Instance does not match any of ${JSON.stringify($enum)}.`
        });
      }
    }
    if ($not !== void 0) {
      const keywordLocation = `${schemaLocation}/not`;
      const result = validate(instance, $not, draft, lookup, shortCircuit, recursiveAnchor, instanceLocation, keywordLocation);
      if (result.valid) {
        errors.push({
          instanceLocation,
          keyword: "not",
          keywordLocation,
          error: 'Instance matched "not" schema.'
        });
      }
    }
    let subEvaluateds = [];
    if ($anyOf !== void 0) {
      const keywordLocation = `${schemaLocation}/anyOf`;
      const errorsLength = errors.length;
      let anyValid = false;
      for (let i = 0; i < $anyOf.length; i++) {
        const subSchema = $anyOf[i];
        const subEvaluated = Object.create(evaluated);
        const result = validate(instance, subSchema, draft, lookup, shortCircuit, $recursiveAnchor === true ? recursiveAnchor : null, instanceLocation, `${keywordLocation}/${i}`, subEvaluated);
        errors.push(...result.errors);
        anyValid = anyValid || result.valid;
        if (result.valid) {
          subEvaluateds.push(subEvaluated);
        }
      }
      if (anyValid) {
        errors.length = errorsLength;
      } else {
        errors.splice(errorsLength, 0, {
          instanceLocation,
          keyword: "anyOf",
          keywordLocation,
          error: "Instance does not match any subschemas."
        });
      }
    }
    if ($allOf !== void 0) {
      const keywordLocation = `${schemaLocation}/allOf`;
      const errorsLength = errors.length;
      let allValid = true;
      for (let i = 0; i < $allOf.length; i++) {
        const subSchema = $allOf[i];
        const subEvaluated = Object.create(evaluated);
        const result = validate(instance, subSchema, draft, lookup, shortCircuit, $recursiveAnchor === true ? recursiveAnchor : null, instanceLocation, `${keywordLocation}/${i}`, subEvaluated);
        errors.push(...result.errors);
        allValid = allValid && result.valid;
        if (result.valid) {
          subEvaluateds.push(subEvaluated);
        }
      }
      if (allValid) {
        errors.length = errorsLength;
      } else {
        errors.splice(errorsLength, 0, {
          instanceLocation,
          keyword: "allOf",
          keywordLocation,
          error: `Instance does not match every subschema.`
        });
      }
    }
    if ($oneOf !== void 0) {
      const keywordLocation = `${schemaLocation}/oneOf`;
      const errorsLength = errors.length;
      const matches = $oneOf.filter((subSchema, i) => {
        const subEvaluated = Object.create(evaluated);
        const result = validate(instance, subSchema, draft, lookup, shortCircuit, $recursiveAnchor === true ? recursiveAnchor : null, instanceLocation, `${keywordLocation}/${i}`, subEvaluated);
        errors.push(...result.errors);
        if (result.valid) {
          subEvaluateds.push(subEvaluated);
        }
        return result.valid;
      }).length;
      if (matches === 1) {
        errors.length = errorsLength;
      } else {
        errors.splice(errorsLength, 0, {
          instanceLocation,
          keyword: "oneOf",
          keywordLocation,
          error: `Instance does not match exactly one subschema (${matches} matches).`
        });
      }
    }
    if (instanceType === "object" || instanceType === "array") {
      Object.assign(evaluated, ...subEvaluateds);
    }
    if ($if !== void 0) {
      const keywordLocation = `${schemaLocation}/if`;
      const conditionResult = validate(instance, $if, draft, lookup, shortCircuit, recursiveAnchor, instanceLocation, keywordLocation, evaluated).valid;
      if (conditionResult) {
        if ($then !== void 0) {
          const thenResult = validate(instance, $then, draft, lookup, shortCircuit, recursiveAnchor, instanceLocation, `${schemaLocation}/then`, evaluated);
          if (!thenResult.valid) {
            errors.push({
              instanceLocation,
              keyword: "if",
              keywordLocation,
              error: `Instance does not match "then" schema.`
            }, ...thenResult.errors);
          }
        }
      } else if ($else !== void 0) {
        const elseResult = validate(instance, $else, draft, lookup, shortCircuit, recursiveAnchor, instanceLocation, `${schemaLocation}/else`, evaluated);
        if (!elseResult.valid) {
          errors.push({
            instanceLocation,
            keyword: "if",
            keywordLocation,
            error: `Instance does not match "else" schema.`
          }, ...elseResult.errors);
        }
      }
    }
    if (instanceType === "object") {
      if ($required !== void 0) {
        for (const key of $required) {
          if (!(key in instance)) {
            errors.push({
              instanceLocation,
              keyword: "required",
              keywordLocation: `${schemaLocation}/required`,
              error: `Instance does not have required property "${key}".`
            });
          }
        }
      }
      const keys = Object.keys(instance);
      if ($minProperties !== void 0 && keys.length < $minProperties) {
        errors.push({
          instanceLocation,
          keyword: "minProperties",
          keywordLocation: `${schemaLocation}/minProperties`,
          error: `Instance does not have at least ${$minProperties} properties.`
        });
      }
      if ($maxProperties !== void 0 && keys.length > $maxProperties) {
        errors.push({
          instanceLocation,
          keyword: "maxProperties",
          keywordLocation: `${schemaLocation}/maxProperties`,
          error: `Instance does not have at least ${$maxProperties} properties.`
        });
      }
      if ($propertyNames !== void 0) {
        const keywordLocation = `${schemaLocation}/propertyNames`;
        for (const key in instance) {
          const subInstancePointer = `${instanceLocation}/${encodePointer(key)}`;
          const result = validate(key, $propertyNames, draft, lookup, shortCircuit, recursiveAnchor, subInstancePointer, keywordLocation);
          if (!result.valid) {
            errors.push({
              instanceLocation,
              keyword: "propertyNames",
              keywordLocation,
              error: `Property name "${key}" does not match schema.`
            }, ...result.errors);
          }
        }
      }
      if ($dependentRequired !== void 0) {
        const keywordLocation = `${schemaLocation}/dependantRequired`;
        for (const key in $dependentRequired) {
          if (key in instance) {
            const required = $dependentRequired[key];
            for (const dependantKey of required) {
              if (!(dependantKey in instance)) {
                errors.push({
                  instanceLocation,
                  keyword: "dependentRequired",
                  keywordLocation,
                  error: `Instance has "${key}" but does not have "${dependantKey}".`
                });
              }
            }
          }
        }
      }
      if ($dependentSchemas !== void 0) {
        for (const key in $dependentSchemas) {
          const keywordLocation = `${schemaLocation}/dependentSchemas`;
          if (key in instance) {
            const result = validate(instance, $dependentSchemas[key], draft, lookup, shortCircuit, recursiveAnchor, instanceLocation, `${keywordLocation}/${encodePointer(key)}`, evaluated);
            if (!result.valid) {
              errors.push({
                instanceLocation,
                keyword: "dependentSchemas",
                keywordLocation,
                error: `Instance has "${key}" but does not match dependant schema.`
              }, ...result.errors);
            }
          }
        }
      }
      if ($dependencies !== void 0) {
        const keywordLocation = `${schemaLocation}/dependencies`;
        for (const key in $dependencies) {
          if (key in instance) {
            const propsOrSchema = $dependencies[key];
            if (Array.isArray(propsOrSchema)) {
              for (const dependantKey of propsOrSchema) {
                if (!(dependantKey in instance)) {
                  errors.push({
                    instanceLocation,
                    keyword: "dependencies",
                    keywordLocation,
                    error: `Instance has "${key}" but does not have "${dependantKey}".`
                  });
                }
              }
            } else {
              const result = validate(instance, propsOrSchema, draft, lookup, shortCircuit, recursiveAnchor, instanceLocation, `${keywordLocation}/${encodePointer(key)}`);
              if (!result.valid) {
                errors.push({
                  instanceLocation,
                  keyword: "dependencies",
                  keywordLocation,
                  error: `Instance has "${key}" but does not match dependant schema.`
                }, ...result.errors);
              }
            }
          }
        }
      }
      const thisEvaluated = /* @__PURE__ */ Object.create(null);
      let stop = false;
      if ($properties !== void 0) {
        const keywordLocation = `${schemaLocation}/properties`;
        for (const key in $properties) {
          if (!(key in instance)) {
            continue;
          }
          const subInstancePointer = `${instanceLocation}/${encodePointer(key)}`;
          const result = validate(instance[key], $properties[key], draft, lookup, shortCircuit, recursiveAnchor, subInstancePointer, `${keywordLocation}/${encodePointer(key)}`);
          if (result.valid) {
            evaluated[key] = thisEvaluated[key] = true;
          } else {
            stop = shortCircuit;
            errors.push({
              instanceLocation,
              keyword: "properties",
              keywordLocation,
              error: `Property "${key}" does not match schema.`
            }, ...result.errors);
            if (stop)
              break;
          }
        }
      }
      if (!stop && $patternProperties !== void 0) {
        const keywordLocation = `${schemaLocation}/patternProperties`;
        for (const pattern in $patternProperties) {
          const regex2 = new RegExp(pattern, "u");
          const subSchema = $patternProperties[pattern];
          for (const key in instance) {
            if (!regex2.test(key)) {
              continue;
            }
            const subInstancePointer = `${instanceLocation}/${encodePointer(key)}`;
            const result = validate(instance[key], subSchema, draft, lookup, shortCircuit, recursiveAnchor, subInstancePointer, `${keywordLocation}/${encodePointer(pattern)}`);
            if (result.valid) {
              evaluated[key] = thisEvaluated[key] = true;
            } else {
              stop = shortCircuit;
              errors.push({
                instanceLocation,
                keyword: "patternProperties",
                keywordLocation,
                error: `Property "${key}" matches pattern "${pattern}" but does not match associated schema.`
              }, ...result.errors);
            }
          }
        }
      }
      if (!stop && $additionalProperties !== void 0) {
        const keywordLocation = `${schemaLocation}/additionalProperties`;
        for (const key in instance) {
          if (thisEvaluated[key]) {
            continue;
          }
          const subInstancePointer = `${instanceLocation}/${encodePointer(key)}`;
          const result = validate(instance[key], $additionalProperties, draft, lookup, shortCircuit, recursiveAnchor, subInstancePointer, keywordLocation);
          if (result.valid) {
            evaluated[key] = true;
          } else {
            stop = shortCircuit;
            errors.push({
              instanceLocation,
              keyword: "additionalProperties",
              keywordLocation,
              error: `Property "${key}" does not match additional properties schema.`
            }, ...result.errors);
          }
        }
      } else if (!stop && $unevaluatedProperties !== void 0) {
        const keywordLocation = `${schemaLocation}/unevaluatedProperties`;
        for (const key in instance) {
          if (!evaluated[key]) {
            const subInstancePointer = `${instanceLocation}/${encodePointer(key)}`;
            const result = validate(instance[key], $unevaluatedProperties, draft, lookup, shortCircuit, recursiveAnchor, subInstancePointer, keywordLocation);
            if (result.valid) {
              evaluated[key] = true;
            } else {
              errors.push({
                instanceLocation,
                keyword: "unevaluatedProperties",
                keywordLocation,
                error: `Property "${key}" does not match unevaluated properties schema.`
              }, ...result.errors);
            }
          }
        }
      }
    } else if (instanceType === "array") {
      if ($maxItems !== void 0 && instance.length > $maxItems) {
        errors.push({
          instanceLocation,
          keyword: "maxItems",
          keywordLocation: `${schemaLocation}/maxItems`,
          error: `Array has too many items (${instance.length} > ${$maxItems}).`
        });
      }
      if ($minItems !== void 0 && instance.length < $minItems) {
        errors.push({
          instanceLocation,
          keyword: "minItems",
          keywordLocation: `${schemaLocation}/minItems`,
          error: `Array has too few items (${instance.length} < ${$minItems}).`
        });
      }
      const length = instance.length;
      let i = 0;
      let stop = false;
      if ($prefixItems !== void 0) {
        const keywordLocation = `${schemaLocation}/prefixItems`;
        const length2 = Math.min($prefixItems.length, length);
        for (; i < length2; i++) {
          const result = validate(instance[i], $prefixItems[i], draft, lookup, shortCircuit, recursiveAnchor, `${instanceLocation}/${i}`, `${keywordLocation}/${i}`);
          evaluated[i] = true;
          if (!result.valid) {
            stop = shortCircuit;
            errors.push({
              instanceLocation,
              keyword: "prefixItems",
              keywordLocation,
              error: `Items did not match schema.`
            }, ...result.errors);
            if (stop)
              break;
          }
        }
      }
      if ($items !== void 0) {
        const keywordLocation = `${schemaLocation}/items`;
        if (Array.isArray($items)) {
          const length2 = Math.min($items.length, length);
          for (; i < length2; i++) {
            const result = validate(instance[i], $items[i], draft, lookup, shortCircuit, recursiveAnchor, `${instanceLocation}/${i}`, `${keywordLocation}/${i}`);
            evaluated[i] = true;
            if (!result.valid) {
              stop = shortCircuit;
              errors.push({
                instanceLocation,
                keyword: "items",
                keywordLocation,
                error: `Items did not match schema.`
              }, ...result.errors);
              if (stop)
                break;
            }
          }
        } else {
          for (; i < length; i++) {
            const result = validate(instance[i], $items, draft, lookup, shortCircuit, recursiveAnchor, `${instanceLocation}/${i}`, keywordLocation);
            evaluated[i] = true;
            if (!result.valid) {
              stop = shortCircuit;
              errors.push({
                instanceLocation,
                keyword: "items",
                keywordLocation,
                error: `Items did not match schema.`
              }, ...result.errors);
              if (stop)
                break;
            }
          }
        }
        if (!stop && $additionalItems !== void 0) {
          const keywordLocation2 = `${schemaLocation}/additionalItems`;
          for (; i < length; i++) {
            const result = validate(instance[i], $additionalItems, draft, lookup, shortCircuit, recursiveAnchor, `${instanceLocation}/${i}`, keywordLocation2);
            evaluated[i] = true;
            if (!result.valid) {
              stop = shortCircuit;
              errors.push({
                instanceLocation,
                keyword: "additionalItems",
                keywordLocation: keywordLocation2,
                error: `Items did not match additional items schema.`
              }, ...result.errors);
            }
          }
        }
      }
      if ($contains !== void 0) {
        if (length === 0 && $minContains === void 0) {
          errors.push({
            instanceLocation,
            keyword: "contains",
            keywordLocation: `${schemaLocation}/contains`,
            error: `Array is empty. It must contain at least one item matching the schema.`
          });
        } else if ($minContains !== void 0 && length < $minContains) {
          errors.push({
            instanceLocation,
            keyword: "minContains",
            keywordLocation: `${schemaLocation}/minContains`,
            error: `Array has less items (${length}) than minContains (${$minContains}).`
          });
        } else {
          const keywordLocation = `${schemaLocation}/contains`;
          const errorsLength = errors.length;
          let contained = 0;
          for (let j = 0; j < length; j++) {
            const result = validate(instance[j], $contains, draft, lookup, shortCircuit, recursiveAnchor, `${instanceLocation}/${j}`, keywordLocation);
            if (result.valid) {
              evaluated[j] = true;
              contained++;
            } else {
              errors.push(...result.errors);
            }
          }
          if (contained >= ($minContains || 0)) {
            errors.length = errorsLength;
          }
          if ($minContains === void 0 && $maxContains === void 0 && contained === 0) {
            errors.splice(errorsLength, 0, {
              instanceLocation,
              keyword: "contains",
              keywordLocation,
              error: `Array does not contain item matching schema.`
            });
          } else if ($minContains !== void 0 && contained < $minContains) {
            errors.push({
              instanceLocation,
              keyword: "minContains",
              keywordLocation: `${schemaLocation}/minContains`,
              error: `Array must contain at least ${$minContains} items matching schema. Only ${contained} items were found.`
            });
          } else if ($maxContains !== void 0 && contained > $maxContains) {
            errors.push({
              instanceLocation,
              keyword: "maxContains",
              keywordLocation: `${schemaLocation}/maxContains`,
              error: `Array may contain at most ${$maxContains} items matching schema. ${contained} items were found.`
            });
          }
        }
      }
      if (!stop && $unevaluatedItems !== void 0) {
        const keywordLocation = `${schemaLocation}/unevaluatedItems`;
        for (i; i < length; i++) {
          if (evaluated[i]) {
            continue;
          }
          const result = validate(instance[i], $unevaluatedItems, draft, lookup, shortCircuit, recursiveAnchor, `${instanceLocation}/${i}`, keywordLocation);
          evaluated[i] = true;
          if (!result.valid) {
            errors.push({
              instanceLocation,
              keyword: "unevaluatedItems",
              keywordLocation,
              error: `Items did not match unevaluated items schema.`
            }, ...result.errors);
          }
        }
      }
      if ($uniqueItems) {
        for (let j = 0; j < length; j++) {
          const a = instance[j];
          const ao = typeof a === "object" && a !== null;
          for (let k = 0; k < length; k++) {
            if (j === k) {
              continue;
            }
            const b = instance[k];
            const bo = typeof b === "object" && b !== null;
            if (a === b || ao && bo && deepCompareStrict(a, b)) {
              errors.push({
                instanceLocation,
                keyword: "uniqueItems",
                keywordLocation: `${schemaLocation}/uniqueItems`,
                error: `Duplicate items at indexes ${j} and ${k}.`
              });
              j = Number.MAX_SAFE_INTEGER;
              k = Number.MAX_SAFE_INTEGER;
            }
          }
        }
      }
    } else if (instanceType === "number") {
      if (draft === "4") {
        if ($minimum !== void 0 && ($exclusiveMinimum === true && instance <= $minimum || instance < $minimum)) {
          errors.push({
            instanceLocation,
            keyword: "minimum",
            keywordLocation: `${schemaLocation}/minimum`,
            error: `${instance} is less than ${$exclusiveMinimum ? "or equal to " : ""} ${$minimum}.`
          });
        }
        if ($maximum !== void 0 && ($exclusiveMaximum === true && instance >= $maximum || instance > $maximum)) {
          errors.push({
            instanceLocation,
            keyword: "maximum",
            keywordLocation: `${schemaLocation}/maximum`,
            error: `${instance} is greater than ${$exclusiveMaximum ? "or equal to " : ""} ${$maximum}.`
          });
        }
      } else {
        if ($minimum !== void 0 && instance < $minimum) {
          errors.push({
            instanceLocation,
            keyword: "minimum",
            keywordLocation: `${schemaLocation}/minimum`,
            error: `${instance} is less than ${$minimum}.`
          });
        }
        if ($maximum !== void 0 && instance > $maximum) {
          errors.push({
            instanceLocation,
            keyword: "maximum",
            keywordLocation: `${schemaLocation}/maximum`,
            error: `${instance} is greater than ${$maximum}.`
          });
        }
        if ($exclusiveMinimum !== void 0 && instance <= $exclusiveMinimum) {
          errors.push({
            instanceLocation,
            keyword: "exclusiveMinimum",
            keywordLocation: `${schemaLocation}/exclusiveMinimum`,
            error: `${instance} is less than ${$exclusiveMinimum}.`
          });
        }
        if ($exclusiveMaximum !== void 0 && instance >= $exclusiveMaximum) {
          errors.push({
            instanceLocation,
            keyword: "exclusiveMaximum",
            keywordLocation: `${schemaLocation}/exclusiveMaximum`,
            error: `${instance} is greater than or equal to ${$exclusiveMaximum}.`
          });
        }
      }
      if ($multipleOf !== void 0) {
        const remainder = instance % $multipleOf;
        if (Math.abs(0 - remainder) >= 11920929e-14 && Math.abs($multipleOf - remainder) >= 11920929e-14) {
          errors.push({
            instanceLocation,
            keyword: "multipleOf",
            keywordLocation: `${schemaLocation}/multipleOf`,
            error: `${instance} is not a multiple of ${$multipleOf}.`
          });
        }
      }
    } else if (instanceType === "string") {
      const length = $minLength === void 0 && $maxLength === void 0 ? 0 : ucs2length(instance);
      if ($minLength !== void 0 && length < $minLength) {
        errors.push({
          instanceLocation,
          keyword: "minLength",
          keywordLocation: `${schemaLocation}/minLength`,
          error: `String is too short (${length} < ${$minLength}).`
        });
      }
      if ($maxLength !== void 0 && length > $maxLength) {
        errors.push({
          instanceLocation,
          keyword: "maxLength",
          keywordLocation: `${schemaLocation}/maxLength`,
          error: `String is too long (${length} > ${$maxLength}).`
        });
      }
      if ($pattern !== void 0 && !new RegExp($pattern, "u").test(instance)) {
        errors.push({
          instanceLocation,
          keyword: "pattern",
          keywordLocation: `${schemaLocation}/pattern`,
          error: `String does not match pattern.`
        });
      }
      if ($format !== void 0 && format[$format] && !format[$format](instance)) {
        errors.push({
          instanceLocation,
          keyword: "format",
          keywordLocation: `${schemaLocation}/format`,
          error: `String does not match format "${$format}".`
        });
      }
    }
    return { valid: errors.length === 0, errors };
  }

  // node_modules/@cfworker/json-schema/dist/esm/validator.js
  var Validator = class {
    schema;
    draft;
    shortCircuit;
    lookup;
    constructor(schema, draft = "2019-09", shortCircuit = true) {
      this.schema = schema;
      this.draft = draft;
      this.shortCircuit = shortCircuit;
      this.lookup = dereference(schema);
    }
    validate(instance) {
      return validate(instance, this.schema, this.draft, this.lookup, this.shortCircuit);
    }
    addSchema(schema, id) {
      if (id) {
        schema = { ...schema, $id: id };
      }
      dereference(schema, this.lookup);
    }
  };

  // packages/fucodo-json-editor-structured/schema-resolver.js
  var escapePointerToken = (token) => String(token).replace(/~/g, "~0").replace(/\//g, "~1");
  var unescapePointerToken = (token) => token.replace(/~1/g, "/").replace(/~0/g, "~");
  function joinPointer(pointer, token) {
    return `${pointer}/${escapePointerToken(token)}`;
  }
  function splitPointer(pointer) {
    if (!pointer) return [];
    return pointer.slice(1).split("/").map(unescapePointerToken);
  }
  function getAt(root, pointer) {
    let node = root;
    for (const token of splitPointer(pointer)) {
      if (node === null || typeof node !== "object") return void 0;
      node = node[token];
    }
    return node;
  }
  function setAt(root, pointer, value) {
    const tokens = splitPointer(pointer);
    if (!tokens.length) return value;
    const parent = getAt(root, `/${tokens.slice(0, -1).map(escapePointerToken).join("/")}`.replace(/^\/$/, ""));
    const key = tokens.at(-1);
    if (Array.isArray(parent)) parent[Number(key)] = value;
    else if (parent && typeof parent === "object") parent[key] = value;
    return root;
  }
  function locationToPointer(location2) {
    const raw = location2.startsWith("#") ? location2.slice(1) : location2;
    return raw.split("/").map((part) => {
      try {
        return decodeURIComponent(part);
      } catch {
        return part;
      }
    }).join("/");
  }
  function typeOfValue(value) {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    if (Number.isInteger(value)) return "integer";
    return typeof value;
  }
  function valueMatchesType(value, type) {
    const actual = typeOfValue(value);
    return actual === type || type === "number" && actual === "integer";
  }
  function allowedTypes(schema) {
    if (!schema || typeof schema !== "object") return [];
    if (schema.const !== void 0) return [typeOfValue(schema.const) === "integer" ? "integer" : typeOfValue(schema.const)];
    if (Array.isArray(schema.enum)) {
      return [...new Set(schema.enum.map((v) => typeOfValue(v)))];
    }
    if (Array.isArray(schema.type)) return schema.type;
    if (typeof schema.type === "string") return [schema.type];
    if (schema.properties || schema.required || schema.additionalProperties !== void 0) return ["object"];
    if (schema.items || schema.prefixItems) return ["array"];
    return [];
  }
  var MERGE_UNION_OBJECTS = ["properties", "patternProperties", "$defs", "definitions"];
  var SchemaResolver = class {
    #root;
    #validators = /* @__PURE__ */ new WeakMap();
    constructor(rootSchema) {
      if (rootSchema === void 0 || rootSchema === null) throw new Error("Schema fehlt.");
      this.#root = rootSchema;
    }
    get root() {
      return this.#root;
    }
    /** Löst lokale $ref ("#/…") auf. Externe Referenzen werden ignoriert (→ {}). */
    deref(schema, seen = /* @__PURE__ */ new Set()) {
      if (schema === true || schema === void 0) return {};
      if (schema === false) return { not: {} };
      if (!schema.$ref || typeof schema.$ref !== "string") return schema;
      if (seen.has(schema.$ref)) return {};
      seen.add(schema.$ref);
      const { $ref, ...rest } = schema;
      let target = {};
      if ($ref.startsWith("#")) {
        const found = getAt(this.#root, locationToPointer($ref));
        if (found !== void 0) target = this.deref(found, seen);
      }
      return Object.keys(rest).length ? mergeSchemas(target, rest) : target;
    }
    /** Testet einen Wert gegen ein Teilschema (mit Zugriff auf die $defs der Wurzel). */
    matches(schema, value) {
      if (schema === true || schema === void 0) return true;
      if (schema === false) return false;
      if (value === void 0) return false;
      let validator = this.#validators.get(schema);
      if (!validator) {
        const wrapped = { ...schema };
        if (this.#root.$defs && !wrapped.$defs) wrapped.$defs = this.#root.$defs;
        if (this.#root.definitions && !wrapped.definitions) wrapped.definitions = this.#root.definitions;
        validator = new Validator(wrapped, "2020-12", true);
        this.#validators.set(schema, validator);
      }
      return validator.validate(value).valid;
    }
    /**
     * Effektives Schema für einen Wert: $ref, allOf, if/then/else und
     * anyOf/oneOf werden zu einem flachen Schema zusammengeführt.
     * Zusätzlich: `x-variants` = Liste der anyOf/oneOf-Alternativen (für die
     * Typ-/Variantenauswahl in der UI) und `x-variant-index` = gewählte.
     */
    effective(schema, value, depth = 0) {
      let current = this.deref(schema);
      if (depth > 16) return current;
      const { allOf, if: ifSchema, then: thenSchema, else: elseSchema, anyOf, oneOf, ...base } = current;
      let result = { ...base };
      if (Array.isArray(allOf)) {
        for (const part of allOf) result = mergeSchemas(result, this.effective(part, value, depth + 1));
      }
      if (ifSchema !== void 0) {
        const branch = this.matches(ifSchema, value) ? thenSchema : elseSchema;
        if (branch !== void 0) result = mergeSchemas(result, this.effective(branch, value, depth + 1));
      }
      const alternatives = anyOf ?? oneOf;
      if (Array.isArray(alternatives) && alternatives.length) {
        const resolved = alternatives.map((alt) => this.deref(alt));
        const index = this.pickVariant(resolved, value);
        result = mergeSchemas(result, this.effective(resolved[index], value, depth + 1));
        result["x-variants"] = resolved;
        result["x-variant-index"] = index;
      }
      return result;
    }
    /** Wählt die anyOf/oneOf-Variante, die zum Wert passt – sonst die mit passendem Typ, sonst die erste. */
    pickVariant(variants, value) {
      const exact = variants.findIndex((variant) => this.matches(variant, value));
      if (exact !== -1) return exact;
      const typeMatches = (variant) => {
        const types = allowedTypes(this.deref(variant));
        return types.length > 0 && types.some((type) => valueMatchesType(value, type));
      };
      const isFixed = (variant) => variant.const !== void 0 || Array.isArray(variant.enum);
      const free = variants.findIndex((variant) => !isFixed(variant) && typeMatches(variant));
      if (free !== -1) return free;
      const byType = variants.findIndex(typeMatches);
      return byType !== -1 ? byType : 0;
    }
    /** Schema der Eigenschaft `key` innerhalb eines effektiven Objekt-Schemas. */
    propertySchema(effectiveParent, key) {
      if (effectiveParent.properties && Object.hasOwn(effectiveParent.properties, key)) {
        return { schema: effectiveParent.properties[key], declared: true };
      }
      for (const [pattern, schema] of Object.entries(effectiveParent.patternProperties ?? {})) {
        try {
          if (new RegExp(pattern, "u").test(key)) return { schema, declared: true };
        } catch {
        }
      }
      const extra = effectiveParent.additionalProperties ?? effectiveParent.unevaluatedProperties;
      if (extra === false) return { schema: {}, declared: false, forbidden: true };
      return { schema: extra === void 0 || extra === true ? {} : extra, declared: false };
    }
    /** Schema des Array-Elements an Position `index`. */
    itemSchema(effectiveParent, index) {
      if (Array.isArray(effectiveParent.prefixItems) && index < effectiveParent.prefixItems.length) {
        return effectiveParent.prefixItems[index];
      }
      if (Array.isArray(effectiveParent.items)) {
        return index < effectiveParent.items.length ? effectiveParent.items[index] : effectiveParent.additionalItems ?? {};
      }
      return effectiveParent.items ?? effectiveParent.unevaluatedItems ?? {};
    }
    /** Dürfen frei benannte Schlüssel ergänzt werden? */
    allowsFreeKeys(effectiveParent) {
      const extra = effectiveParent.additionalProperties ?? effectiveParent.unevaluatedProperties;
      return extra !== false;
    }
    /**
     * Vorbelegung für einen neuen Wert. Bei Objekten werden Pflichtfelder
     * ergänzt – mehrfach, weil ein gesetztes Feld (z.B. type) per if/then
     * weitere Pflichtfelder nach sich ziehen kann.
     */
    defaultFor(schema, preferredType = null, depth = 0) {
      const resolved = this.deref(schema);
      if (resolved.default !== void 0) return structuredClone(resolved.default);
      if (resolved.const !== void 0) return structuredClone(resolved.const);
      if (Array.isArray(resolved.enum) && resolved.enum.length) return structuredClone(resolved.enum[0]);
      const flat = this.effective(resolved, void 0);
      const types = allowedTypes(flat);
      const type = preferredType ?? types.find((t) => t !== "null") ?? types[0] ?? "string";
      if (flat.default !== void 0 && preferredType === null) return structuredClone(flat.default);
      switch (type) {
        case "object":
          return depth > 8 ? {} : this.#fillRequired({}, resolved, depth);
        case "array":
          return [];
        case "integer":
        case "number":
          return typeof flat.minimum === "number" ? flat.minimum : 0;
        case "boolean":
          return false;
        case "null":
          return null;
        default:
          return "";
      }
    }
    #fillRequired(object, schema, depth) {
      for (let round = 0; round < 4; round += 1) {
        const eff = this.effective(schema, object);
        let added = false;
        for (const key of eff.required ?? []) {
          if (Object.hasOwn(object, key)) continue;
          object[key] = this.defaultFor(this.propertySchema(eff, key).schema, null, depth + 1);
          added = true;
        }
        if (!added) break;
      }
      return object;
    }
    /** Konvertiert einen Wert beim Typwechsel möglichst verlustarm. */
    convert(value, targetType, schema) {
      if (valueMatchesType(value, targetType)) return value;
      const text = value === null || value === void 0 ? "" : typeof value === "object" ? "" : String(value);
      switch (targetType) {
        case "string":
          return text;
        case "integer": {
          const n = Number(text);
          return text.trim() !== "" && Number.isFinite(n) ? Math.trunc(n) : this.defaultFor(schema, "integer");
        }
        case "number": {
          const n = Number(text);
          return text.trim() !== "" && Number.isFinite(n) ? n : this.defaultFor(schema, "number");
        }
        case "boolean":
          return text === "true" || text === "1";
        case "null":
          return null;
        case "array":
          return [];
        case "object":
          return this.defaultFor(schema, "object");
        default:
          return value;
      }
    }
  };
  function mergeSchemas(a, b) {
    if (!a || typeof a !== "object") return b && typeof b === "object" ? { ...b } : {};
    if (!b || typeof b !== "object") return { ...a };
    const out = { ...a };
    for (const [key, value] of Object.entries(b)) {
      if (MERGE_UNION_OBJECTS.includes(key) && out[key] && typeof out[key] === "object") {
        const merged = { ...out[key] };
        for (const [prop, sub] of Object.entries(value)) {
          merged[prop] = Object.hasOwn(merged, prop) ? { allOf: [merged[prop], sub] } : sub;
        }
        out[key] = merged;
      } else if (key === "required" && Array.isArray(out.required)) {
        out.required = [.../* @__PURE__ */ new Set([...out.required, ...value])];
      } else if (key === "type" && out.type !== void 0) {
        const left = [].concat(out.type);
        const right = [].concat(value);
        const both = left.filter((t) => right.includes(t) || t === "integer" && right.includes("number"));
        out.type = both.length === 1 ? both[0] : both.length ? both : value;
      } else {
        out[key] = value;
      }
    }
    return out;
  }

  // packages/fucodo-json-editor-structured/messages.js
  var WRAPPER_KEYWORDS = /* @__PURE__ */ new Set([
    "items",
    "prefixItems",
    "additionalItems",
    "unevaluatedItems",
    "contains",
    "properties",
    "patternProperties",
    "propertyNames",
    "dependentSchemas",
    "allOf",
    "if",
    "then",
    "else",
    "$ref",
    "$dynamicRef",
    "not-wrapper"
  ]);
  var quoted = (text) => [...String(text).matchAll(/"([^"]*)"/g)].map((match) => match[1]);
  var limit = (text) => (String(text).match(/-?\d+(?:\.\d+)?/g) ?? [""]).at(-1);
  function translate(error) {
    const [q1, q2] = quoted(error.error);
    const n = limit(error.error);
    switch (error.keyword) {
      case "type":
        return `Falscher Typ: erwartet ${q2 ?? "?"}, ist ${q1 ?? "?"}.`;
      case "format":
        return `Ung\xFCltiges Format, erwartet wird ${q1 ?? "ein anderes Format"}.`;
      case "enum":
        return "Wert ist nicht in der Liste der erlaubten Werte.";
      case "const":
        return "Wert entspricht nicht dem vorgegebenen Wert.";
      case "minLength":
        return `Mindestens ${n} Zeichen erforderlich.`;
      case "maxLength":
        return `H\xF6chstens ${n} Zeichen erlaubt.`;
      case "pattern":
        return "Wert entspricht nicht dem geforderten Muster.";
      case "minimum":
        return `Wert muss mindestens ${n} sein.`;
      case "maximum":
        return `Wert darf h\xF6chstens ${n} sein.`;
      case "exclusiveMinimum":
        return `Wert muss gr\xF6\xDFer als ${n} sein.`;
      case "exclusiveMaximum":
        return `Wert muss kleiner als ${n} sein.`;
      case "multipleOf":
        return `Wert muss ein Vielfaches von ${n} sein.`;
      case "minItems":
        return `Mindestens ${n} Eintr\xE4ge erforderlich.`;
      case "maxItems":
        return `H\xF6chstens ${n} Eintr\xE4ge erlaubt.`;
      case "uniqueItems":
        return "Eintr\xE4ge m\xFCssen eindeutig sein.";
      case "minProperties":
        return `Mindestens ${n} Eigenschaften erforderlich.`;
      case "maxProperties":
        return `H\xF6chstens ${n} Eigenschaften erlaubt.`;
      case "anyOf":
      case "oneOf":
        return "Wert passt zu keiner der erlaubten Varianten.";
      case "not":
        return "Wert ist hier ausdr\xFCcklich nicht erlaubt.";
      case "false":
        return "Wert ist hier nicht erlaubt.";
      default:
        return error.error;
    }
  }
  function normalizeErrors(errors, isDeclared = () => false) {
    const out = [];
    const seen = /* @__PURE__ */ new Set();
    const forbidden = /* @__PURE__ */ new Set();
    const push = (entry) => {
      const id = `${entry.pointer}\0${entry.message}`;
      if (seen.has(id)) return;
      seen.add(id);
      out.push(entry);
    };
    for (const error of errors) {
      const pointer = locationToPointer(error.instanceLocation);
      if (WRAPPER_KEYWORDS.has(error.keyword)) continue;
      if (error.keyword === "required") {
        const [missing] = quoted(error.error);
        push({ pointer, keyword: "required", missing, message: `Pflichtfeld \u201E${missing}\u201C fehlt.` });
        continue;
      }
      if (error.keyword === "unevaluatedProperties" || error.keyword === "additionalProperties") {
        const [key] = quoted(error.error);
        if (key === void 0 || isDeclared(pointer, key)) continue;
        const child = joinPointer(pointer, key);
        forbidden.add(child);
        push({ pointer: child, keyword: error.keyword, message: "Eigenschaft ist an dieser Stelle nicht erlaubt." });
        continue;
      }
      if (error.keyword === "false") {
        const tokens = pointer.split("/");
        const key = tokens.pop();
        if (forbidden.has(pointer) || isDeclared(tokens.join("/"), key)) continue;
      }
      push({ pointer, keyword: error.keyword, message: translate(error) });
    }
    return out.filter((entry) => !(entry.keyword === "false" && forbidden.has(entry.pointer)));
  }

  // packages/fucodo-json-editor-structured/style.scss
  var style_default = `@charset "UTF-8";
:host {
  display: block;
  font-family: var(--json-tree-editor-font, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif);
  font-size: 0.9rem;
  --json-tree-editor-max-height: 32rem;
  --json-tree-editor-bg: #fff;
  --json-tree-editor-border: #ccc;
  --json-tree-editor-radius: 4px;
  --json-tree-editor-fg: #24292e;
  --json-tree-editor-muted: color-mix(in srgb, var(--json-tree-editor-fg) 55%, var(--json-tree-editor-bg));
  --json-tree-editor-error: #c0392b;
  --json-tree-editor-ok: #2e7d32;
  --json-tree-editor-focus-color: #86b7fe;
  --json-tree-editor-focus-shadow: rgba(13, 110, 253, 0.25);
  --json-tree-editor-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --json-tree-editor-key: #6f42c1;
  --json-tree-editor-indent: 1.15rem;
  --json-tree-editor-row-height: 2rem;
}

/* Bootstrap-Interop wie bei <json-editor class="form-control">. */
:host(.form-control) {
  font-family: var(--bs-body-font-family, var(--json-tree-editor-font));
  font-size: var(--bs-body-font-size, 1rem);
  --json-tree-editor-bg: var(--bs-body-bg, #fff);
  --json-tree-editor-border: var(--bs-border-color, #ced4da);
  --json-tree-editor-radius: var(--bs-border-radius, 0.375rem);
  --json-tree-editor-fg: var(--bs-body-color, #212529);
  --json-tree-editor-error: var(--bs-form-invalid-color, #dc3545);
  --json-tree-editor-ok: var(--bs-form-valid-color, #198754);
  --json-tree-editor-focus-shadow: var(--bs-focus-ring-color, rgba(13, 110, 253, 0.25));
  border: 0 !important;
  padding: 0 !important;
  background: none !important;
  border-radius: 0 !important;
}

.editor {
  display: flex;
  flex-direction: column;
  background-color: var(--json-tree-editor-bg);
  color: var(--json-tree-editor-fg);
  border: 1px solid var(--json-tree-editor-border);
  border-radius: var(--json-tree-editor-radius);
  overflow: hidden;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.editor:focus-within {
  border-color: var(--json-tree-editor-focus-color);
  box-shadow: 0 0 0 0.25rem var(--json-tree-editor-focus-shadow);
}

:host([invalid]) .editor {
  border-color: var(--json-tree-editor-error);
}

/* ---------------------------------------------------------------- toolbar */
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.4rem;
  border-bottom: 1px solid var(--json-tree-editor-border);
  background-color: color-mix(in srgb, var(--json-tree-editor-fg) 4%, var(--json-tree-editor-bg));
}

button {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font: inherit;
  font-size: 0.8rem;
  line-height: 1;
  padding: 0.3rem 0.55rem;
  border: 1px solid transparent;
  border-radius: calc(var(--json-tree-editor-radius) - 1px);
  background: transparent;
  color: var(--json-tree-editor-fg);
  cursor: pointer;
}

button:hover {
  background-color: color-mix(in srgb, var(--json-tree-editor-fg) 8%, transparent);
}

button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--json-tree-editor-focus-color);
  outline-offset: -2px;
}

button svg {
  width: 0.9rem;
  height: 0.9rem;
  flex: none;
}

.mode {
  display: inline-flex;
  border: 1px solid var(--json-tree-editor-border);
  border-radius: calc(var(--json-tree-editor-radius) - 1px);
  overflow: hidden;
  margin-right: 0.25rem;
}

.mode button {
  border-radius: 0;
}

.mode button[aria-pressed=true] {
  background-color: color-mix(in srgb, var(--json-tree-editor-focus-color) 30%, var(--json-tree-editor-bg));
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-left: auto;
  font-size: 0.8rem;
  white-space: nowrap;
}

.status.status-ok {
  color: var(--json-tree-editor-ok);
}

.status.status-error {
  color: var(--json-tree-editor-error);
}

.status svg {
  width: 0.9rem;
  height: 0.9rem;
}

/* ------------------------------------------------------------------- tree */
.body {
  max-height: var(--json-tree-editor-max-height);
  overflow: auto;
}

.body[hidden], .json-view[hidden], .notice[hidden] {
  display: none;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

col.c-key {
  width: 34%;
}

col.c-type {
  width: 8.5rem;
}

col.c-actions {
  width: 7.5rem;
}

thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  text-align: left;
  font-weight: 500;
  font-size: 0.75rem;
  color: var(--json-tree-editor-muted);
  padding: 0.35rem 0.5rem;
  background: var(--json-tree-editor-bg);
  border-bottom: 1px solid var(--json-tree-editor-border);
}

td {
  height: var(--json-tree-editor-row-height);
  padding: 0.15rem 0.5rem;
  border-bottom: 1px solid color-mix(in srgb, var(--json-tree-editor-border) 55%, transparent);
  vertical-align: middle;
}

tr.row:hover > td {
  background-color: color-mix(in srgb, var(--json-tree-editor-fg) 3%, transparent);
}

.key {
  padding-left: calc(var(--level, 0) * var(--json-tree-editor-indent) + 0.5rem);
  font-family: var(--json-tree-editor-mono);
  font-size: 0.8rem;
  color: var(--json-tree-editor-key);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.key .index {
  color: var(--json-tree-editor-muted);
}

.key .req {
  color: var(--json-tree-editor-error);
  margin-left: 0.1rem;
}

.key .unknown {
  font-family: inherit;
  font-size: 0.7rem;
  margin-left: 0.35rem;
  color: var(--json-tree-editor-error);
}

.toggle, .toggle-spacer {
  display: inline-flex;
  width: 1.1rem;
  height: 1.1rem;
  padding: 0;
  margin-right: 0.15rem;
  justify-content: center;
  vertical-align: middle;
}

.toggle svg {
  transition: transform 0.12s ease;
}

.toggle[aria-expanded=true] svg {
  transform: rotate(90deg);
}

.value input:not([type=checkbox]),
.value select,
.type select,
.add select,
.add input {
  width: 100%;
  box-sizing: border-box;
  height: 1.6rem;
  font: inherit;
  font-size: 0.8rem;
  padding: 0 0.4rem;
  color: var(--json-tree-editor-fg);
  background: var(--json-tree-editor-bg);
  border: 1px solid var(--json-tree-editor-border);
  border-radius: calc(var(--json-tree-editor-radius) - 1px);
}

.value input.mono {
  font-family: var(--json-tree-editor-mono);
}

.value input[type=checkbox] {
  width: 1rem;
  height: 1rem;
  margin: 0;
  accent-color: var(--json-tree-editor-focus-color);
}

.summary {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
  font-size: 0.8rem;
  color: var(--json-tree-editor-muted);
  cursor: pointer;
}

.summary .text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pill {
  flex: none;
  font-family: var(--json-tree-editor-mono);
  font-size: 0.72rem;
  padding: 0.05rem 0.4rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--json-tree-editor-fg) 8%, transparent);
  color: var(--json-tree-editor-muted);
}

.badge {
  flex: none;
  font-size: 0.72rem;
  padding: 0.05rem 0.45rem;
  border-radius: 999px;
  color: var(--json-tree-editor-error);
  background: color-mix(in srgb, var(--json-tree-editor-error) 12%, transparent);
}

.badge:empty {
  display: none;
}

.type {
  font-family: var(--json-tree-editor-mono);
  font-size: 0.72rem;
  color: var(--json-tree-editor-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.actions {
  text-align: right;
  white-space: nowrap;
}

.actions button {
  padding: 0.2rem;
}

/* Ung\xFCltige Zeilen: Markierung an Zeile, Feld und Schl\xFCssel, Meldung direkt darunter. */
tr.row.invalid > td {
  background-color: color-mix(in srgb, var(--json-tree-editor-error) 7%, transparent);
}

tr.row.invalid > td.key {
  box-shadow: inset 3px 0 0 var(--json-tree-editor-error);
}

tr.row.invalid .value input,
tr.row.invalid .value select,
tr.row.invalid .type select {
  border-color: var(--json-tree-editor-error);
}

tr.msg > td {
  height: auto;
  padding-top: 0;
  padding-bottom: 0.3rem;
  padding-left: calc(var(--level, 0) * var(--json-tree-editor-indent) + 1.8rem);
  font-size: 0.78rem;
  color: var(--json-tree-editor-error);
  background-color: color-mix(in srgb, var(--json-tree-editor-error) 7%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--json-tree-editor-border) 55%, transparent);
}

tr.msg ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

tr.add > td {
  border-bottom-style: dashed;
}

tr.add .key {
  color: inherit;
  font-family: inherit;
}

.add-inline {
  display: flex;
  gap: 0.3rem;
  align-items: center;
}

.add-inline input {
  flex: 1;
}

.add-hint {
  font-size: 0.75rem;
  color: var(--json-tree-editor-error);
}

.add-hint:empty {
  display: none;
}

.notice {
  margin: 0;
  padding: 0.6rem 0.75rem;
  font-size: 0.85rem;
  color: var(--json-tree-editor-error);
}

/* ------------------------------------------------------------------- json */
.json-view {
  padding: 0.4rem;
}

.json-view textarea {
  width: 100%;
  min-height: 16rem;
  box-sizing: border-box;
  font-family: var(--json-tree-editor-mono);
  font-size: 0.8rem;
  border: 1px solid var(--json-tree-editor-border);
  border-radius: calc(var(--json-tree-editor-radius) - 1px);
  padding: 0.5rem;
  resize: vertical;
}

/* Ohne Schema/Fallback: die Original-textarea wird wieder sichtbar. */
.fallback {
  padding: 0.4rem;
}

::slotted(textarea) {
  width: 100%;
  min-height: 12rem;
  box-sizing: border-box;
  font-family: var(--json-tree-editor-mono);
}

/* ----------------------------------------------------------------- errors */
.errors {
  margin: 0;
  padding: 0.35rem 0.5rem;
  list-style: none;
  font-size: 0.8rem;
  border-top: 1px solid var(--json-tree-editor-border);
  max-height: 8rem;
  overflow: auto;
}

.errors:empty {
  display: none;
}

.errors button {
  width: 100%;
  justify-content: flex-start;
  font-size: 0.8rem;
  padding: 0.2rem 0.3rem;
  color: var(--json-tree-editor-error);
  text-align: left;
}

.errors code {
  font-family: var(--json-tree-editor-mono);
  font-size: 0.75rem;
}

@media (prefers-reduced-motion: reduce) {
  .toggle svg, .editor {
    transition: none;
  }
}
[hidden] {
  display: none !important;
}

.visually-hidden {
  position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

tr.msg button {
  margin-top: 0.2rem;
  color: var(--json-tree-editor-error);
  border-color: color-mix(in srgb, var(--json-tree-editor-error) 40%, transparent);
}

/* Schmale Container (z.B. Seitenleiste, Mobil): Typ- und Aktionsspalte verdichten. */
.editor {
  container-type: inline-size;
}

@container (max-width: 40rem) {
  col.c-key {
    width: 36%;
  }
  col.c-type {
    width: 4.75rem;
  }
  col.c-actions {
    width: 5.5rem;
  }
  td {
    padding-left: 0.3rem;
    padding-right: 0.3rem;
  }
  .key {
    padding-left: calc(var(--level, 0) * 0.7rem + 0.3rem);
  }
  .actions button {
    padding: 0.15rem 0.05rem;
  }
  .summary .pill {
    display: none;
  }
  .toolbar button[data-action$=-all] {
    font-size: 0;
    gap: 0;
  }
}`;

  // packages/fucodo-json-editor-structured/index.js
  var svg = (d, extra = "") => `<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;
  var ICON = {
    chevron: svg('<path d="M6 3.5 10.5 8 6 12.5"/>'),
    up: svg('<path d="M8 13V3M4 7l4-4 4 4"/>'),
    down: svg('<path d="M8 3v10M4 9l4 4 4-4"/>'),
    copy: svg('<rect x="5.5" y="5.5" width="8" height="8" rx="1.5"/><path d="M10.5 5.5V3.5a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2"/>'),
    trash: svg('<path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5"/>'),
    plus: svg('<path d="M8 3v10M3 8h10"/>'),
    expand: svg('<path d="M4 6l4 4 4-4"/>'),
    collapse: svg('<path d="M4 10l4-4 4 4"/>'),
    tree: svg('<path d="M3 3h4M5 3v10h4M5 8h4"/><rect x="9.5" y="6.5" width="4" height="3" rx=".5"/><rect x="9.5" y="11.5" width="4" height="3" rx=".5"/>'),
    braces: svg('<path d="M6 2.5c-1.5 0-2 .7-2 2v1.5c0 1-.6 1.8-1.5 2 .9.2 1.5 1 1.5 2v1.5c0 1.3.5 2 2 2M10 2.5c1.5 0 2 .7 2 2v1.5c0 1 .6 1.8 1.5 2-.9.2-1.5 1-1.5 2v1.5c0 1.3-.5 2-2 2"/>')
  };
  var ICON_VALID = '<svg viewBox="0 0 8 8" aria-hidden="true" focusable="false"><path fill="currentColor" d="M2.3 6.73.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z"/></svg>';
  var ICON_INVALID = '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false" fill="none" stroke="currentColor"><circle cx="6" cy="6" r="4.5"/><path stroke-linejoin="round" d="M5.8 3.6h.4L6 6.5z"/><circle cx="6" cy="8.2" r=".6" fill="currentColor" stroke="none"/></svg>';
  var TEMPLATE = document.createElement("template");
  TEMPLATE.innerHTML = `<style>${style_default}</style>
<div class="editor">
  <div class="toolbar">
    <div class="mode" role="group" aria-label="Ansicht">
      <button type="button" data-mode="tree" aria-pressed="true">${ICON.tree}Baum</button>
      <button type="button" data-mode="json" aria-pressed="false">${ICON.braces}JSON</button>
    </div>
    <button type="button" data-action="expand-all">${ICON.expand}Alle aufklappen</button>
    <button type="button" data-action="collapse-all">${ICON.collapse}Alle zuklappen</button>
    <span class="status" role="status"><span class="status-icon"></span><span class="status-text"></span></span>
  </div>
  <p class="notice" hidden></p>
  <div class="body">
    <table>
      <colgroup><col class="c-key"><col class="c-value"><col class="c-type"><col class="c-actions"></colgroup>
      <thead><tr><th scope="col">Schl\xFCssel</th><th scope="col">Wert</th><th scope="col">Typ</th><th scope="col"><span class="visually-hidden">Aktionen</span></th></tr></thead>
      <tbody></tbody>
    </table>
  </div>
  <div class="json-view" hidden></div>
  <div class="fallback" hidden><slot></slot></div>
  <ul class="errors" aria-label="Fehler"></ul>
</div>`;
  function variantLabel(variant, index) {
    if (variant.title) return variant.title;
    if (variant.const !== void 0) return variant.const === "" ? "leer" : JSON.stringify(variant.const);
    if (Array.isArray(variant.enum)) return "Auswahl";
    const types = allowedTypes(variant).join(" | ");
    if (types && variant.format) return `${types} \xB7 ${variant.format}`;
    return types || `Variante ${index + 1}`;
  }
  var SUMMARY_KEYS = ["title", "name", "label", "type", "id", "key", "domain", "uri", "url", "path"];
  var NUMBER_PATTERN = /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?$/;
  var ROOT_LABEL = "(Wurzel)";
  var escapeHtml = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  var isContainer = (value) => value !== null && typeof value === "object";
  var cssEscape = (text) => globalThis.CSS?.escape ? CSS.escape(text) : String(text).replace(/["\\]/g, "\\$&");
  var JsonTreeEditor = class extends HTMLElement {
    static get observedAttributes() {
      return ["schema-src"];
    }
    #textarea = null;
    #form = null;
    #onFormSubmit = null;
    #schema = null;
    #resolver = null;
    #validator = null;
    #data = void 0;
    #mode = "tree";
    #expanded = /* @__PURE__ */ new Map();
    // pointer -> boolean (explizit gesetzt)
    #errors = [];
    // [{ pointer, message, keyword }]
    #customKeyFor = null;
    // Pointer des Objekts, für das gerade ein freier Schlüssel eingegeben wird
    #shape = "";
    // Strukturabdruck des zuletzt gerenderten Baums
    #composing = false;
    #validateHandle = null;
    #els = {};
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: "open" });
      shadow.appendChild(TEMPLATE.content.cloneNode(true));
      const q = (selector) => shadow.querySelector(selector);
      this.#els = {
        tbody: q("tbody"),
        body: q(".body"),
        jsonView: q(".json-view"),
        fallback: q(".fallback"),
        notice: q(".notice"),
        errors: q(".errors"),
        status: q(".status"),
        statusIcon: q(".status-icon"),
        statusText: q(".status-text"),
        toolbar: q(".toolbar")
      };
      this.#els.toolbar.addEventListener("click", this.#onToolbarClick);
      this.#els.tbody.addEventListener("click", this.#onTreeClick);
      this.#els.tbody.addEventListener("input", this.#onTreeInput);
      this.#els.tbody.addEventListener("change", this.#onTreeChange);
      this.#els.tbody.addEventListener("keydown", this.#onTreeKeydown);
      this.#els.tbody.addEventListener("compositionstart", () => {
        this.#composing = true;
      });
      this.#els.tbody.addEventListener("compositionend", () => {
        this.#composing = false;
        this.#scheduleValidation();
      });
      this.#els.errors.addEventListener("click", this.#onErrorListClick);
    }
    /* ------------------------------------------------------------ lifecycle */
    connectedCallback() {
      this.#textarea = this.querySelector(":scope > textarea");
      if (!(this.#textarea instanceof HTMLTextAreaElement)) {
        console.warn("<json-tree-editor> ben\xF6tigt ein <textarea>-Kind als Light-DOM-Inhalt.");
        return;
      }
      this.#form = this.#textarea.closest("form");
      if (this.#form && !this.#onFormSubmit) {
        this.#onFormSubmit = (event) => this.#handleFormSubmit(event);
        this.#form.addEventListener("submit", this.#onFormSubmit);
      }
      this.#loadSchema();
    }
    disconnectedCallback() {
      const form = this.#form;
      const handler = this.#onFormSubmit;
      this.#onFormSubmit = null;
      if (form && handler) {
        const cleanup = () => form.removeEventListener("submit", handler);
        if ("requestIdleCallback" in window) requestIdleCallback(cleanup);
        else setTimeout(cleanup, 0);
      }
      if (this.#validateHandle) clearTimeout(this.#validateHandle);
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "schema-src" && this.isConnected && oldValue !== newValue) this.#loadSchema();
    }
    /* ------------------------------------------------------------------ API */
    get value() {
      return this.#data === void 0 ? void 0 : structuredClone(this.#data);
    }
    set value(next) {
      this.#data = structuredClone(next);
      this.#commit({ render: true });
    }
    get schema() {
      return this.#schema;
    }
    set schema(schema) {
      this.#applySchema(schema);
    }
    get mode() {
      return this.#mode;
    }
    set mode(mode) {
      this.#switchMode(mode === "json" ? "json" : "tree");
    }
    get indent() {
      const value = Number(this.getAttribute("indent"));
      return Number.isFinite(value) && value >= 0 && this.hasAttribute("indent") ? value : 2;
    }
    get expandDepth() {
      const value = Number(this.getAttribute("expand-depth"));
      return this.hasAttribute("expand-depth") && Number.isFinite(value) ? value : 1;
    }
    validate() {
      if (!this.#validator || this.#data === void 0) return false;
      const result = this.#validator.validate(this.#data);
      this.#errors = result.valid ? [] : normalizeErrors(result.errors, (parent, key) => this.#isDeclared(parent, key));
      const valid = this.#errors.length === 0;
      this.#decorate();
      this.toggleAttribute("invalid", !valid);
      this.classList.toggle("is-valid", valid);
      this.classList.toggle("is-invalid", !valid);
      if (valid) {
        this.dispatchEvent(new CustomEvent("json-tree-editor:valid", { bubbles: true, detail: { value: this.value } }));
      } else {
        const errors = this.#errors.map(({ pointer, message }) => ({ pointer, message }));
        this.dispatchEvent(new CustomEvent("json-tree-editor:invalid", { bubbles: true, detail: { errors } }));
      }
      return valid;
    }
    expandAll() {
      this.#walk(this.#data, "", (value, pointer) => {
        if (isContainer(value)) this.#expanded.set(pointer, true);
      });
      this.#render();
    }
    collapseAll() {
      this.#walk(this.#data, "", (value, pointer) => {
        if (isContainer(value) && pointer) this.#expanded.set(pointer, false);
      });
      this.#render();
    }
    reveal(pointer) {
      if (this.#mode !== "tree") this.#switchMode("tree");
      const tokens = splitPointer(pointer);
      let current = "";
      for (const token of tokens.slice(0, -1)) {
        current = joinPointer(current, token);
        this.#expanded.set(current, true);
      }
      if (isContainer(getAt(this.#data, pointer))) this.#expanded.set(pointer, true);
      this.#render();
      const row = this.#rowFor(pointer);
      if (!row) return;
      row.scrollIntoView?.({ block: "nearest" });
      (row.querySelector(".value input, .value select, .toggle, .type select") ?? row.querySelector("button"))?.focus();
    }
    /* --------------------------------------------------------------- schema */
    async #loadSchema() {
      const src = this.getAttribute("schema-src");
      const inline = this.querySelector(':scope > script[type="application/schema+json"]');
      let schema = null;
      try {
        if (src) {
          const response = await fetch(src);
          if (!response.ok) throw new Error(`Schema konnte nicht geladen werden (${response.status}).`);
          schema = await response.json();
        } else if (inline) {
          schema = JSON.parse(inline.textContent);
        }
      } catch (error) {
        this.#fail(`Schema-Fehler: ${error.message}`);
        return;
      }
      if (schema === null) {
        if (!this.#schema) this.#fail('Kein Schema angegeben. Der Baumeditor ben\xF6tigt ein JSON Schema (schema-src oder <script type="application/schema+json">).');
        return;
      }
      this.#applySchema(schema);
    }
    #applySchema(schema) {
      try {
        this.#resolver = new SchemaResolver(schema);
        this.#validator = new Validator(schema, "2020-12", false);
        this.#schema = schema;
      } catch (error) {
        this.#fail(`Schema-Fehler: ${error.message}`);
        return;
      }
      this.#els.fallback.hidden = true;
      this.#els.notice.hidden = true;
      if (this.#data === void 0) {
        const raw = this.#textarea?.value.trim() ?? "";
        if (!raw) {
          this.#data = this.#resolver.defaultFor(schema);
        } else {
          try {
            this.#data = JSON.parse(raw);
          } catch (error) {
            this.#switchMode("json");
            this.#setStatus(`JSON-Syntaxfehler: ${error.message}`, "error");
            return;
          }
        }
      }
      this.#commit({ render: true, emit: false });
    }
    #fail(message) {
      this.#els.notice.textContent = message;
      this.#els.notice.hidden = false;
      this.#els.body.hidden = true;
      this.#els.jsonView.hidden = true;
      this.#els.fallback.hidden = false;
      this.#setStatus("", "error");
      this.toggleAttribute("invalid", true);
    }
    /** Effektives Schema am Pointer, vom Wurzelschema aus entlang der Daten aufgelöst. */
    #effectiveAt(pointer) {
      let schema = this.#schema;
      let value = this.#data;
      let eff = this.#resolver.effective(schema, value);
      for (const token of splitPointer(pointer)) {
        if (Array.isArray(value)) schema = this.#resolver.itemSchema(eff, Number(token));
        else schema = this.#resolver.propertySchema(eff, token).schema;
        value = value?.[token];
        eff = this.#resolver.effective(schema, value);
      }
      return { schema, eff, value };
    }
    #isDeclared(parentPointer, key) {
      try {
        const { eff } = this.#effectiveAt(parentPointer);
        return this.#resolver.propertySchema(eff, key).declared;
      } catch {
        return false;
      }
    }
    /* ----------------------------------------------------------- mutations */
    /** Nach jeder Änderung: textarea synchronisieren, validieren, ggf. neu rendern. */
    #commit({ render = false, emit = true } = {}) {
      if (this.#textarea && this.#data !== void 0) {
        this.#textarea.value = JSON.stringify(this.#data, null, this.indent);
      }
      if (render) this.#render();
      this.validate();
      if (emit) {
        this.dispatchEvent(new CustomEvent("json-tree-editor:change", { bubbles: true, detail: { value: this.value } }));
      }
    }
    #set(pointer, value) {
      this.#data = setAt(this.#data, pointer, value);
    }
    #scheduleValidation() {
      if (this.#validateHandle) clearTimeout(this.#validateHandle);
      this.#validateHandle = setTimeout(() => {
        this.#validateHandle = null;
        if (!this.#composing) this.validate();
      }, 250);
    }
    /**
     * Array-Umbau: explizite Auf-/Zuklapp-Zustände unterhalb des Arrays auf die
     * neuen Indizes umschreiben (mapping: alter Index -> neuer Index | null).
     */
    #remapExpanded(arrayPointer, mapping) {
      const prefix = `${arrayPointer}/`;
      const next = /* @__PURE__ */ new Map();
      for (const [pointer, state] of this.#expanded) {
        if (!pointer.startsWith(prefix)) {
          next.set(pointer, state);
          continue;
        }
        const [index, ...rest] = pointer.slice(prefix.length).split("/");
        const target = mapping(Number(index));
        if (target === null || target === void 0) continue;
        next.set([`${prefix}${target}`, ...rest].join("/"), state);
      }
      this.#expanded = next;
    }
    #parentOf(pointer) {
      const tokens = splitPointer(pointer);
      const key = tokens.pop();
      const parent = tokens.reduce((acc, token) => joinPointer(acc, token), "");
      return { parent, key };
    }
    #action(action, pointer) {
      switch (action) {
        case "toggle": {
          const { value } = this.#effectiveAt(pointer);
          this.#expanded.set(pointer, !this.#isExpanded(pointer, value));
          this.#render({ focus: { pointer, role: "toggle" } });
          return;
        }
        case "add-item": {
          const { eff, value } = this.#effectiveAt(pointer);
          const index = value.length;
          value.push(this.#resolver.defaultFor(this.#resolver.itemSchema(eff, index)));
          const child = joinPointer(pointer, index);
          this.#expanded.set(child, true);
          this.#commit({ render: true });
          this.#focusRow(child);
          return;
        }
        case "remove": {
          const { parent, key } = this.#parentOf(pointer);
          const container = getAt(this.#data, parent);
          if (Array.isArray(container)) {
            const removed = Number(key);
            container.splice(removed, 1);
            this.#remapExpanded(parent, (i) => i === removed ? null : i > removed ? i - 1 : i);
            this.#commit({ render: true });
            this.#focusRow(container.length ? joinPointer(parent, Math.min(removed, container.length - 1)) : parent);
          } else {
            delete container[key];
            this.#expanded.delete(pointer);
            this.#commit({ render: true });
            this.#focusRow(parent);
          }
          return;
        }
        case "up":
        case "down": {
          const { parent, key } = this.#parentOf(pointer);
          const list = getAt(this.#data, parent);
          const from = Number(key);
          const to = action === "up" ? from - 1 : from + 1;
          if (to < 0 || to >= list.length) return;
          [list[from], list[to]] = [list[to], list[from]];
          this.#remapExpanded(parent, (i) => i === from ? to : i === to ? from : i);
          this.#commit({ render: true });
          this.#render({ focus: { pointer: joinPointer(parent, to), role: action } });
          return;
        }
        case "duplicate": {
          const { parent, key } = this.#parentOf(pointer);
          const list = getAt(this.#data, parent);
          const at = Number(key);
          list.splice(at + 1, 0, structuredClone(list[at]));
          this.#remapExpanded(parent, (i) => i > at ? i + 1 : i);
          this.#commit({ render: true });
          this.#focusRow(joinPointer(parent, at + 1));
          return;
        }
        case "fill-required": {
          const { schema, value } = this.#effectiveAt(pointer);
          for (let round = 0; round < 4; round += 1) {
            const eff = this.#resolver.effective(schema, value);
            const missing = (eff.required ?? []).filter((key) => !Object.hasOwn(value, key));
            if (!missing.length) break;
            for (const key of missing) value[key] = this.#resolver.defaultFor(this.#resolver.propertySchema(eff, key).schema);
          }
          this.#expanded.set(pointer, true);
          this.#commit({ render: true });
          this.#focusRow(pointer);
          return;
        }
        case "add-custom": {
          this.#addCustomKey(pointer);
          return;
        }
        case "cancel-custom": {
          this.#customKeyFor = null;
          this.#render({ focus: { pointer, role: "add-prop" } });
          return;
        }
        default:
      }
    }
    #addProperty(objectPointer, key) {
      const { eff, value } = this.#effectiveAt(objectPointer);
      if (Object.hasOwn(value, key)) return false;
      value[key] = this.#resolver.defaultFor(this.#resolver.propertySchema(eff, key).schema);
      const child = joinPointer(objectPointer, key);
      this.#expanded.set(child, true);
      this.#commit({ render: true });
      this.#focusRow(child);
      return true;
    }
    #addCustomKey(objectPointer) {
      const row = this.#els.tbody.querySelector(`tr.add[data-pointer="${cssEscape(objectPointer)}"]`);
      const input = row?.querySelector('input[data-role="custom-key"]');
      const hint = row?.querySelector(".add-hint");
      const key = input?.value.trim() ?? "";
      const object = getAt(this.#data, objectPointer);
      if (!key) {
        hint.textContent = "Schl\xFCssel eingeben.";
        input.focus();
        return;
      }
      if (Object.hasOwn(object, key)) {
        hint.textContent = `\u201E${key}\u201C gibt es schon.`;
        input.focus();
        return;
      }
      this.#customKeyFor = null;
      this.#addProperty(objectPointer, key);
    }
    #changeType(pointer, choice) {
      const { schema, eff, value } = this.#effectiveAt(pointer);
      let next;
      if (choice.startsWith("variant:")) {
        const variant = eff["x-variants"][Number(choice.slice(8))];
        const types = allowedTypes(this.#resolver.effective(variant, void 0));
        next = this.#resolver.matches(variant, value) ? value : types.length && typeOfValue(value) !== "object" && typeOfValue(value) !== "array" ? this.#resolver.convert(value, types[0], variant) : this.#resolver.defaultFor(variant);
        if (!this.#resolver.matches(variant, next)) next = this.#resolver.defaultFor(variant);
      } else {
        next = this.#resolver.convert(value, choice, schema);
      }
      this.#set(pointer, next);
      if (isContainer(next)) this.#expanded.set(pointer, true);
      this.#commit({ render: true });
      this.#render({ focus: { pointer, role: "type" } });
    }
    /* --------------------------------------------------------------- events */
    #onToolbarClick = (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      if (button.dataset.mode) this.#switchMode(button.dataset.mode);
      else if (button.dataset.action === "expand-all") this.expandAll();
      else if (button.dataset.action === "collapse-all") this.collapseAll();
    };
    #onTreeClick = (event) => {
      const button = event.target.closest("button[data-action]");
      if (button) {
        this.#action(button.dataset.action, button.closest("tr").dataset.pointer);
        return;
      }
      const summary = event.target.closest(".summary");
      if (summary) this.#action("toggle", summary.closest("tr").dataset.pointer);
    };
    /** Tippen: Wert sofort übernehmen, Validierung entprellt, kein Neu-Rendern (Caret bleibt stabil). */
    #onTreeInput = (event) => {
      const control = event.target;
      const role = control.dataset.role;
      if (role === "custom-key") {
        const hint = control.closest("tr").querySelector(".add-hint");
        if (hint) hint.textContent = "";
        return;
      }
      if (role !== "string" && role !== "number") return;
      const pointer = control.closest("tr").dataset.pointer;
      this.#set(pointer, role === "number" ? this.#parseNumber(control.value) : control.value);
      if (this.#textarea) this.#textarea.value = JSON.stringify(this.#data, null, this.indent);
      this.#scheduleValidation();
    };
    /**
     * Abgeschlossene Änderung: Auswahllisten, Checkboxen, und Textfelder beim
     * Verlassen. Danach wird neu gerendert, weil sich über if/then die
     * angebotenen Felder ändern können.
     */
    #onTreeChange = (event) => {
      const control = event.target;
      const row = control.closest("tr");
      const pointer = row?.dataset.pointer;
      if (pointer === void 0) return;
      switch (control.dataset.role) {
        case "string":
        case "number":
          this.#commit({ render: this.#computeShape() !== this.#shape });
          return;
        case "boolean":
          this.#set(pointer, control.checked);
          this.#commit({ render: true });
          this.#render({ focus: { pointer, role: "boolean" } });
          return;
        case "enum": {
          const option = control.selectedOptions[0];
          if (option?.dataset.current === "1") return;
          const { eff } = this.#effectiveAt(pointer);
          const choices = eff.const !== void 0 ? [eff.const] : eff.enum;
          this.#set(pointer, structuredClone(choices[Number(control.value)]));
          this.#commit({ render: true });
          this.#render({ focus: { pointer, role: "enum" } });
          return;
        }
        case "type":
          this.#changeType(pointer, control.value);
          return;
        case "add-prop": {
          const key = control.value;
          control.value = "";
          if (key === "\0custom") {
            this.#customKeyFor = pointer;
            this.#render({ focus: { pointer, role: "custom-key" } });
          } else if (key) {
            this.#addProperty(pointer, key);
          }
          return;
        }
        default:
      }
    };
    #onTreeKeydown = (event) => {
      const control = event.target;
      if (control.dataset.role === "custom-key") {
        if (event.key === "Enter") {
          event.preventDefault();
          this.#addCustomKey(control.closest("tr").dataset.pointer);
        } else if (event.key === "Escape") {
          this.#action("cancel-custom", control.closest("tr").dataset.pointer);
        }
        return;
      }
      if (event.key === "Enter" && (control.dataset.role === "string" || control.dataset.role === "number")) {
        event.preventDefault();
        control.dispatchEvent(new Event("change", { bubbles: true }));
      }
    };
    #onErrorListClick = (event) => {
      const button = event.target.closest("button[data-pointer]");
      if (button) this.reveal(button.dataset.pointer);
    };
    #parseNumber(text) {
      const trimmed = text.trim().replace(",", ".");
      if (!NUMBER_PATTERN.test(trimmed)) return text;
      const n = Number(trimmed);
      if (!Number.isFinite(n)) return text;
      return n;
    }
    #handleFormSubmit(event) {
      if (event.target !== this.#form) return;
      if (!this.#resolver) return;
      if (this.#mode === "json" && !this.#pullFromJsonView()) {
        event.preventDefault();
        return;
      }
      const valid = this.validate();
      if (!valid && !this.hasAttribute("allow-invalid")) {
        event.preventDefault();
        if (this.#errors[0]) this.reveal(this.#errors[0].pointer);
        return;
      }
      if (this.#textarea && this.#data !== void 0) this.#textarea.value = JSON.stringify(this.#data);
    }
    /* ------------------------------------------------------------ JSON-Modus */
    #switchMode(mode) {
      if (mode === this.#mode && (mode === "tree" ? !this.#els.body.hidden : !this.#els.jsonView.hidden)) return;
      if (mode === "tree") {
        if (this.#els.jsonView.childElementCount && !this.#pullFromJsonView()) return;
        this.#els.jsonView.replaceChildren();
      } else {
        this.#mountJsonView();
      }
      this.#mode = mode;
      this.#els.body.hidden = mode !== "tree";
      this.#els.jsonView.hidden = mode !== "json";
      for (const button of this.#els.toolbar.querySelectorAll('[data-action$="-all"]')) button.hidden = mode !== "tree";
      for (const button of this.#els.toolbar.querySelectorAll("[data-mode]")) {
        button.setAttribute("aria-pressed", String(button.dataset.mode === mode));
      }
      if (mode === "tree" && this.#resolver) this.#commit({ render: true });
    }
    #mountJsonView() {
      const text = this.#data === void 0 ? this.#textarea?.value ?? "" : JSON.stringify(this.#data, null, this.indent);
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("aria-label", "JSON");
      textarea.spellcheck = false;
      if (customElements.get("json-editor")) {
        const editor = document.createElement("json-editor");
        editor.setAttribute("indent", String(this.indent));
        editor.append(textarea);
        if (this.#schema) {
          const script = document.createElement("script");
          script.type = "application/schema+json";
          script.textContent = JSON.stringify(this.#schema);
          editor.append(script);
        }
        this.#els.jsonView.replaceChildren(editor);
      } else {
        this.#els.jsonView.replaceChildren(textarea);
      }
    }
    /** Übernimmt den Inhalt der JSON-Ansicht. false bei Syntaxfehler. */
    #pullFromJsonView() {
      const textarea = this.#els.jsonView.querySelector("textarea");
      if (!textarea) return true;
      const raw = textarea.value.trim();
      try {
        this.#data = raw ? JSON.parse(raw) : this.#resolver?.defaultFor(this.#schema);
        return true;
      } catch (error) {
        this.#setStatus(`JSON-Syntaxfehler: ${error.message}`, "error");
        textarea.focus();
        return false;
      }
    }
    /* ------------------------------------------------------------- Rendering */
    #isExpanded(pointer, value) {
      if (this.#expanded.has(pointer)) return this.#expanded.get(pointer);
      return splitPointer(pointer).length <= this.expandDepth;
    }
    #walk(value, pointer, visit) {
      visit(value, pointer);
      if (!isContainer(value)) return;
      for (const [key, child] of Object.entries(value)) this.#walk(child, joinPointer(pointer, key), visit);
    }
    /**
     * Strukturabdruck: welche Container es gibt, welche Felder ihr effektives
     * Schema anbietet/verlangt und welche Variante gewählt ist. Ändert sich
     * das durch eine Eingabe, muss neu gerendert werden.
     */
    #computeShape() {
      if (!this.#resolver || this.#data === void 0) return "";
      const parts = [];
      const visit = (value, schema, pointer) => {
        const eff = this.#resolver.effective(schema, value);
        parts.push(`${pointer}|${typeOfValue(value)}|${eff["x-variant-index"] ?? ""}`);
        if (!isContainer(value)) return;
        if (Array.isArray(value)) {
          value.forEach((item, i) => visit(item, this.#resolver.itemSchema(eff, i), joinPointer(pointer, i)));
          return;
        }
        parts.push(`${Object.keys(eff.properties ?? {}).join(",")}|${(eff.required ?? []).join(",")}|${this.#resolver.allowsFreeKeys(eff)}`);
        for (const [key, child] of Object.entries(value)) {
          const prop = this.#resolver.propertySchema(eff, key);
          parts.push(`${key}:${prop.declared}`);
          visit(child, prop.schema, joinPointer(pointer, key));
        }
      };
      visit(this.#data, this.#schema, "");
      return parts.join("\n");
    }
    #rowFor(pointer) {
      return this.#els.tbody.querySelector(`tr.row[data-pointer="${cssEscape(pointer)}"]`);
    }
    #focusRow(pointer) {
      const row = this.#rowFor(pointer);
      if (!row) return;
      row.scrollIntoView?.({ block: "nearest" });
      (row.querySelector(".value input, .value select, .toggle") ?? row.querySelector("button"))?.focus();
    }
    /**
     * Rendert den kompletten Baum neu. Fokus und Caret werden über
     * (pointer, role) wiederhergestellt – entweder aus dem aktuell fokussierten
     * Element oder explizit übergeben.
     */
    #render({ focus = null } = {}) {
      if (!this.#resolver || this.#data === void 0 || this.#mode !== "tree") return;
      const active = this.shadowRoot.activeElement;
      let restore = focus;
      if (!restore && active && this.#els.tbody.contains(active)) {
        restore = {
          pointer: active.closest("tr")?.dataset.pointer,
          role: active.dataset.role ?? active.dataset.action,
          start: active.selectionStart,
          end: active.selectionEnd
        };
      }
      const rows = [];
      const rootEff = this.#resolver.effective(this.#schema, this.#data);
      if (isContainer(this.#data)) {
        this.#renderChildren(rows, this.#data, rootEff, "", 0);
      } else {
        this.#renderNode(rows, { value: this.#data, schema: this.#schema, pointer: "", label: ROOT_LABEL, level: 0 });
      }
      this.#els.tbody.innerHTML = rows.join("");
      this.#shape = this.#computeShape();
      this.#decorate();
      if (restore?.pointer !== void 0) {
        const row = this.#els.tbody.querySelector(`tr[data-pointer="${cssEscape(restore.pointer)}"]${restore.role === "custom-key" || restore.role === "add-prop" ? ".add" : ".row"}`);
        const target = row?.querySelector(`[data-role="${restore.role}"], [data-action="${restore.role}"]`) ?? row?.querySelector("input, select, button");
        if (target) {
          target.focus();
          if (typeof restore.start === "number" && "setSelectionRange" in target) {
            try {
              target.setSelectionRange(restore.start, restore.end);
            } catch {
            }
          }
        }
      }
    }
    #renderChildren(rows, value, eff, pointer, level) {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          this.#renderNode(rows, {
            value: item,
            schema: this.#resolver.itemSchema(eff, index),
            pointer: joinPointer(pointer, index),
            label: String(index),
            isIndex: true,
            level,
            index,
            count: value.length
          });
        });
        rows.push(`<tr class="add" data-pointer="${escapeHtml(pointer)}" style="--level:${level}">
        <td class="key" colspan="4"><button type="button" data-action="add-item">${ICON.plus}Eintrag hinzuf\xFCgen</button></td>
      </tr>`);
        return;
      }
      const required = new Set(eff.required ?? []);
      for (const [key, child] of Object.entries(value)) {
        const prop = this.#resolver.propertySchema(eff, key);
        this.#renderNode(rows, {
          value: child,
          schema: prop.schema,
          pointer: joinPointer(pointer, key),
          label: key,
          level,
          required: required.has(key),
          undeclared: !prop.declared,
          forbidden: prop.forbidden
        });
      }
      rows.push(this.#renderAddProperty(value, eff, pointer, level, required));
    }
    #renderAddProperty(value, eff, pointer, level, required) {
      const missing = Object.keys(eff.properties ?? {}).filter((key) => !Object.hasOwn(value, key));
      const free = this.#resolver.allowsFreeKeys(eff);
      if (!missing.length && !free) return "";
      if (this.#customKeyFor === pointer) {
        return `<tr class="add" data-pointer="${escapeHtml(pointer)}" style="--level:${level}">
        <td class="key" colspan="4"><div class="add-inline">
          <input type="text" data-role="custom-key" placeholder="neuer_schluessel" aria-label="Neuer Schl\xFCssel">
          <button type="button" data-action="add-custom">${ICON.plus}Hinzuf\xFCgen</button>
          <button type="button" data-action="cancel-custom">Abbrechen</button>
          <span class="add-hint" role="alert"></span>
        </div></td>
      </tr>`;
      }
      missing.sort((a, b) => Number(required.has(b)) - Number(required.has(a)));
      const options = missing.map((key) => {
        const title = this.#resolver.deref(eff.properties[key])?.title;
        const label = `${key}${required.has(key) ? " *" : ""}${title ? ` \u2013 ${title}` : ""}`;
        return `<option value="${escapeHtml(key)}">${escapeHtml(label)}</option>`;
      }).join("");
      return `<tr class="add" data-pointer="${escapeHtml(pointer)}" style="--level:${level}">
      <td class="key" colspan="2"><select data-role="add-prop" aria-label="Eigenschaft hinzuf\xFCgen">
        <option value="">+ Eigenschaft hinzuf\xFCgen \u2026</option>${options}
        ${free ? '<option value="\0custom">Eigener Schl\xFCssel \u2026</option>' : ""}
      </select></td><td></td><td></td>
    </tr>`;
    }
    #renderNode(rows, node) {
      const { value, schema, pointer, label, level } = node;
      const eff = this.#resolver.effective(schema, value);
      const container = isContainer(value);
      const expanded = container && this.#isExpanded(pointer, value);
      const description = eff.description ?? eff.title ?? "";
      const toggle = container ? `<button type="button" class="toggle" data-action="toggle" aria-expanded="${expanded}" aria-label="${expanded ? "Zuklappen" : "Aufklappen"}: ${escapeHtml(label)}">${ICON.chevron}</button>` : '<span class="toggle-spacer"></span>';
      const keyLabel = node.isIndex ? `<span class="index">${escapeHtml(label)}</span>` : escapeHtml(label);
      const flags = `${node.required ? '<span class="req" title="Pflichtfeld">*</span>' : ""}${node.undeclared ? `<span class="unknown">${node.forbidden ? "nicht erlaubt" : "nicht im Schema"}</span>` : ""}`;
      rows.push(`<tr class="row" data-pointer="${escapeHtml(pointer)}" style="--level:${level}" aria-level="${level + 1}">
      <td class="key" title="${escapeHtml(description || label)}">${toggle}${keyLabel}${flags}</td>
      <td class="value">${this.#renderValue(value, eff, container, label)}</td>
      <td class="type">${this.#renderType(value, eff, label)}</td>
      <td class="actions">${this.#renderActions(node)}</td>
    </tr>`);
      if (container && expanded) this.#renderChildren(rows, value, eff, pointer, level + 1);
    }
    #renderValue(value, eff, container, label) {
      const name = escapeHtml(label);
      if (container) {
        const size = Array.isArray(value) ? value.length : Object.keys(value).length;
        const count = Array.isArray(value) ? `${size} ${size === 1 ? "Eintrag" : "Eintr\xE4ge"}` : `${size} ${size === 1 ? "Feld" : "Felder"}`;
        return `<div class="summary"><span class="pill">${count}</span><span class="text">${escapeHtml(this.#summarize(value, eff))}</span><span class="badge" aria-live="polite"></span></div>`;
      }
      const variants = eff["x-variants"];
      const freeVariant = Array.isArray(variants) && variants.some((v) => v.const === void 0 && !Array.isArray(v.enum));
      const choices = freeVariant ? null : eff.const !== void 0 ? [eff.const] : Array.isArray(eff.enum) ? eff.enum : null;
      if (choices) {
        const currentIndex = choices.findIndex((choice) => JSON.stringify(choice) === JSON.stringify(value));
        const options = choices.map((choice, i) => `<option value="${i}"${i === currentIndex ? " selected" : ""}>${escapeHtml(typeof choice === "string" ? choice : JSON.stringify(choice))}</option>`).join("");
        const invalid = currentIndex === -1 ? `<option data-current="1" selected>${escapeHtml(JSON.stringify(value))} (ung\xFCltig)</option>` : "";
        return `<select data-role="enum" aria-label="${name}">${invalid}${options}</select>`;
      }
      const kind = this.#primitiveKind(value, eff);
      if (kind === "null") return '<span class="pill">null</span>';
      if (kind === "boolean") {
        return `<input type="checkbox" data-role="boolean" aria-label="${name}"${value === true ? " checked" : ""}>`;
      }
      const placeholder = eff.examples?.[0] ?? eff.default;
      const ph = placeholder !== void 0 && typeof placeholder !== "object" ? ` placeholder="${escapeHtml(placeholder)}"` : "";
      if (kind === "number" || kind === "integer") {
        return `<input type="text" inputmode="decimal" class="mono" data-role="number" data-integer="${kind === "integer" ? 1 : 0}" aria-label="${name}" value="${escapeHtml(value ?? "")}"${ph}>`;
      }
      const inputType = { uri: "url", email: "email" }[eff.format] ?? "text";
      const mono = eff.format || eff.pattern ? ' class="mono"' : "";
      return `<input type="${inputType}" data-role="string"${mono} aria-label="${name}" value="${escapeHtml(value ?? "")}"${ph} spellcheck="false">`;
    }
    /** Welches Eingabeelement bekommt ein primitiver Wert? Vorrang hat der Schema-Typ, damit ungültige Zwischenstände (String im Zahlenfeld) editierbar bleiben. */
    #primitiveKind(value, eff) {
      const types = allowedTypes(eff).filter((type) => type !== "object" && type !== "array");
      const actual = typeOfValue(value);
      if (value === null && (types.includes("null") || !types.length)) return "null";
      if (types.some((type) => valueMatchesType(value, type))) return actual === "integer" && types.includes("number") ? "number" : actual;
      const preferred = types.find((type) => type !== "null");
      if (preferred) return preferred;
      return actual === "integer" ? "number" : actual;
    }
    #renderType(value, eff, label) {
      const actual = typeOfValue(value);
      const variants = eff["x-variants"];
      if (Array.isArray(variants) && variants.length > 1) {
        const options2 = variants.map((variant, i) => {
          const text = variantLabel(variant, i);
          return `<option value="variant:${i}"${i === eff["x-variant-index"] ? " selected" : ""}>${escapeHtml(text)}</option>`;
        }).join("");
        return `<select data-role="type" aria-label="Variante von ${escapeHtml(label)}">${options2}</select>`;
      }
      let types = allowedTypes(eff);
      const any = types.length === 0;
      if (any) types = ["string", "number", "boolean", "object", "array", "null"];
      const matching = types.find((type) => valueMatchesType(value, type));
      const primitiveMismatch = !matching && !isContainer(value) && !["object", "array"].includes(types[0]);
      if (types.length === 1 && (matching || primitiveMismatch)) {
        return escapeHtml(eff.format ? `${types[0]} \xB7 ${eff.format}` : eff.enum ? "enum" : types[0]);
      }
      const options = types.map((type) => `<option value="${type}"${type === matching ? " selected" : ""}>${type}</option>`).join("");
      const current = matching ? "" : `<option selected disabled>${actual} (ung\xFCltig)</option>`;
      return `<select data-role="type" aria-label="Typ von ${escapeHtml(label)}">${current}${options}</select>`;
    }
    #renderActions(node) {
      const buttons = [];
      if (node.isIndex) {
        if (node.index > 0) buttons.push(`<button type="button" data-action="up" title="Nach oben" aria-label="Eintrag ${node.index} nach oben">${ICON.up}</button>`);
        if (node.index < node.count - 1) buttons.push(`<button type="button" data-action="down" title="Nach unten" aria-label="Eintrag ${node.index} nach unten">${ICON.down}</button>`);
        buttons.push(`<button type="button" data-action="duplicate" title="Duplizieren" aria-label="Eintrag ${node.index} duplizieren">${ICON.copy}</button>`);
        buttons.push(`<button type="button" data-action="remove" title="Entfernen" aria-label="Eintrag ${node.index} entfernen">${ICON.trash}</button>`);
      } else if (node.pointer !== "" && !node.required) {
        buttons.push(`<button type="button" data-action="remove" title="Entfernen" aria-label="${escapeHtml(node.label)} entfernen">${ICON.trash}</button>`);
      }
      return buttons.join("");
    }
    /**
     * Kurzbeschreibung eines Containers. Das Schema kann die Felder per
     * "x-summary": ["type", "domain"] vorgeben; sonst werden typische
     * Namensfelder bevorzugt und mit den ersten weiteren Textwerten auf zwei
     * Angaben aufgefüllt.
     */
    #summarize(value, eff = {}) {
      if (Array.isArray(value)) {
        return value.filter((item) => typeof item === "string" && item.trim()).slice(0, 3).join(", ");
      }
      const texts = [];
      const add = (child) => {
        if (texts.length >= 2) return;
        if (typeof child === "string" && child.trim()) texts.push(child.trim());
        else if (typeof child === "number") texts.push(String(child));
      };
      if (Array.isArray(eff["x-summary"])) {
        for (const key of eff["x-summary"]) add(value[key]);
        return texts.join(", ");
      }
      const preferred = SUMMARY_KEYS.filter((key) => Object.hasOwn(value, key));
      for (const key of preferred) add(value[key]);
      for (const [key, child] of Object.entries(value)) {
        if (!preferred.includes(key) && typeof child === "string") add(child);
      }
      return texts.join(", ");
    }
    /**
     * Fehler an die gerenderten Zeilen hängen, ohne neu zu rendern:
     * Zeilenmarkierung, Meldungszeile darunter, Fehlerzähler an zugeklappten
     * Containern, Status und Fehlerliste.
     */
    #decorate() {
      const byPointer = /* @__PURE__ */ new Map();
      const nested = /* @__PURE__ */ new Map();
      for (const error of this.#errors) {
        if (!byPointer.has(error.pointer)) byPointer.set(error.pointer, []);
        byPointer.get(error.pointer).push(error.message);
        const tokens = splitPointer(error.pointer);
        let ancestor = "";
        for (const token of tokens.slice(0, -1)) {
          ancestor = joinPointer(ancestor, token);
          nested.set(ancestor, (nested.get(ancestor) ?? 0) + 1);
        }
        if (tokens.length) nested.set("", (nested.get("") ?? 0) + 1);
      }
      const tbody = this.#els.tbody;
      for (const old of tbody.querySelectorAll("tr.msg")) old.remove();
      const shown = /* @__PURE__ */ new Set();
      for (const row of tbody.querySelectorAll("tr.row")) {
        const pointer = row.dataset.pointer;
        const messages = byPointer.get(pointer);
        row.classList.toggle("invalid", Boolean(messages));
        for (const control of row.querySelectorAll(".value input, .value select")) {
          if (messages) control.setAttribute("aria-invalid", "true");
          else control.removeAttribute("aria-invalid");
        }
        const summaryText = row.querySelector(".summary .text");
        if (summaryText) {
          const { eff, value } = this.#effectiveAt(pointer);
          summaryText.textContent = this.#summarize(value ?? {}, eff);
        }
        const badge = row.querySelector(".badge");
        if (badge) {
          const collapsed = row.querySelector(".toggle")?.getAttribute("aria-expanded") === "false";
          const count2 = collapsed ? nested.get(pointer) ?? 0 : 0;
          badge.textContent = count2 ? `${count2} Fehler` : "";
        }
        if (messages) {
          shown.add(pointer);
          const msg = document.createElement("tr");
          msg.className = "msg";
          msg.dataset.pointer = pointer;
          msg.style.setProperty("--level", row.style.getPropertyValue("--level"));
          const id = `msg-${Math.random().toString(36).slice(2, 9)}`;
          const fill = this.#errors.some((e) => e.pointer === pointer && e.keyword === "required") ? `<button type="button" data-action="fill-required">${ICON.plus}Fehlende Pflichtfelder erg\xE4nzen</button>` : "";
          msg.innerHTML = `<td colspan="4" id="${id}"><ul>${messages.map((m) => `<li>${escapeHtml(m)}</li>`).join("")}</ul>${fill}</td>`;
          row.after(msg);
          for (const control of row.querySelectorAll(".value input, .value select")) control.setAttribute("aria-describedby", id);
        }
      }
      this.#els.errors.replaceChildren(...this.#errors.map((error) => {
        const li = document.createElement("li");
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.pointer = error.pointer;
        const code = document.createElement("code");
        code.textContent = error.pointer || "/";
        button.append(code, ` ${error.message}`);
        li.append(button);
        return li;
      }));
      const count = this.#errors.length;
      if (count) this.#setStatus(`${count} Fehler`, "error");
      else this.#setStatus("", "valid");
    }
    #setStatus(text, state = null) {
      const { status, statusIcon, statusText } = this.#els;
      statusIcon.innerHTML = state === "valid" ? ICON_VALID : state === "error" ? ICON_INVALID : "";
      statusText.textContent = text || (state === "valid" ? "G\xFCltig" : "");
      status.classList.toggle("status-ok", state === "valid");
      status.classList.toggle("status-error", state === "error");
    }
  };
  if (!customElements.get("json-tree-editor")) {
    customElements.define("json-tree-editor", JsonTreeEditor);
  }
})();

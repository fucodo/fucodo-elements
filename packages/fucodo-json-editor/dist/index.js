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

  // packages/fucodo-json-editor/highlight-json.js
  var TOKEN_PATTERN = /"(?:\\.|[^"\\])*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\btrue\b|\bfalse\b|\bnull\b|[{}[\],:]/g;
  var ESCAPE_MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;" };
  function escapeHtml(value) {
    return value.replace(/[&<>]/g, (char) => ESCAPE_MAP[char]);
  }
  function classify(token, textAfterToken) {
    if (token.charCodeAt(0) === 34) {
      return /^\s*:/.test(textAfterToken) ? "tok-key" : "tok-string";
    }
    if (token === "true" || token === "false") return "tok-boolean";
    if (token === "null") return "tok-null";
    if (token === "{" || token === "}" || token === "[" || token === "]" || token === ":" || token === ",") {
      return "tok-punct";
    }
    return "tok-number";
  }
  function highlightJson(text) {
    TOKEN_PATTERN.lastIndex = 0;
    let result = "";
    let lastIndex = 0;
    let match;
    while ((match = TOKEN_PATTERN.exec(text)) !== null) {
      if (match.index > lastIndex) {
        result += escapeHtml(text.slice(lastIndex, match.index));
      }
      const token = match[0];
      const cls = classify(token, text.slice(TOKEN_PATTERN.lastIndex));
      result += `<span class="${cls}">${escapeHtml(token)}</span>`;
      lastIndex = TOKEN_PATTERN.lastIndex;
    }
    result += escapeHtml(text.slice(lastIndex));
    return result;
  }

  // packages/fucodo-json-editor/pretty-print.js
  function prettyPrintJson(value, indent = 2) {
    const pad = " ".repeat(Math.max(0, indent));
    return stringify(value, 0);
    function stringify(val, depth) {
      if (Array.isArray(val)) return stringifyArray(val, depth);
      if (val !== null && typeof val === "object") return stringifyObject(val, depth);
      return JSON.stringify(val);
    }
    function stringifyArray(arr, depth) {
      if (arr.length === 0) return "[]";
      if (isPrimitiveArray(arr)) {
        return `[${arr.map((item) => JSON.stringify(item)).join(", ")}]`;
      }
      const inner = pad.repeat(depth + 1);
      const closing = pad.repeat(depth);
      const items = arr.map((item) => inner + stringify(item, depth + 1));
      return `[
${items.join(",\n")}
${closing}]`;
    }
    function stringifyObject(obj, depth) {
      const keys = Object.keys(obj);
      if (keys.length === 0) return "{}";
      const inner = pad.repeat(depth + 1);
      const closing = pad.repeat(depth);
      const items = keys.map((key) => `${inner}${JSON.stringify(key)}: ${stringify(obj[key], depth + 1)}`);
      return `{
${items.join(",\n")}
${closing}}`;
    }
    function isPrimitiveArray(arr) {
      return arr.every((item) => item === null || typeof item !== "object");
    }
  }

  // packages/fucodo-json-editor/style.scss
  var style_default = `@charset "UTF-8";
:host {
  display: block;
  font-family: var(--json-editor-font, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 0.9rem;
  --json-editor-height: 16rem;
  --json-editor-bg: #fff;
  --json-editor-border: #ccc;
  --json-editor-radius: 4px;
  --json-editor-fg: #24292e;
  --json-editor-error: #c0392b;
  --json-editor-ok: #2e7d32;
  --json-editor-focus-color: #86b7fe;
  --json-editor-focus-shadow: rgba(13, 110, 253, 0.25);
  --json-editor-padding-x: 0.6rem;
  --json-editor-padding-y: 0.5rem;
  --json-editor-line-height: 1.4;
  --json-editor-key: #6f42c1;
  --json-editor-string: #22863a;
  --json-editor-number: #005cc5;
  --json-editor-keyword: #d73a49;
  --json-editor-punct: #24292e;
}

/* Bootstrap-Interop, siehe Kommentar oben am Modul. */
:host(.form-control) {
  font-family: var(--bs-body-font-family, var(--json-editor-font));
  font-size: var(--bs-body-font-size, 1rem);
  --json-editor-bg: var(--bs-body-bg, #fff);
  --json-editor-border: var(--bs-border-color, #ced4da);
  --json-editor-radius: var(--bs-border-radius, 0.375rem);
  --json-editor-fg: var(--bs-body-color, #212529);
  --json-editor-error: var(--bs-form-invalid-color, #dc3545);
  --json-editor-ok: var(--bs-form-valid-color, #198754);
  --json-editor-focus-color: #86b7fe;
  --json-editor-focus-shadow: var(--bs-focus-ring-color, rgba(13, 110, 253, 0.25));
  --json-editor-padding-x: 0.75rem;
  --json-editor-padding-y: 0.375rem;
  --json-editor-line-height: 1.5;
  /* Bootstraps eigene .form-control-Regel (Light DOM) matcht den Host
     direkt, da er selbst die Klasse tr\xE4gt: Border, Padding, Hintergrund
     und das is-valid/invalid-Icon w\xFCrden also zus\xE4tzlich zur internen
     .editor-Box auf dem Host selbst gemalt - zwei Rahmen \xFCbereinander,
     leicht versetzt durch das zus\xE4tzliche Padding. Wir lassen die Optik
     ausschlie\xDFlich von .editor kommen und setzen die native Bootstrap-Box
     auf dem Host zur\xFCck, damit beide Rahmen exakt zusammenfallen. */
  border: 0 !important;
  padding: 0 !important;
  background: none !important;
  border-radius: 0 !important;
}

.editor {
  display: flex;
  flex-direction: column;
  height: var(--json-editor-height);
  background-color: var(--json-editor-bg);
  border: 1px solid var(--json-editor-border);
  border-radius: var(--json-editor-radius);
  overflow: hidden;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.editor:focus-within {
  border-color: var(--json-editor-focus-color);
  box-shadow: 0 0 0 0.25rem var(--json-editor-focus-shadow);
}

:host([invalid]) .editor {
  border-color: var(--json-editor-error);
}

/* Bootstraps .form-control.is-valid/.is-invalid setzt zus\xE4tzlich ein
   padding-right f\xFCr das native Icon - deckt der obige :host(.form-control)
   Reset (padding: 0 !important) bereits mit ab. */
/* Toolbar liegt innerhalb der Editor-Box, oberhalb des Codes - nicht dar\xFCber. */
.toolbar {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.4rem;
  border-bottom: 1px solid var(--json-editor-border);
  background-color: color-mix(in srgb, var(--json-editor-fg) 4%, var(--json-editor-bg));
  flex: none;
}

.toolbar button {
  display: inline-flex;
  align-items: center;
  font: inherit;
  font-size: 0.8rem;
  line-height: 1;
  padding: 0.3rem 0.55rem;
  border: 1px solid transparent;
  border-radius: calc(var(--json-editor-radius) - 1px);
  background: transparent;
  color: var(--json-editor-fg);
  cursor: pointer;
}

.toolbar button:hover {
  background-color: color-mix(in srgb, var(--json-editor-fg) 8%, transparent);
}

.toolbar button:focus-visible {
  outline: 2px solid var(--json-editor-focus-color);
  outline-offset: -2px;
}

.toolbar .status {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-left: auto;
  font-size: 0.8rem;
  color: var(--json-editor-fg);
  opacity: 0.65;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-icon {
  display: none;
  flex: none;
  line-height: 0;
}

.status-icon:not(:empty) {
  display: inline-flex;
}

.status-icon svg {
  display: block;
  width: 0.9rem;
  height: 0.9rem;
}

.status-text:empty {
  display: none;
}

/* Entspricht optisch .valid-feedback / .invalid-feedback aus Bootstrap,
   gespeist aus denselben --bs-form-valid-color / --bs-form-invalid-color
   Variablen - siehe Modul-Kommentar zur Shadow-DOM-Einschr\xE4nkung. */
.toolbar .status.status-ok {
  color: var(--json-editor-ok);
  opacity: 1;
}

.toolbar .status.status-error {
  color: var(--json-editor-error);
  opacity: 1;
}

.code-area {
  position: relative;
  flex: 1;
  min-height: 0;
}

/* Highlight-<pre> und textarea m\xFCssen pixelgenau \xFCbereinanderliegen:
   identische Box-Metriken in einem gemeinsamen Regelblock. */
.highlight,
::slotted(textarea) {
  position: absolute;
  inset: 0;
  margin: 0;
  box-sizing: border-box;
  padding: var(--json-editor-padding-y) var(--json-editor-padding-x);
  border: 0;
  border-radius: 0;
  font-family: inherit;
  font-size: inherit;
  line-height: var(--json-editor-line-height);
  tab-size: 2;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: auto;
}

.highlight {
  overflow: hidden;
  pointer-events: none;
  background: transparent;
  color: var(--json-editor-fg);
}

.highlight code {
  font: inherit;
  white-space: inherit;
}

::slotted(textarea) {
  background: transparent;
  color: transparent;
  caret-color: var(--json-editor-fg);
  resize: none;
  outline: none;
}

.tok-key {
  color: var(--json-editor-key);
}

.tok-string {
  color: var(--json-editor-string);
}

.tok-number {
  color: var(--json-editor-number);
}

.tok-boolean, .tok-null {
  color: var(--json-editor-keyword);
}

.tok-punct {
  color: var(--json-editor-punct);
}

.errors {
  margin: 0.35rem 0 0;
  padding: 0;
  list-style: none;
  font-size: 0.85rem;
  color: var(--json-editor-error);
}

.errors:empty {
  display: none;
}

.errors li {
  padding: 0.15rem 0;
}`;

  // packages/fucodo-json-editor/index.js
  var ICON_VALID = '<svg viewBox="0 0 8 8" aria-hidden="true" focusable="false"><path fill="currentColor" d="M2.3 6.73.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z"/></svg>';
  var ICON_INVALID = '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false" fill="none" stroke="currentColor"><circle cx="6" cy="6" r="4.5"/><path stroke-linejoin="round" d="M5.8 3.6h.4L6 6.5z"/><circle cx="6" cy="8.2" r=".6" fill="currentColor" stroke="none"/></svg>';
  var TEMPLATE = document.createElement("template");
  TEMPLATE.innerHTML = `<style> ${style_default}</style>
<div class="editor">
  <div class="toolbar">
    <button type="button" data-action="format">Formatieren</button>
    <button type="button" data-action="minify">Komprimieren</button>
    <span class="status"><span class="status-icon"></span><span class="status-text"></span></span>
  </div>
  <div class="code-area">
    <pre class="highlight" aria-hidden="true"><code></code></pre>
    <slot></slot>
  </div>
</div>
<ul class="errors" role="alert"></ul>
`;
  var Index = class extends HTMLElement {
    static get observedAttributes() {
      return ["schema-src", "indent"];
    }
    #textarea = null;
    #highlightCode = null;
    #errorsEl = null;
    #statusEl = null;
    #statusIconEl = null;
    #statusTextEl = null;
    #validator = null;
    #debounceHandle = null;
    #form = null;
    #onFormSubmit = null;
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: "open" });
      shadow.appendChild(TEMPLATE.content.cloneNode(true));
      this.#highlightCode = shadow.querySelector(".highlight code");
      this.#errorsEl = shadow.querySelector(".errors");
      this.#statusEl = shadow.querySelector(".status");
      this.#statusIconEl = shadow.querySelector(".status-icon");
      this.#statusTextEl = shadow.querySelector(".status-text");
      shadow.querySelector('[data-action="format"]').addEventListener("click", () => this.format());
      shadow.querySelector('[data-action="minify"]').addEventListener("click", () => this.minify());
    }
    connectedCallback() {
      this.#textarea = this.querySelector("textarea");
      if (!(this.#textarea instanceof HTMLTextAreaElement)) {
        console.warn("<json-editor> ben\xF6tigt ein <textarea>-Kind als Light-DOM-Inhalt.");
        return;
      }
      this.#loadSchema();
      this.#textarea.addEventListener("input", this.#onInput);
      this.#textarea.addEventListener("blur", this.#onBlur);
      this.#textarea.addEventListener("scroll", this.#onScroll);
      this.format({ silent: true });
      this.#updateHighlight();
      this.validate();
      this.#form = this.#textarea.closest("form");
      if (this.#form) {
        this.#onFormSubmit = (event) => this.#handleFormSubmit(event);
        this.#form.addEventListener("submit", this.#onFormSubmit);
      }
    }
    disconnectedCallback() {
      this.#textarea?.removeEventListener("input", this.#onInput);
      this.#textarea?.removeEventListener("blur", this.#onBlur);
      this.#textarea?.removeEventListener("scroll", this.#onScroll);
      const form = this.#form;
      const handler = this.#onFormSubmit;
      if (form && handler) {
        const cleanup = () => form.removeEventListener("submit", handler);
        if ("requestIdleCallback" in window) {
          requestIdleCallback(cleanup);
        } else {
          setTimeout(cleanup, 0);
        }
      }
      if (this.#debounceHandle) clearTimeout(this.#debounceHandle);
    }
    attributeChangedCallback(name) {
      if (name === "schema-src" && this.isConnected) {
        this.#loadSchema();
      }
    }
    get indent() {
      const value = Number(this.getAttribute("indent"));
      return Number.isFinite(value) && value >= 0 ? value : 2;
    }
    get value() {
      return this.#textarea?.value ?? "";
    }
    set value(next) {
      if (!this.#textarea) return;
      this.#textarea.value = next;
      this.format({ silent: true });
      this.#updateHighlight();
      this.validate();
    }
    #onInput = () => {
      this.#updateHighlight();
      if (this.#debounceHandle) clearTimeout(this.#debounceHandle);
      this.#debounceHandle = setTimeout(() => this.validate(), 400);
    };
    #onBlur = () => {
      this.format();
    };
    #onScroll = () => {
      const highlightEl = this.#highlightCode.parentElement;
      highlightEl.scrollTop = this.#textarea.scrollTop;
      highlightEl.scrollLeft = this.#textarea.scrollLeft;
    };
    #updateHighlight() {
      if (!this.#highlightCode || !this.#textarea) return;
      this.#highlightCode.innerHTML = highlightJson(this.#textarea.value);
    }
    async #loadSchema() {
      const src = this.getAttribute("schema-src");
      const inline = this.querySelector('script[type="application/schema+json"]');
      let schema = null;
      try {
        if (src) {
          const response = await fetch(src);
          if (!response.ok) throw new Error(`Schema konnte nicht geladen werden (${response.status})`);
          schema = await response.json();
        } else if (inline) {
          schema = JSON.parse(inline.textContent);
        }
      } catch (error) {
        this.#setStatus(`Schema-Fehler: ${error.message}`, "error");
        return;
      }
      if (schema) {
        this.#validator = new Validator(schema);
        this.validate();
      }
    }
    /** Pretty-print den aktuellen Inhalt. Bei silent:true keine Fehleranzeige bei Syntaxfehlern. */
    format({ silent = false } = {}) {
      if (!this.#textarea) return false;
      const raw = this.#textarea.value.trim();
      if (!raw) return true;
      try {
        const parsed = JSON.parse(raw);
        this.#textarea.value = prettyPrintJson(parsed, this.indent);
        this.#updateHighlight();
        this.validate();
        return true;
      } catch {
        if (!silent) this.validate();
        return false;
      }
    }
    /** Komprimiert den Inhalt auf eine Zeile (Speicherformat). */
    minify() {
      if (!this.#textarea) return false;
      const raw = this.#textarea.value.trim();
      if (!raw) return true;
      try {
        const parsed = JSON.parse(raw);
        this.#textarea.value = JSON.stringify(parsed);
        this.#updateHighlight();
        this.#reflectValidity(true);
        this.#setStatus("Komprimiert.", "valid");
        this.dispatchEvent(new CustomEvent("json-editor:minified", { detail: { value: this.#textarea.value } }));
        return true;
      } catch (error) {
        this.#reflectValidity(false);
        this.#setStatus(`JSON-Syntaxfehler: ${error.message}`, "error");
        return false;
      }
    }
    /** Validiert Syntax + Schema, aktualisiert Fehlerliste/[invalid] + is-valid/is-invalid, gibt boolean zurück. */
    validate() {
      if (!this.#textarea) return true;
      const raw = this.#textarea.value.trim();
      this.#clearErrors();
      if (!raw) {
        this.#reflectValidity(true, { neutral: true });
        this.#setStatus("");
        return true;
      }
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (error) {
        this.#reflectValidity(false);
        this.#renderErrors([`Syntaxfehler: ${error.message}`]);
        this.dispatchEvent(new CustomEvent("json-editor:invalid", { detail: { errors: [error.message] } }));
        return false;
      }
      if (!this.#validator) {
        this.#reflectValidity(true);
        this.#setStatus("Kein Schema geladen.", "valid");
        return true;
      }
      const result = this.#validator.validate(parsed);
      if (result.valid) {
        this.#reflectValidity(true);
        this.#setStatus("", "valid");
        this.dispatchEvent(new CustomEvent("json-editor:valid", { detail: { value: parsed } }));
        return true;
      }
      const messages = result.errors.map((error) => `${error.instanceLocation || "/"}: ${error.error}`);
      this.#reflectValidity(false);
      this.#renderErrors(messages);
      this.dispatchEvent(new CustomEvent("json-editor:invalid", { detail: { errors: messages } }));
      return false;
    }
    #handleFormSubmit(event) {
      if (event.target !== this.#form) return;
      const valid = this.validate();
      if (!valid) {
        event.preventDefault();
        this.#textarea.focus();
        return;
      }
      this.minify();
    }
    /**
     * Spiegelt den Validitätsstatus sowohl intern ([invalid]-Attribut fürs
     * Shadow-Stylesheet) als auch nach außen (is-valid/is-invalid-Klassen auf
     * dem Host, damit die Component sich in Bootstraps .was-validated-Fluss
     * einfügt). Bei neutral:true (z.B. leeres Feld) werden beide Klassen entfernt.
     */
    #reflectValidity(valid, { neutral = false } = {}) {
      this.toggleAttribute("invalid", !valid);
      if (neutral) {
        this.classList.remove("is-valid", "is-invalid");
        return;
      }
      this.classList.toggle("is-valid", valid);
      this.classList.toggle("is-invalid", !valid);
    }
    #clearErrors() {
      this.#errorsEl.replaceChildren();
    }
    #renderErrors(messages) {
      this.#errorsEl.replaceChildren(
        ...messages.map((message) => {
          const li = document.createElement("li");
          li.textContent = message;
          return li;
        })
      );
      this.#setStatus("", "error");
    }
    /**
     * state: null (neutral, kein Icon) | 'valid' (grünes Bootstrap-Häkchen) |
     * 'error' (rotes Bootstrap-Ausrufezeichen). Das Icon ersetzt das Wort
     * "Gültig"/"Ungültig"; text ist optionale Zusatzinfo daneben (z.B. "Komprimiert.").
     */
    #setStatus(text, state = null) {
      this.#statusIconEl.innerHTML = state === "valid" ? ICON_VALID : state === "error" ? ICON_INVALID : "";
      if (state === "valid") {
        this.#statusIconEl.setAttribute("role", "img");
        this.#statusIconEl.setAttribute("aria-label", "G\xFCltig");
      } else if (state === "error") {
        this.#statusIconEl.setAttribute("role", "img");
        this.#statusIconEl.setAttribute("aria-label", "Ung\xFCltig");
      } else {
        this.#statusIconEl.removeAttribute("role");
        this.#statusIconEl.removeAttribute("aria-label");
      }
      this.#statusTextEl.textContent = text;
      this.#statusEl.classList.toggle("status-ok", state === "valid");
      this.#statusEl.classList.toggle("status-error", state === "error");
    }
  };
  customElements.define("json-editor", Index);
})();

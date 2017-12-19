import { validateSchema } from './validation';

export function extractFromElement(element, config) {
  // no element found, return null value
  if (!element) {
    return null;
  }

  const validatedConfig = validateSchema(config, elementScheme);

  let value;
  // extract multiple properties from the same element
  if (validatedConfig.data) {
    value = extractDataFromElement(element, validatedConfig.data);
  } else if (validatedConfig.attr) {
    // extract attribute
    value = element.getAttribute(validatedConfig.attr);
  } else {
    // extract text or html value
    value = element[validatedConfig.html ? 'innerHTML' : 'textContent'];
  }

  // convert value before returning
  if (validatedConfig.convert) {
    value = convertValue(value, validatedConfig.convert);
  }
  return value;
}

function extractDataFromElement(element, data) {
  return Object.keys(data).reduce((acc, key) => {
    const dataConfig = data[key];
    const isAttr = typeof dataConfig === 'string';
    const isText = dataConfig === true;
    acc[key] = extractFromElement(
      element,
      isAttr ? { attr: dataConfig } : isText ? {} : dataConfig,
    );
    return acc;
  }, {});
}

function convertValue(value, to) {
  if (typeof to === 'function') {
    // usr func
    return to(value);
  }
  // built-in
  switch (to) {
    case 'number':
      return parseInt(value, 10);
    case 'float':
      return parseFloat(value);
    case 'boolean':
      return value === 'true';
    case 'date':
      return new Date(value);
  }
}

const baseKeys = (() => {
  const isProd = process.env.NODE_ENV === 'production';
  /* istanbul ignore if */
  if (isProd) return {};

  const Joi = require('./vendor/joi-browser');
  return {
    attr: Joi.string(),
    convert: [Joi.func().arity(1), Joi.string().regex(/^(number|float|boolean|date)$/)],
    html: Joi.bool(),
  };
})();

const elementScheme = (() => {
  const isProd = process.env.NODE_ENV === 'production';
  /* istanbul ignore if */
  if (isProd) return {};

  const Joi = require('./vendor/joi-browser');
  return Joi.object().keys(getSchemaKeys());
})();

export function getDataSchema() {
  const isProd = process.env.NODE_ENV === 'production';
  /* istanbul ignore if */
  if (isProd) return {};

  const Joi = require('./vendor/joi-browser');
  return Joi.object().pattern(/.*/, [Joi.string(), Joi.bool(), Joi.object().keys(baseKeys)]);
}

export function getSchemaKeys(): any {
  const isProd = process.env.NODE_ENV === 'production';
  /* istanbul ignore if */
  if (isProd) return {};

  return {
    ...baseKeys,
    data: getDataSchema(),
  };
}

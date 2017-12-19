import { extractFromElement, getSchemaKeys } from './extract-from-element';
import { validateSchema } from './validation';

export function extractData(parent, infoOrQuery, config = {}) {
  if (!parent) {
    throw new Error("Missing first parameter 'parent'");
  }
  if (!infoOrQuery) {
    throw new Error("Missing second parameter 'config'");
  }

  let mergedConfig;
  if (typeof infoOrQuery === 'string') {
    mergedConfig = {
      ...config,
      query: infoOrQuery,
    };
  } else {
    mergedConfig = infoOrQuery;
  }

  const validatedConfig = validateSchema(mergedConfig, dataSchema);

  const { query, list, ...finalConfig } = <any>validatedConfig;

  if (!list) {
    return extractFromElement(parent.querySelector(query), finalConfig);
  }

  return Array.from(parent.querySelectorAll(query)).map(child =>
    extractFromElement(child, finalConfig),
  );
}

const dataSchema = (() => {
  const isProd = process.env.NODE_ENV === 'production';
  /* istanbul ignore if */
  if (isProd) return {};

  const Joi = require('./vendor/joi-browser');
  return Joi.object().keys({
    ...getSchemaKeys(),
    query: Joi.string().required(),
    list: Joi.bool(),
  });
})();

export function getSchema(): any {
  return dataSchema;
}

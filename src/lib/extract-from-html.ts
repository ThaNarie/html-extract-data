import mergeWith from 'lodash/mergeWith';
import { extractData, getSchema } from './extract-data';
import { extractFromElement, getDataSchema } from './extract-from-element';
import { validateSchema } from './validation';

export function extractFromHTML(container: HTMLElement, config: any, additionalData: any = {}) {
  if (!container) {
    throw new Error("Missing first parameter 'container'");
  }
  if (!config) {
    throw new Error("Missing second parameter 'config'");
  }

  const validatedConfig = validateSchema(config, schema);

  if (validatedConfig.list) {
    const elements = Array.from(container.querySelectorAll(validatedConfig.query));
    return elements.map((element: HTMLElement) =>
      getData(element, validatedConfig, additionalData),
    );
  }

  return getData(
    validatedConfig.query ? container.querySelector(validatedConfig.query) : container,
    validatedConfig,
    additionalData,
  );
}

function getData(element, config, additionalData) {
  const extractedData = Object.keys(config.data).reduce((obj, key) => {
    const dataConfig = config.data[key];
    let extracted;
    if (typeof dataConfig === 'function') {
      extracted = dataConfig(
        // @ts-ignore: TS doesn't understand passing destructure args yet
        (...args) => extractData(element, ...args),
        element,
      );
    } else {
      extracted = extractData(element, dataConfig);
    }
    obj[key] = extracted;
    return obj;
  }, {});

  let selfData;
  if (config.self) {
    selfData = extractFromElement(element, {
      data: config.self,
    });
  }

  return mergeWith({}, additionalData, selfData, extractedData, (objValue, srcValue) => {
    if (Array.isArray(objValue)) {
      return objValue.concat(srcValue);
    }
  });
}

const schema = (() => {
  const isProd = process.env.NODE_ENV === 'production';
  /* istanbul ignore if */
  if (isProd) return {};

  const Joi = require('./vendor/joi-browser');
  return Joi.object()
    .keys({
      query: Joi.string(),
      data: Joi.object()
        .pattern(/.*/, [
          Joi.string(),
          Joi.func()
            .minArity(1)
            .maxArity(2),
          getSchema(),
        ])
        .required(),
      list: Joi.bool(),
      self: getDataSchema(),
    })
    .with('list', 'query');
})();

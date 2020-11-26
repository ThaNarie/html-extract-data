import mergeWith from 'lodash-es/mergeWith';
import { extractData } from './extract-data';
import { extractFromElement } from './extract-from-element';
import type { ExtractConfig, ExtractDataConfig } from './types';

/**
 * Top level function, does input parameter checking, and splits off between single and list mode
 * @param container
 * @param config
 * @param additionalData
 */
export function extractFromHTML(
  container: HTMLElement,
  config: ExtractConfig,
  additionalData: Record<string, unknown> = {},
): Record<string, unknown> | Array<Record<string, unknown>> {
  if (!container) {
    throw new Error("Missing first parameter 'container'");
  }
  if (!config) {
    throw new Error("Missing second parameter 'config'");
  }

  // the `query` from the config is used to select children and process each one individually
  if (config.list) {
    if (!config.query) {
      throw new Error('When specifying "list", you must also provide a "query".');
    }
    const elements = Array.from(container.querySelectorAll<HTMLElement>(config.query));
    return elements.map((element: HTMLElement) => getData(element, config, additionalData));
  }

  // if not a list, this will extract all information from either the single element specified
  // in the query, or the passed root element itself
  const element = config.query ? container.querySelector<HTMLElement>(config.query) : container;
  return getData(element, config, additionalData);
}

/**
 * Goes through the 'self' and 'data' config to extract information for each key.
 * - for the data, it can either be a config object or a function
 * - for self, it can only be from this element
 * @param element
 * @param config
 * @param additionalData
 */
function getData(
  element: HTMLElement | null,
  config: ExtractConfig,
  additionalData: Record<string, unknown>,
) {
  const extractedData = Object.entries(config.data || {}).reduce((obj, [key, dataConfig]) => {
    let extracted;
    if (typeof dataConfig === 'function') {
      extracted = dataConfig(
        (...args) => extractData(element, ...(args as [config: string | ExtractDataConfig])),
        element,
      );
    } else {
      extracted = extractData(element, dataConfig);
    }
    obj[key] = extracted;
    return obj;
  }, {} as Record<string, unknown>);

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

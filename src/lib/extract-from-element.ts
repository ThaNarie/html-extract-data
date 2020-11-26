/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ConvertConfig, ElementConfig, ExtractElementAtom, ExtractElementData } from './types';

/**
 * Extracts information from as single element, which can be:
 * - an attribute
 * - the text contents
 * - the HTML content
 * - or a "data" object with all of the above things above for each key if you need to extract
 *   multiple things from the same element
 *
 * @param element
 * @param config
 */
export function extractFromElement<T>(
  element: HTMLElement | null,
  config: ElementConfig,
): T | null {
  // no element found, return null value
  if (!element) {
    return null;
  }

  let value: string | null | Record<string, unknown>;
  // extract multiple properties from the same element
  if (config.data) {
    value = unpackNestedDataConfig(element, config.data);
  } else if (config.attr) {
    // extract attribute
    value = element.getAttribute(config.attr);
  } else {
    // extract text or html value
    value = element[config.html ? 'innerHTML' : 'textContent'];
  }

  // convert value before returning
  if (config.convert) {
    value = convertValue(value, config.convert);
  }
  return value as any;
}

/**
 * Does the shorthand expansion for atom-level (nested data) config
 * - string = attribute
 * - true = text
 * - { html : true } = html
 *
 * Feeds the unpacked shortcuts back into extractFromElement to be resolved data
 *
 * @param element
 * @param data
 */
function unpackNestedDataConfig(element: HTMLElement, data: Record<string, ExtractElementData>) {
  return Object.keys(data).reduce((acc, key) => {
    const dataConfig = data[key];
    const isAttr = typeof dataConfig === 'string';
    const isText = dataConfig === true;
    acc[key] = extractFromElement(
      element,
      isAttr ? { attr: dataConfig as string } : isText ? {} : (dataConfig as ExtractElementAtom),
    );
    return acc;
  }, {} as Record<string, unknown>);
}

/**
 * Handles conversions after the information has been extracted
 * - can be a custom function
 * - or a built-in default conversion
 *
 * @param value
 * @param to
 */
function convertValue(value: string | null | Record<string, unknown>, to: ConvertConfig) {
  if (typeof to === 'function') {
    // usr func
    return to(value);
  }

  if (value === null) {
    return null;
  }

  if (typeof value === 'object') {
    return value;
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

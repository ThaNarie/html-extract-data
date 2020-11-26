/* eslint-disable @typescript-eslint/no-explicit-any */
import { extractFromElement } from './extract-from-element';
import type { ExtractDataConfig } from './types';

/**
 * Small wrapper util to normalize the config for each data item
 * - selects the element based on the passed query
 * - calls extractFromElement to extract the information from the targeted (child?) element
 *
 * @param parent
 * @param queryOrConfig
 * @param config
 */
export function extractData(parent: HTMLElement | null, config: string | ExtractDataConfig): any;
export function extractData(
  parent: HTMLElement | null,
  query: string,
  config: Omit<ExtractDataConfig, 'query'>,
): any;
export function extractData(
  parent: HTMLElement | null,
  queryOrConfig: string | ExtractDataConfig,
  config?: Omit<ExtractDataConfig, 'query'>,
): any {
  if (!parent) {
    throw new Error("Missing first parameter 'parent'");
  }
  if (!queryOrConfig) {
    throw new Error("Missing second parameter 'config'");
  }

  let mergedConfig;
  if (typeof queryOrConfig === 'string') {
    mergedConfig = {
      ...(config || {}),
      query: queryOrConfig,
    };
  } else {
    mergedConfig = queryOrConfig;
  }

  const { query, list, ...finalConfig } = mergedConfig;

  if (!list) {
    return extractFromElement(parent.querySelector<HTMLElement>(query), finalConfig);
  }

  return Array.from(parent.querySelectorAll<HTMLElement>(query)).map((child) =>
    extractFromElement(child, finalConfig),
  );
}

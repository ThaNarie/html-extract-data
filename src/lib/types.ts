/* eslint-disable @typescript-eslint/no-explicit-any */
export type ConvertConfig = string | ((value: string | null | Record<string, unknown>) => any);

export type ExtractElementAtom = { html?: true; attr?: string; convert?: ConvertConfig };
export type ExtractElementData = string | boolean | ExtractElementAtom;

export type ElementConfig = ExtractElementAtom & {
  data?: Record<string, ExtractElementData>;
};

export type ExtractDataConfig = ElementConfig & {
  query: string;
  list?: boolean;
};

export type ExtractConfig = {
  query?: string;
  list?: boolean;
  self?: Record<string, ExtractElementData>;
  data?: Record<
    string,
    | string
    | ExtractDataConfig
    | ((
        extract: (
          queryOrConfig: string | ExtractDataConfig,
          config?: Omit<ExtractDataConfig, 'query'>,
        ) => any,
        element: HTMLElement | null,
      ) => any)
  >;
};

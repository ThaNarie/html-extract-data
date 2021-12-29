/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars,@typescript-eslint/ban-types */
export type BuiltInConvert = 'number' | 'float' | 'boolean' | 'date';
export type ConvertConfig = BuiltInConvert | ((value: any) => any);

export type ExtractElementAtom = { html?: true; attr?: string; convert?: ConvertConfig };
export type ExtractElementData = string | boolean | ExtractElementAtom;

export type ElementConfig = ExtractElementAtom & {
  data?: Record<string, ExtractElementData>;
};

export type ExtractDataConfig = ElementConfig & {
  query: string;
  list?: boolean;
};

export type ExtractHelper = <T extends Omit<ExtractDataConfig, 'query'>>(
  queryOrConfig: string | ExtractDataConfig,
  config?: T,
) => GetValue<T>;

// root config object
export type ExtractConfig = {
  query?: string;
  list?: boolean;
  self?: Record<string, ExtractElementData>;
  data?: Record<
    string,
    string | ExtractDataConfig | ((extract: ExtractHelper, element: HTMLElement | null) => any)
  >;
};

/// Extract some stuff
type BuiltInConvertTypeMap = {
  number: number;
  float: number;
  boolean: boolean;
  date: Date;
};
type ExtractBuiltInConvertType<T extends BuiltInConvert> = BuiltInConvertTypeMap[T];
type A1 = ExtractBuiltInConvertType<'float'>;

// todo strings might not be string literals, so will not match this at all :(
type ExtractConvertReturnType<T extends ConvertConfig> = T extends BuiltInConvert
  ? ExtractBuiltInConvertType<T>
  : T extends (value: any) => infer R
  ? R
  : any;
type B1 = ExtractConvertReturnType<typeof parseFloat>;
type B2 = ExtractConvertReturnType<'float'>;
type B3 = ExtractConvertReturnType<'date'>;

// extract keys for self
// extract keys for data
// - if data[field] is primitive or plain object without "data" or "convert" present, it's type string
// - if data[field] is object with 'data' prop, it's nested object, need recursion
// - if dat[field] is function, we need inference on return type of the passed "extract" function

// TODO: this always returns `never` when called from extract(...)
export type GetValue<T> = T extends string
  ? string
  : T extends Function
  ? Function
  : T extends { convert: any }
  ? ExtractConvertReturnType<T['convert']>
  : T extends { data: any }
  ? GetRecord<T['data']>
  : never;

export type GetRecord<T extends Record<string, any> | undefined> = {
  [P in keyof T]: GetValue<T[P]>;
};

export type GetStructure<T extends ExtractConfig> = GetRecord<T['self']> & GetRecord<T['data']>;

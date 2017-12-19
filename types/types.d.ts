declare module 'detect-node';

/**
 * Re-export types that we use from joi to joi-browser.
 */
declare module 'joi-browser' {
  import { BooleanSchema, FunctionSchema, ObjectSchema, StringSchema } from 'joi';

  export function string(): StringSchema;

  export function object(): ObjectSchema;

  export function bool(): BooleanSchema;

  export function func(): FunctionSchema;

  /**
   * Validates a value using the given schema and options.
   */
  export function validate<T>(value: T, schema: SchemaLike): ValidationResult<T>;
  export function validate<T, R>(
    value: T,
    schema: SchemaLike,
    callback: (err: ValidationError, value: T) => R,
  ): R;

  export function validate<T>(
    value: T,
    schema: SchemaLike,
    options: ValidationOptions,
  ): ValidationResult<T>;
  export function validate<T, R>(
    value: T,
    schema: SchemaLike,
    options: ValidationOptions,
    callback: (err: ValidationError, value: T) => R,
  ): R;
}

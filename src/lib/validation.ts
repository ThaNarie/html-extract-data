import isNode from 'detect-node';

export function validateSchema(config, schema) {
  /* istanbul ignore if */
  if (process.env.NODE_ENV === 'production') {
    return config;
  }

  const Joi = require('./vendor/joi-browser');
  const { error, value: validatedConfig } = Joi.validate(config, schema);

  if (error) {
    const stack = error.stack
      .split(/\n/g)
      .slice(5)
      .join('\n');
    const explanation = `\n    ${error.annotate(!isNode).replace(/\n/g, '\n    ')}`;
    const message = `${error.message}\n\nExplanation:\n${explanation}\n\nStack trace:\n${stack}`;

    throw new TypeError(message);
  }

  return validatedConfig;
}

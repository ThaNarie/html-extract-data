var typeScriptSettings = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:import/typescript',
  ],
  rules: {
    '@typescript-eslint/array-type': ['error', { default: 'generic', readonly: 'generic' }],
    '@typescript-eslint/ban-ts-comment': 'error',
    '@typescript-eslint/consistent-type-assertions': 'error',
    '@typescript-eslint/explicit-member-accessibility': 'error',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['camelCase'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
      },
      {
        selector: 'enumMember',
        format: ['PascalCase'],
      },
    ],
    '@typescript-eslint/no-empty-function': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: true, varsIgnorePattern: "Fragment" },
    ],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    '@typescript-eslint/prefer-interface': 'off',
    '@typescript-eslint/prefer-readonly': 'error',
    camelcase: 'off',
  },
};

module.exports = {
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['import'],
  env: {
    browser: true,
    es6: true,
  },
  globals: {
    require: true,
    process: true,
  },
  settings: {
  },
  rules: {
    'no-console': 'warn',
  },
  overrides: [
    {
      files: ['*.ts'],
      ...typeScriptSettings,
    },
  ],
};

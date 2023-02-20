module.exports = {
  root: true,
  extends: [
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'jest', 'import'],
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    'prettier/prettier': 'error',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
    'linebreak-style': ['error', 'unix'],
    'eol-last': ['error', 'always'],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'enum',
        format: ['UPPER_CASE', 'PascalCase'],
      },
      {
        selector: 'enumMember',
        format: ['UPPER_CASE', 'PascalCase'],
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};

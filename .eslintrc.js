module.exports = {
  'env': {
    'es2021': true,
    'node': true,
  },
  'extends': [
    'google',
    'eslint:recommended',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 13,
    'sourceType': 'module',
  },
  'plugins': [
    '@typescript-eslint',
  ],
  'rules': {
    'max-len': ['error', {'code': 120}],
    'no-unused-vars': 'warn',
    'require-jsdoc': 'off',
    'space-in-parens': ['error', 'never'],
    'space-infix-ops': 'error',
  },
};

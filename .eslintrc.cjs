/* eslint-env node */
module.exports = {
  root: true,
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: 'detect' } },
  env: { browser: true, es2021: true, node: true },
  plugins: ['react', 'react-hooks', 'import', 'jsx-a11y'],
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended', 'plugin:jsx-a11y/recommended', 'plugin:import/recommended', 'prettier'],
  rules: {
    'react/react-in-jsx-scope': 'off', // React 17+ doesn’t need `import React`
    'import/order': ['warn', { 'newlines-between': 'always', alphabetize: { order: 'asc' } }],
  },
}

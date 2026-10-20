export default [
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals: { window: 'readonly', document: 'readonly', localStorage: 'readonly', console: 'readonly', alert: 'readonly', URL: 'readonly' } },
    rules: {}
  }
]

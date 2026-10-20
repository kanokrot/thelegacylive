import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.{ts,vue}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ['**/*.vue'],
    languageOptions: { parser: vueParser, parserOptions: { parser: tseslint.parser, extraFileExtensions: ['.vue'] } },
  },
  { rules: {
    'vue/multi-word-component-names': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
  } },
)

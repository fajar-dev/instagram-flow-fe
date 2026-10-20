// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'curly': ['error', 'all'],
    '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: false }],
    '@stylistic/lines-between-class-members': ['error', 'always'],
    '@stylistic/padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: 'import', next: '*' },
      { blankLine: 'any', prev: 'import', next: 'import' },
      { blankLine: 'always', prev: '*', next: ['function', 'class', 'export'] },
      { blankLine: 'always', prev: ['function', 'class'], next: '*' }
    ],
    '@stylistic/max-statements-per-line': ['error', { max: 1 }]
  }
})

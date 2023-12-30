const process = require('node:process')
const antfu = require('@antfu/eslint-config').default

module.exports = antfu(
  {
    unocss: true,
    formatters: true,
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
      'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
      'no-async-promise-executor': 'off',
    },
  },
)

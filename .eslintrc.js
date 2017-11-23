module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: [
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'html',
    'import'
  ],
  globals: {
    'cordova': true,
    'DEV': true,
    'PROD': true,
    '__THEME': true
  },
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    'one-var': 0,
    'import/first': 0,
    'import/named': 2,
    'import/namespace': 2,
    'import/default': 2,
    'import/export': 2,
    'space-before-function-paren' : 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'brace-style': [0, '1tbs', { 'allowSingleLine': true }],
    'no-unexpected-multiline' : 0,
    'func-call-spacing' : 0,
    'semi' : 0,
    'no-multi-spaces' : 0,
    'eol-last' : 0,
    'no-useless-escape': 0
  }
}

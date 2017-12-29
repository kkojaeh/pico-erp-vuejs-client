module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  extends: [
    // 'google'
    'plugin:vue/recommended'
  ],
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  globals: {
    'cordova': true,
    'DEV': true,
    'PROD': true,
    '__THEME': true
  },
  // add your custom rules here
  'rules': {
    "max-len": [
      2,
      120
    ],
    "comma-dangle": [
      2,
      "never"
    ],
    "space-before-function-paren": ["error", {
      "anonymous": "always",
      "named": "never",
      "asyncArrow": "always"
    }],
    "valid-jsdoc": 2,
    "require-jsdoc": ["error", {
      "require": {
        "FunctionDeclaration": false,
        "MethodDefinition": false,
        "ClassDeclaration": false,
        "ArrowFunctionExpression": false,
        "FunctionExpression": false
      }
    }]
    // allow paren-less arrow functions
    /*
    'arrow-parens': 0,
    'one-var': 0,
    'no-new': 0,
    'padded-blocks': 0,
    'no-trailing-spaces': 0,
    'import/first': 0,
    'import/named': 2,
    'import/namespace': 2,
    'import/default': 2,
    'import/export': 2,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'brace-style': [2, 'stroustrup', { 'allowSingleLine': true }]
    */
  }
}

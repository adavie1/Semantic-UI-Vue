import * as Babel from 'babel-standalone';

/* eslint-disable */
export default function evalJS(script, scope = {}) {
  // https://www.npmjs.com/package/babel-standalone
  /* istanbul ignore next */

  const plugins = []

  // Register jsx plugin
  if (window['babel-plugin-transform-vue-jsx']) {
    if (!Babel.availablePlugins['transform-vue-jsx']) { // eslint-disable-line
      Babel.registerPlugin('transform-vue-jsx', window['babel-plugin-transform-vue-jsx']) // eslint-disable-line
    }
    plugins.push('transform-vue-jsx')
  }

  script =  Babel.transform(script, { // eslint-disable-line
    presets: [['es2015', { 'loose': true }], 'stage-2'],
    plugins,
    comments: false,
  }).code;

  let scopeDecl = '';
  for (var variable in scope) {
    if (scope.hasOwnProperty(variable)) {
      scopeDecl += 'var ' + variable + ' = __vuep[\'' + variable + '\'];'
    }
  }

  script = `(function(exports){var module={};module.exports=exports;${scopeDecl};${script};return module.exports.__esModule?module.exports.default:module.exports;})({})`
  const result = new Function('__vuep', 'return ' + script)(scope) || {} // eslint-disable-line
  return result
}

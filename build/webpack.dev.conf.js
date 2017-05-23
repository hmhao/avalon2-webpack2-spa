var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var es3ifyPlugin = require('es3ify-webpack-plugin')
var ReplacePlugin = require('replace-bundle-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  //devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    new es3ifyPlugin(),
    new ReplacePlugin([{
      partten: /Object\.defineProperty\((__webpack_exports__|exports),\s*"__esModule",\s*\{\s*value:\s*true\s*\}\);/g,
      replacement: function (str, p1) {
        return p1 + '.__esModule = true;';
      }
    },{
      partten: /\/\**\/\s*Object\.defineProperty\(exports,\s*name,\s*\{[^})]*\}\);/g,
      replacement: function () {
        return '/******/            exports[name] = getter;';
      }
    },{
      partten: /,\s*hotCreateRequire\(moduleId\)/g,
      replacement: function () {
        return ', (this.noHotCreateRequire ? __webpack_require__ : hotCreateRequire(moduleId))'
      }
    },{
      partten: /return\s*?(hotCreateRequire\(\d+\)\((.*)\))/g,
      replacement: function (str, p1, p2) {
        return `return this.noHotCreateRequire ? __webpack_require__(${p2}) : ${p1}`
      }
    },{
      partten: /var\s*hotClient\s*=\s*__webpack_require__\(\d+\)/g,
      replacement: function (str) {
        return `if(window.noHotCreateRequire){return}\n${str}`
      }
    }]),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.ejs',
      assetsPath: config.dev.assetsPublicPath,
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
})

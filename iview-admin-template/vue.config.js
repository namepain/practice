/* eslint-disable */
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {

  baseUrl: '/',

  // 打包时不生成.map文件
  productionSourceMap: false,

  // webpack 配置，此处重写了 vue-cli 的 svg loader 配置，用以加载 svg-icon
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')
    // clear all existing loaders.
    // if you don't do this, the loader below will be appended to
    // existing loaders of the rule.
    svgRule.uses.clear()
    // add replacement loader(s)
    svgRule
      .exclude
        .add(resolve('src/common/icons'))
        .end()
      .test(/\.(svg)(\?.*)?$/)
        .use('file-loader')
          .loader('file-loader')
          .options({
            name: `img/[name].[hash:8].[ext]`
          })

    config.module
      .rule('svg-icon')
      .test(/\.svg$/)
        .include
          .add(resolve('src/common/icons'))
          .end()
        .use('svg-sprite-loader')
          .loader('svg-sprite-loader')
          .options({
            symbolId: 'icon-[name]'
          })
          .end()
  },

  // devServer 代理配置
  devServer: {
    port: 9000,
    proxy: {
      '/api': {
        target: 'http://localhost:9000/',
        changeOrigin: true,
        ws: false,  // proxy 超过 5 个时记得设置此项为 false，否则会启动报错
        pathRewrite: {
          '/api': '/'
        }
      }
    }
  }
}

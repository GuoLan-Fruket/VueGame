const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  // devServer: {
  //   proxy: {
  //     '/': {
  //       ws: false, // proxy websockets
  //       target: 'http://192.168.0.198:8080',
  //       pathRewrite: {
  //         '^/': '/bpp/'
  //       },
  //       cookiePathRewrite: {
  //         '/bpp': '/'
  //       }
  //     }
  //   }
  // },
  // baseUrl: process.env.NODE_ENV === 'production' ? '/bpp' : '/'

})

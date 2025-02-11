const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    port: process.env.VUE_APP_PORT,

    proxy: {
      '/api': {
        target: process.env.VUE_APP_BACK_URL,
        changeOrigin: true,
      }
    }
  }
})

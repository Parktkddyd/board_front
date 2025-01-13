const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  //for proxy
  outputDir: "../../Boards_Back/board_back/src/main/resources/static", // build 경로
  devServer: {
    port : process.env.VUE_APP_PORT,

    proxy:{
      '/test':{
        target : process.env.VUE_APP_BACK_URL,
        changeOrigin: true,
      }
    }
  }
})

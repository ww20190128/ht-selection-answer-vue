const path = require('path')
const { defineConfig } = require('@vue/cli-service')
// import vueJsx from "@vitejs/plugin-vue-jsx";

module.exports = defineConfig({
  productionSourceMap: false,
  transpileDependencies: true,
  // plugins: [
  // 	vueJsx()  //添加 jsx
  // ],
  configureWebpack: {
    resolve: {
      alias: {
        // 设置别名
        '@': require('path').resolve(__dirname, 'src'),
        '@/plugins': require('path').resolve(__dirname, 'src/plugins/vant.js'),
      }
    },
    devServer: {
      client: {
        overlay: false
      }
    }
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/styles/index.less')] //设置定义less变量屏蔽报错
    }
  },
  // chainWebpack: (config) => {
  //   config.plugin('define').tap((args) => {
  //     const vueDefines = args[0]['__VUE_OPTIONS_API__'];
  //     args[0]['__VUE_PROD_HYDRATION_MISMATCH_DETAILS__'] = vueDefines;
  //     return args;
  //   });
  // },

  chainWebpack: config => {
    // 在 Vue 项目中配置 Vant 的 Toast 组件允许同时存在多个实例
    config.plugin('define').tap(args => {
      args[0]['__VUE_PROD_DEVTOOLS__'] = false;
      args[0]['__VUE_PROD_HYDRATION_MISMATCH__'] = false;
      args[0]['__VUE_PROD_HYDRATION_MISMATCH_DETAILS__'] = false;
      return args;
    });
  },
  css: {
    loaderOptions: {
      postcss: {
        postcssOptions: {
          plugins: [
            require('postcss-pxtorem')({
              rootValue: 37.5, // 基准值，与设计稿宽度相关
              propList: ['*'], // 需要转换的属性，* 表示所有属性都转换
            })
          ]
        }
      }
    }
  }


})

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    '@vue/babel-preset-jsx'
  ],
  plugins: [
    '@vue/babel-plugin-jsx' // 启用 Vue 的 JSX 插件
  ],
  // // 其他配置...
  // generatorOpts: {
  //   // 增加代码生成器的限制
  //   compact: false
  // }
}
module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 37.5, // 基准像素值，1rem = 16px
      propList: ['*'], // 可以从 px 转换为 rem 的属性列表, '*' 表示所有属性
      selectorBlackList: ['.ignore', '.hairlines'], // 忽略的选择器列表
      minPixelValue: 1, // 最小的转换单位
      mediaQuery: false // 允许在媒体查询中转换px
    },
 

  }
}

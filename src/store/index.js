import { createStore, useStore as baseUseStore } from 'vuex'
import getters from './getters'
// 唯一key值
const key = Symbol()
// 动态获取modules文件夹下所有模块 不用每次手动导入 只需创建文件
const modulesFiles = require.context('./modules', true, /\.js$/)


// 解析导入模块
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

export const store = createStore({
  modules,
  getters

})
// 定义我们自己的useStore方法
export const useStore = () => {
  return baseUseStore(key)
}
// 挂载store
export const setupStore = (app) => {
  app.use(store, key)
}

import { createPinia } from 'pinia'
import emitter from './emitter'
import router from '@/router'
import { ipcRenderer } from '@/api'

export function registerPlugins(app) {
  const pinia = createPinia()

  app.use(pinia)
  app.use(router)

  // 全局事件
  app.config.globalProperties.$emitter = emitter
  // 全局 ipcRenderer 通信
  app.config.globalProperties.$ipc = ipcRenderer
}

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { ElLink } from 'element-plus'
import App from './App.vue'
import router from '@/router'
import { ipc } from '@/api'

import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import './styles/index.scss'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

// 全局组件属性设置
ElLink.props.underline = false
//
app.config.globalProperties.$ipc = ipc

app.mount('#app')

import { createRouter, createWebHashHistory } from 'vue-router'
import NProgress from 'nprogress'

import Layout from '@/layout/index.vue'

import 'nprogress/nprogress.css'

export const constantRoutes = [
  {
    path: '/',
    name: 'app',
    redirect: '/home',
    component: Layout,
    meta: {
      title: '首页',
    },
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        name: 'home',
        meta: {
          title: '首页',
        },
      },
      {
        path: '/demo',
        component: () => import('@/views/demo.vue'),
        name: 'demo',
        meta: {
          title: '演示',
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
})

router.beforeEach(async () => {
  NProgress.start()
})

router.afterEach(() => {
  NProgress.done()
})

export default router

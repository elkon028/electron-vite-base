import { resolve } from 'node:path'
import { bytecodePlugin, defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

import Unocss from 'unocss/vite'

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin(),
      bytecodePlugin({
        protectedStrings: ['zAvl76MWpBDNL1FL'],
      }),
    ],
  },
  preload: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()],
  },
  renderer: {
    build: {
      // 是否开启压缩
      minify: 'esbuild', // 可选值：'terser' | 'esbuild'
      // 是否将模块提取到单独的 chunk 中，默认是 true
      chunkSizeWarningLimit: 500,
      // 是否提取 CSS 到单独的文件中
      cssCodeSplit: true,
      // 是否开启 CSS 压缩
      cssMinify: true,
    },
    resolve: {
      alias: {
        '@': resolve('src/renderer'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/element/index.scss" as *;`,
        },
      },
    },
    plugins: [
      vue(),
      AutoImport({
        dts: true,
        vueTemplate: true,
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ['vue', '@vueuse/core'],
        // imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
        eslintrc: {
          enabled: false, // 是否自动生成 eslint 规则，建议生成之后设置 false，手动维护
          filepath: './.eslintrc-auto-import.json', // 指定自动导入函数 eslint 规则的文件路径
          globalsPropValue: true,
        },
        resolvers: [
          // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
          ElementPlusResolver(),
        ],
      }),
      Components({
        dts: true,
        // https://cn.electron-vite.org/guide/dev
        // 默认情况下，渲染器的工作目录位于 src/renderer
        // 所以此处应设为 './components'
        dirs: ['./components'],
        // allow auto load markdown components under `./src/components/`
        extensions: ['vue', 'md'],
        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass',
          }),
          // 自动导入图标组件
          IconsResolver({
            // yarn add -D @iconify-json/ep 是 Element Plus 的图标库
            // yarn add -D @iconify-json/ic 是 Google Material Icons 的图标库
            // yarn add -D @iconify-json/carbon
            enabledCollections: ['carbon'],
          }),
        ],
      }),
      Unocss(),
      Icons({
        autoInstall: true,
      }),
    ],
  },
})

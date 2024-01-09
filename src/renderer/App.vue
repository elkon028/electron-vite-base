<script>
import { defineComponent } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

export default defineComponent({
  components: {
    ElConfigProvider,
  },
  setup() {
    return {
      size: 'small',
      zIndex: 2000,
      locale: zhCn,
    }
  },
})
</script>

<template>
  <ElConfigProvider :size="size" :z-index="zIndex" :locale="locale">
    <router-view />
  </ElConfigProvider>
</template>

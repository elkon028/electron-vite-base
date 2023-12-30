<script setup>
// 环境变量
const { MAIN_VITE_SOME_KEY, PRELOAD_VITE_SOME_KEY, RENDERER_VITE_SOME_KEY } = import.meta.env
</script>

<template>
  <ElectronVersions />
  <div class="my-24px">
    .env.* 环境变量配置信息读取
  </div>
  <div>MAIN_VITE_SOME_KEY：{{ MAIN_VITE_SOME_KEY }} # 渲染进程不可用</div>
  <div>PRELOAD_VITE_SOME_KEY：{{ PRELOAD_VITE_SOME_KEY }} # 渲染进程不可用</div>
  <div>RENDERER_VITE_SOME_KEY：{{ RENDERER_VITE_SOME_KEY }} # 渲染进程可用</div>
</template>

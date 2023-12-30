<script setup>
// 环境变量
const { MAIN_VITE_SOME_KEY, PRELOAD_VITE_SOME_KEY, RENDERER_VITE_SOME_KEY } = import.meta.env
</script>

<template>
  <ElectronVersions />
  <div class="p-12px">
    <div class="my-24px">
      .env.* 环境变量配置信息读取
    </div>
    <div class="p-12px text-xs">
      <div>MAIN_VITE_SOME_KEY：{{ MAIN_VITE_SOME_KEY }} # 渲染进程不可用</div>
      <div>PRELOAD_VITE_SOME_KEY：{{ PRELOAD_VITE_SOME_KEY }} # 渲染进程不可用</div>
      <div>RENDERER_VITE_SOME_KEY：{{ RENDERER_VITE_SOME_KEY }} # 渲染进程可用</div>
    </div>
    <div class="my-24px">
      图标使用
    </div>
    <div class="flex gap-4 p-12px text-xs">
      <div class="flex">
        组件方式：<i-carbon-home />
      </div>
      <div>
        <i class="i-carbon-home">
          {{ '<a class="i-carbon-home"></a>' }}
        </i>
      </div>
      <div>
        <el-link type="success" icon="i-carbon-home">
          {{ `<el-link icon="i-carbon-home"></el-link>` }}
        </el-link>
      </div>
    </div>
  </div>
</template>

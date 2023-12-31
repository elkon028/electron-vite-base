<script setup>
import MarkdownDemo from './MarkdownDemo.md'

// 环境变量
const { MAIN_VITE_SOME_KEY, PRELOAD_VITE_SOME_KEY, RENDERER_VITE_SOME_KEY } = import.meta.env
</script>

<template>
  <ElectronVersions />
  <div class="p-12px">
    <div class="my-10px">
      .env.* 环境变量配置信息读取
    </div>
    <div class="p-12px text-xs">
      <div>MAIN_VITE_SOME_KEY：{{ MAIN_VITE_SOME_KEY }} # 渲染进程不可用</div>
      <div>PRELOAD_VITE_SOME_KEY：{{ PRELOAD_VITE_SOME_KEY }} # 渲染进程不可用</div>
      <div>RENDERER_VITE_SOME_KEY：{{ RENDERER_VITE_SOME_KEY }} # 渲染进程可用</div>
    </div>
    <div class="my-10px">
      图标使用
    </div>
    <div class="p-12px text-xs">
      <div class="flex">
        组件方式：<i-carbon-home />{{ '<i-carbon-home />' }}
      </div>
      <div>
        class方式：
        <a>
          <i class="i-carbon-home text-sm color-red" />
          {{ '<a><i class="i-carbon-home text-sm color-red" /> ...</a>' }}
        </a>
      </div>
      <div>
        props方式：
        <el-link type="success" icon="i-carbon-home">
          {{ `<el-link icon="i-carbon-home">...</el-link>` }}
        </el-link>
      </div>
      <div>
        本地Svg图标：
        <span class="i-svg-plus" />
        <i-svg-plus />
        <el-link type="success" icon="i-svg-plus">
          {{ `<el-link icon="i-svg-plus">...</el-link>` }}
        </el-link>
      </div>
    </div>
    <div class="my-10px">
      Markdown 演示
    </div>
    <MarkdownDemo />
  </div>
</template>

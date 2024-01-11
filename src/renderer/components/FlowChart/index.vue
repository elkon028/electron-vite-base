<script setup>
import { computed, ref } from 'vue'

import FlowGraph from './components/FlowGraph.vue'

const showFlow = ref(false)

const rootStyle = computed(() => {
  const width = showFlow.value ? '0%' : '100%'
  const style = {
    transform: `translateX(${width})`,
  }
  return style
})
</script>

<template>
  <div class="flow-chart">
    <a class="flow-chart--close" @click="showFlow = !showFlow">
      <SvgIcon :name="showFlow ? 'flow-minimize' : 'flow-maximize'" color="#555" size="20" />
    </a>
    <div class="flow-chart--body" :style="rootStyle">
      <FlowGraph />
    </div>
  </div>
</template>

<style lang="scss">
.flow-node-select {
  .x6-widget-selection-box {
    box-sizing: content-box !important;
    margin-top: 0;
    margin-left: 0;
    padding-right: 0;
    padding-bottom: 0;
    transform: translate(-2px, -2px);
    border: 2px dashed #feb663;
    box-shadow: none;
  }
}
</style>

<style lang="scss" scoped>
.flow-chart {
  top: 0;
  right: 0;
  bottom: 0;
  &--close {
    top: 15px;
    right: 15px;
    z-index: 101;
    cursor: pointer;
    position: absolute;
  }
  &--body {
    inset: 0;
    z-index: 100;
    transform: translateX(100%);
    transition: all 0.5s;
    background: #ddd;
    position: absolute;
  }
}
</style>

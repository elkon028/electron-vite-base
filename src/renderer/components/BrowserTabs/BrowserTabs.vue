<script setup>
import { moveArrayIndex } from '@/utils'

const { proxy } = getCurrentInstance()

const items = ref(['item1', 'item2', 'item3', 'item4'])
const body = ref('item1')

function onClick(name) {
  body.value = name
}

// 开始拖拽一个可拖拽元素时，在 可拖拽元素 身上触发
function onDragStart(event, index) {
  console.log('onDragStart', event)
  event.dataTransfer.setData('dragIndex', index)
}

// 可拖拽元素进入可放置元素时，在 可放置元素 身上触发
function onDragEnter(event) {
  console.log('onDragEnter', event)
}

// 可拖拽元素离开可放置元素时，在 可放置元素 身上触发
function onDragLeave(event) {
  console.log('onDragLeave', event)
}

// 当一个可拖拽元素被拖进一个可放置元素上时，在 可放置元素 上间隔几百毫秒触发一次
function onDragOver(event) {
  event.preventDefault()
  console.log('onDragOver')
}

// 结束拖拽一个可拖拽元素时，在 可拖拽元素 身上触发
async function onDragEnd(event) {
  console.log('onDragEnd', event)
  // 通过主进程，获取鼠标在屏幕上的坐标
  const point = await proxy.$ipc('getCursorScreenPoint')
  // 判断拖拽是否超出屏幕
  if (
    point.x >= window.screenX
    && point.x <= window.screenX + window.outerWidth
    && point.y >= window.screenY
    && point.y <= window.screenY + window.outerHeight
  ) {
    // 未超出窗体，执行UI操作
    // 例如上下左右分屏效果
  } else {
    // 此处为拖拽超出了窗体，就新建窗体
    // proxy.$ipc('openWindow', { url: 'demo?tab=1' })
  }
}

// 放置一个元素时，在 可放置元素 上触发
function onDrop(event, index) {
  event.preventDefault()
  const dragIndex = event.dataTransfer.getData('dragIndex')
  items.value = moveArrayIndex(items.value, dragIndex, index)
}
</script>

<template>
  <div class="browser-tabs">
    <transition-group name="drag" tag="div" class="header">
      <div
        v-for="(name, idx) in items"
        :key="idx"
        class="item"
        :draggable="true"
        @click="onClick(name)"
        @dragstart="onDragStart($event, idx)"
        @dragenter="onDragEnter"
        @dragleave="onDragLeave"
        @dragover="onDragOver"
        @dragend="onDragEnd"
        @drop="onDrop($event, idx)"
      >
        {{ name }}
      </div>
    </transition-group>
    <div class="body">{{ body }}</div>
  </div>
</template>

<style lang="scss" scoped>
.browser-tabs {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .header {
    display: flex;
    background: #999;
    .item {
      padding: 5px 8px;
      border: 1px solid #ddd;
      background: #f5f5f5;
      cursor: pointer;
    }
  }
  .body {
    flex: 1;
    overflow-y: auto;
  }
}
</style>

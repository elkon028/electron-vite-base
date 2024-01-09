<script setup>
const items = [
  'item1',
  'item2',
  'item3',
  'item4',
]

const body = ref('item1')

function onClick(name) {
  body.value = name
}

function onMousedown(event) {
  console.log(event)
}

function onMousemove(event) {
  console.log(event)
}

function onMouseup(event) {
  console.log(event)
}
</script>

<template>
  <div class="browser-tabs">
    <div class="header">
      <div
        v-for="(name, idx) in items" :key="idx" class="item"
        @click="onClick(name)"
        @mousedown="onMousedown"
        @mousemove="onMousemove"
        @mouseup="onMouseup"
      >
        {{ name }}
      </div>
    </div>
    <div class="body">
      {{ body }}
    </div>
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

    .item {
      padding: 5px 8px;
      border: 1px solid #ddd;
      cursor: pointer;
    }
  }
  .body {
    flex: 1;
    overflow-y: auto;
  }
}
</style>

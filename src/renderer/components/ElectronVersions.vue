<script setup lang="ts">
import { reactive } from 'vue'

const electronVersions = reactive({ ...window.electron.process.versions })
</script>

<template>
  <ul class="versions">
    <li class="electron-version">
      Electron v{{ electronVersions.electron }}
    </li>
    <li class="chrome-version">
      Chromium v{{ electronVersions.chrome }}
    </li>
    <li class="node-version">
      Node v{{ electronVersions.node }}
    </li>
    <li class="v8-version">
      V8 v{{ electronVersions.v8 }}
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.versions {
  margin: 0 auto;
  float: none;
  clear: both;
  overflow: hidden;
  color: #c2f5ff;
  line-height: 1;
  transition: all 0.3s;

  li {
    display: block;
    float: left;
    border-right: 1px solid rgba(194, 245, 255, 0.4);
    padding: 0 20px;
    font-size: 13px;
    opacity: 0.8;

    &:last-child {
      border: none;
    }
  }
}
</style>

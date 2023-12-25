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

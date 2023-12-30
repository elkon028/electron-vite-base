<script setup lang="ts">
import { reactive } from 'vue'

const electronVersions = reactive({ ...window.electron.process.versions })
</script>

<template>
  <ul class="flex">
    <li class="p-12px">
      Electron v{{ electronVersions.electron }}
    </li>
    <li class="p-12px">
      Chromium v{{ electronVersions.chrome }}
    </li>
    <li class="p-12px">
      Node v{{ electronVersions.node }}
    </li>
    <li class="flex-auto p-12px">
      V8 v{{ electronVersions.v8 }}
    </li>
    <li class="p-12px">
      <DarkToggle />
    </li>
  </ul>
</template>

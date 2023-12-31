<script setup lang="ts">
import { reactive } from 'vue'

const electronVersions = reactive({ ...window.electron.process.versions })
</script>

<template>
  <div class="flex">
    <div class="p-12px">
      Electron v{{ electronVersions.electron }}
    </div>
    <div class="p-12px">
      Chromium v{{ electronVersions.chrome }}
    </div>
    <div class="p-12px">
      Node v{{ electronVersions.node }}
    </div>
    <div class="flex-auto p-12px">
      V8 v{{ electronVersions.v8 }}
    </div>
    <div class="p-12px">
      <DarkToggle />
    </div>
  </div>
</template>

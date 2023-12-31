<script setup>
const isDark = useDark()
const { proxy } = getCurrentInstance()

const isAppearanceTransition
  = document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Credit to [@hooray](https://github.com/hooray)
 * @see https://github.com/vuejs/vitepress/pull/2347
 */
function toggleDark(event) {
  if (!isAppearanceTransition || !event) {
    isDark.value = !isDark.value
    return
  }
  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

  const transition = document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  })
  transition.ready.then(() => {
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]

    document.documentElement.animate(
      {
        clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 400,
        easing: 'ease-in',
        pseudoElement: isDark.value ? '::view-transition-old(root)' : '::view-transition-new(root)',
      },
    )
    // ipcRenderer
    proxy.$ipc.switchDark()
  })
}
</script>

<template>
  <el-link
    type="info"
    class="text-size-18px"
    :icon="isDark ? 'i-carbon-moon' : 'i-carbon-sun'"
    @click="toggleDark"
  />
</template>

<style>
html {
  scrollbar-gutter: stable;
}
html.dark {
  color-scheme: dark;
  background: #121212;
  color: white;
}
html.dark .shiki,
html.dark .shiki span {
  color: var(--shiki-dark);
  background: var(--shiki-dark-bg);
}
html:not(.dark) .shiki,
html:not(.dark) .shiki span {
  color: var(--shiki-light);
  background: var(--shiki-light-bg);
}
html.dark ::-moz-selection {
  background: #444;
}
html.dark ::selection {
  background: #444;
}

::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
::view-transition-old(root) {
  z-index: 1;
}
::view-transition-new(root) {
  z-index: 2147483646;
}
.dark::view-transition-old(root) {
  z-index: 2147483646;
}
.dark::view-transition-new(root) {
  z-index: 1;
}
</style>

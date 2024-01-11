<template>
  <input v-model="currentValue" ref="inputElement" :style="styles" placeholder="请输入" @keyup.enter="onSubmit()" />
</template>

<script setup>
import { ref, toRefs, computed, onMounted, defineProps, defineEmits } from 'vue'
import { saveProjectFile } from '@/store/data/projectfile'
import { addUnit } from './utils'
import { config } from './constant'

import emitter from './emitter'

const props = defineProps(['modelValue', 'type'])
const emit = defineEmits(['update:modelValue', 'submit'])

const { type, modelValue } = toRefs(props)
const currentValue = ref(props.modelValue)

const styles = computed(() => {
  const style = {
    outlineWidth: '1px',
    fontSize: addUnit(type.value === 'name' ? config.nameFontSize : config.contentFontSize),
  }

  return style
})

const inputElement = ref()
onMounted(() => {
  inputElement.value.select()
})

async function onSubmit() {
  if (modelValue.value !== currentValue.value) {
    emit('update:modelValue', currentValue.value)
    await saveProjectFile()
    emit('submit', true)
  } else {
    emit('submit', false)
  }
}

emitter.on('blankClick', () => {
  onSubmit()
})
</script>

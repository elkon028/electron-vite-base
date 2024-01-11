<template>
  <div :class="['flow-node', theme]" :style="nodeStyle">
    <NodeInput v-if="editable === 'name'" v-model="info.name" type="name" class="flow-node--name" @submit="onSubmit" />
    <div v-else class="flow-node--name" @dblclick.stop="editable = 'name'">{{ info.name }}</div>
    <div class="flow-node--divider" />
    <NodeInput
      v-if="editable === 'content'"
      v-model="info.content"
      type="content"
      class="flow-node--content"
      @submit="onSubmit" />
    <div v-else class="flow-node--content" @dblclick.stop="editable = 'content'">{{ info.content }}</div>
    <a class="flow-node--icon plus" @click.exact="onAddNode" @mousedown.shift="onDargdown">
      <SvgIcon name="flow-plus" size="20" color="#2e61b4" />
    </a>
    <a v-if="info.children?.length" class="flow-node--icon arrow" @click.stop="onExpand()">
      <SvgIcon :name="`flow-arrow-${isExpand ? 'left' : 'right'}`" size="20" color="#2e61b4" />
    </a>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useNodeState } from '@/store/data/nodeState'
import { getUuid } from '@/utils/other'
import SvgIcon from '@/components/common/SvgIcon'
import NodeInput from './NodeInput.vue'
import { addUnit, getTextSize } from './utils'
import { config } from './constant'

const getGraph = inject('getGraph')
const getNode = inject('getNode')
const graph = getGraph()
const node = getNode()

const nodeData = node.getData()
const nodeStore = useNodeState()

const isExpand = ref(true)
const editable = ref('')

const info = ref({})
info.value = nodeStore.findNodeById(nodeData.id)

const theme = computed(() => {
  return nodeStore.findParentNodeById(info.value.id) ? 'task' : 'project'
})

const nodeStyle = computed(() => {
  return {
    padding: `${addUnit(config.paddingY)} ${addUnit(config.paddingX)}`,
    borderWidth: theme.value === 'task' ? addUnit(config.borderWidth) : 0,
  }
})

// 重新计算节点大小
function onSubmit(changed) {
  editable.value = ''
  if (changed) {
    const border = theme.value === 'task' ? config.borderWidth : 0
    const nodeSize = getTextSize(info.value.name, info.value.content, border)
    node.size(nodeSize)
  }
}

function onAddNode() {
  const data = nodeStore.addNode(info.value.id, {
    id: getUuid(),
    name: '',
    content: '',
    color: '',
    children: [],
    personnel: [],
    files: [],
    budget: [],
    taskStartTime: info.value.taskStartTime,
    taskEndTime: info.value.taskEndTime,
  })
  if (data) {
    console.log(data)
    const size = getTextSize(data.name, data.content, config.borderWidth)
    const child = graph.addNode({
      id: getUuid(),
      shape: 'vueshape',
      parent: node,
      zIndex: 1,
      data,
      ...size,
    })

    graph.addEdge({
      shape: 'mindmap-edge',
      zIndex: 0,
      source: {
        cell: node.id,
        anchor: 'right',
      },
      target: {
        cell: child.id,
        anchor: 'left',
      },
    })

    const bbox = node.getBBox()
    const point = { x: bbox.x + bbox.width + 90, y: bbox.y }

    node.getChildren()?.map((item) => {
      const cbbox = item.getBBox()
      const newY = cbbox.y + cbbox.height + 42
      if (newY > point.y) {
        point.y = newY
      }
    })

    node.addChild(child)
    child.position(point.x, point.y)
  }
}

function onExpand() {
  isExpand.value = !isExpand.value
  node.getDescendants()?.map((item) => item.setVisible(isExpand.value))
}

const onMouseup = function () {
  document.removeEventListener('mousemove', plusDargingStart)
  document.removeEventListener('mouseup', onMouseup)
  graph.plusDargComplete(node)
}

// shift + 添加按扭
const plusDargingStart = function (event) {
  graph.plusDargingStart(node, event)
}

function onDargdown(event) {
  graph.plusDargingStart(node, event)
  document.addEventListener('mousemove', plusDargingStart)
  document.addEventListener('mouseup', onMouseup)
}
</script>

<style lang="scss" scoped>
.flow-node {
  gap: 3px;
  width: 100%;
  height: 100%;
  padding: 8px 10px;
  font-size: 14px;
  // cursor: default;
  position: relative;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  border-radius: 3px;
  border-style: solid;
  border-color: #2e61b4;
  background: #fff;

  &--divider {
    height: 1px;
    min-height: 1px;
    margin: 0;
    padding: 0;
    align-self: stretch;
    background: rgba(46, 97, 180, 0.4);
  }

  &--name {
    width: 100%;
    min-height: 20px;
    color: #2e61b4;
    caret-color: red;
    border: 0;
    outline-color: #2e61b4;
    outline-style: dotted;
    outline-width: 0;
    border-radius: 2px;
    overflow: hidden;
    white-space: nowrap;
    word-break: break-all;
    text-overflow: ellipsis;
    background: transparent;
  }

  &--content {
    flex: 1;
    width: 100%;
    min-height: 18px;
    color: rgba(46, 97, 180, 0.4);
    caret-color: red;

    border: 0;
    outline-color: #2e61b4;
    outline-style: dotted;
    outline-width: 0;
    border-radius: 2px;

    font-size: 12px;
    background: transparent;

    resize: none;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  &--icon {
    right: 0;
    width: 20px;
    height: 20px;
    opacity: 0;
    z-index: 999999;
    cursor: pointer;
    position: absolute;
    position: absolute;
    transition: all 0.5s;

    &.plus {
      top: 5px;
    }
    &.arrow {
      bottom: 5px;
      border-radius: 50%;
    }
  }

  &:hover {
    .flow-node--icon {
      right: -24px;
      opacity: 1;
    }
  }

  &.project {
    background: #2e61b4;
    .flow-node--divider {
      background: rgba(255, 255, 255, 0.3);
    }

    .flow-node--name {
      color: #fff;
      outline-color: rgba(255, 255, 255, 0.3);
    }
    .flow-node--content {
      color: rgba(255, 255, 255, 0.3);
      outline-color: rgba(255, 255, 255, 0.3);
    }
  }

  &.moving {
    opacity: 0.5;
  }
}
</style>

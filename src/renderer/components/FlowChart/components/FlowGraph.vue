<template>
  <div ref="graphContainer" class="graph-container" />
</template>

<script setup>
import Hierarchy from '@antv/hierarchy'

import { ref, onMounted } from 'vue'
import { useNodeState } from '@/store/data/nodeState'
import FlowGraph from './'
import { config } from './constant'

const graphContainer = ref()
const { nodeData } = useNodeState()

onMounted(async () => {
  const flowGraph = new FlowGraph(graphContainer.value)
  // 组织数组结构
  const graphData = flowGraph.useDataFormater(nodeData)

  const renderGraph = () => {
    const cells = []
    const result = Hierarchy.mindmap(graphData, {
      direction: 'H',
      getHeight(d) {
        return d.height
      },
      getWidth(d) {
        return d.width
      },
      getHGap() {
        return config.nodeHorizontalGap
      },
      getVGap() {
        return config.nodeVerticalGap
      },
      getSide: () => {
        return 'right'
      },
    })

    const traverseCell = (node) => {
      if (node) {
        const { id, data, parent, children, x, y } = node
        if (node.id !== 'root') {
          cells.push(
            flowGraph.createNode({
              x,
              y,
              ...data,
              shape: 'vueshape',
              parent,
              zIndex: 1,
            })
          )
        }
        children?.forEach((item) => {
          if (id !== 'root') {
            cells.push(
              flowGraph.createEdge({
                shape: 'mindmap-edge',
                zIndex: 0,
                source: {
                  cell: id,
                  anchor: 'right',
                },
                target: {
                  cell: item.id,
                  anchor: 'left',
                },
              })
            )
          }
          traverseCell(item)
        })
      }
    }

    traverseCell(result)

    flowGraph.resetCells(cells)
    flowGraph.centerContent()
  }

  renderGraph()
})
</script>

<style lang="scss" scoped>
.graph-container {
  width: 100%;
  height: 100%;
}
</style>

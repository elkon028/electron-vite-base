import { Graph } from '@antv/x6'
import { Dnd } from '@antv/x6-plugin-dnd'

export class FlowDnd extends Dnd {
  constructor(options: Partial<Dnd.Options> & { target: Graph }) {
    super(options)
  }
  // 获取拖拽的 node
  getDraggingNode() {
    return this.draggingNode
  }
}

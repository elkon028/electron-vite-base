import type { Cell, Edge, Node, Point, Rectangle } from '@antv/x6'
import { Graph, Path } from '@antv/x6'
import { Selection } from '@antv/x6-plugin-selection'
import { register } from '@antv/x6-vue-shape'
import { FlowDnd } from './FlowDnd'

import { config } from './constant'
import { getDistance, getPointDistance, getTextSize } from './utils'

import NodeItem from './NodeItem.vue'

import emitter from './emitter'
import { getUuid } from '@/utils/other'
import { useNodeState } from '@/store/data/nodeState'
import type { Node as StroeNode } from '@/store/data/nodeState'
import { saveProjectFile } from '@/store/data/projectfile'

export interface FlowNode {
  id: string
  width: number
  height: number
  children: FlowNode[]
  data: StroeNode // 原始数据注入给组件渲染UI
}

export default class FlowChart extends Graph {
  FlowDnd: FlowDnd
  nodeStore = useNodeState()

  constructor(graphContainer: HTMLElement) {
    super({
      // see: https://x6.antv.antgroup.com/api/graph/graph
      container: graphContainer,
      grid: 1,
      // virtual: true,
      autoResize: true,
      mousewheel: {
        enabled: true,
      },
      panning: {
        enabled: true,
        eventTypes: ['rightMouseDown'],
      },
      connecting: {
        snap: true,
        connectionPoint: 'anchor',
      },
      interacting: {
        nodeMovable: (view) => {
          return view.cell.prop('movable')
        },
      },
    })

    this.FlowDnd = new FlowDnd({
      target: this,
      scaled: true,
      dndContainer: graphContainer,
    })

    // 添加插件
    this.use(
      new Selection({
        // see: https://x6.antv.antgroup.com/tutorial/plugins/selection
        strict: true,
        enabled: true,
        multiple: false,
        rubberband: false,
        showNodeSelectionBox: true,
        pointerEvents: 'none',
        className: 'flow-node-select',
      }),
    )
      .useShapeRegistor()
      .useEventListener()
  }

  useShapeRegistor() {
    // 注册 vue-shape 节点
    register({
      shape: 'vueshape',
      movable: true,
      component: NodeItem,
    })

    // 连线
    Graph.registerEdge(
      'mindmap-edge',
      {
        inherit: 'edge',
        connector: {
          name: 'mindmap',
        },
        attrs: {
          line: {
            targetMarker: '',
            stroke: '#2e61b4',
            strokeWidth: 1,
          },
        },
        zIndex: 0,
      },
      true,
    )

    // 连接器
    Graph.registerConnector(
      'mindmap',
      (sPoint, tPoint, _, args) => {
        const midX = sPoint.x + 30 // 延长线
        const midY = sPoint.y

        const ctrR = 30 // radius
        const ctrX = midX + ctrR / 2

        let diffYR = sPoint.y - tPoint.y
        let diffXR = sPoint.x - tPoint.x

        if (Math.abs(diffYR) > ctrR) {
          diffYR = diffYR > 0 ? ctrR : -ctrR
        }

        if (Math.abs(diffXR) > ctrR) {
          diffXR = diffXR > 0 ? ctrR : -ctrR
        }

        diffYR = diffYR / 2
        diffXR = diffXR / 2

        const pathData = [
          `M ${sPoint.x} ${sPoint.y}`,
          `L ${midX} ${midY}`,
          `Q ${ctrX} ${midY} ${ctrX} ${sPoint.y - diffYR}`,
          `L ${ctrX} ${tPoint.y + diffYR}`,
          `Q ${ctrX} ${tPoint.y} ${ctrX - diffXR} ${tPoint.y}`,
          `L ${tPoint.x} ${tPoint.y}`,
          // `L ${ctrX - diffXR * 2} ${tPoint.y}`,
        ].join(' ')
        return args.raw ? Path.parse(pathData) : pathData
      },
      true,
    )

    return this
  }

  useEventListener() {
    this.on('node:mouseenter', ({ node }) => {
      node.toFront({ deep: true })
    })
    this.on('node:mousedown', ({ e, node }) => {
      const shiftKey = e.shiftKey
      const isDiv = e.target.nodeName === 'DIV'
      // shiftKey = false 允许移动节点
      node.prop('movable', !shiftKey && isDiv)
      if (shiftKey && isDiv) {
        this.FlowDnd.start(node, e)
        const parent = node.getParent() as Node
        const dnode = this.FlowDnd.getDraggingNode() as Node
        this.draggingEdgeUpdate(parent, dnode)
      }
    })

    this.on('node:mousemove', ({ e, node, view }) => {
      const dnode = this.FlowDnd.getDraggingNode() as Node
      if (dnode) {
        // 所有子孙节点
        const descendants = node.getDescendants()?.map(item => item.id)
        // 拖拽的距离
        let dragDistance = Number.POSITIVE_INFINITY
        // 查找最近的节点
        const snode = this.getNodes()?.reduce((result: Node, item: Node): Node => {
          this.findView(item)?.unhighlight()
          const distance = getDistance(item, dnode)
          // bugfix 初始化，否则会缺失第一个节点
          if (!result.id) {
            result = item
          }
          // 父节点不能移动子节点
          if (distance < dragDistance && !descendants?.includes(item.id)) {
            dragDistance = distance
            result = item
          }
          return result
        }, {} as Node)

        const parent = node.getParent() as Node
        const overflow = dragDistance > config.overflowDistance
        const eventData = view.getEventData(e)

        this.draggingEdgeVisible(!overflow)

        eventData.embedNode = false
        eventData.embedBBox = dnode.getBBox()
        if (overflow) {
          eventData.embedNode = 'overflow'
        } else {
          if (node.id === snode.id) {
            // 未发生变化
            if (parent) {
              eventData.embedNode = parent
              this.findView(parent)?.highlight()
            }
            return this.draggingEdgeUpdate(parent, dnode)
          }
          eventData.embedNode = snode
          this.findView(snode)?.highlight()
          this.draggingEdgeUpdate(snode, dnode)
        }
      }
    })

    this.on('node:mouseup', ({ e, node, view }) => {
      this.draggingEdgeRemove()
      this.draggingNodeSave(node, view.getEventData(e))
    })

    this.on('blank:click', () => {
      emitter.emit('blankClick')
    })

    return this
  }

  useDataFormater(originalData: Array<StroeNode>): Record<string, any> {
    const formater = (originalData: Array<StroeNode>, border = false): Array<FlowNode> => {
      return originalData?.map((data: StroeNode) => {
        const borderWidth = border ? config.borderWidth : 0
        const { width, height } = getTextSize(data.name, data.content, borderWidth)
        return {
          id: getUuid(),
          width,
          height,
          data,
          children: formater(data.children, true),
        }
      })
    }
    // 必须创建一个根节点、以便渲染树型 layout
    return {
      id: 'root',
      x: 0,
      y: 0,
      // 整个树向右偏移量
      width: 100,
      height: 0,
      shape: 'circle',
      children: formater(originalData),
    }
  }

  getRootCell(cell: Cell): Cell | undefined {
    // 如果自己就是根，直接返回
    if (cell.shape === 'project' && !cell.parent) {
      return cell
    }
    return cell?.getAncestors({ deep: true })?.find((item: Cell) => item.shape === 'project' && !item.parent)
  }

  // 更新拖拽节点连线坐标
  draggingEdgeUpdate(snode: Node | null, tnode: Node) {
    const tBbox = tnode.getBBox() as Rectangle
    const target: Point.PointLike = { x: tBbox.x, y: tBbox.y + tBbox.height / 2 }
    let source: Point.PointLike = target

    if (snode) {
      const sBbox = snode.getBBox() as Rectangle
      source = { x: sBbox.x + sBbox.width, y: sBbox.y + sBbox.height / 2 }
    }

    let edge = this.getCellById('cloned-edge') as Edge
    if (!edge) {
      edge = this.addEdge({
        id: 'cloned-edge',
        shape: 'mindmap-edge',
        zIndex: 0,
        attrs: {
          line: {
            stroke: 'red',
            strokeDasharray: 5,
          },
        },
      })
    }

    edge?.setSource(source)
    edge?.setTarget(target)
  }

  // 删除拖拽节点连线
  draggingEdgeRemove() {
    this.getCellById('cloned-edge')?.remove()
  }

  // 设置拖拽节点连线的可见性
  draggingEdgeVisible(visible: boolean) {
    this.getCellById('cloned-edge')?.setVisible(visible)
  }

  // 更新拖拽节点连线起点
  edgeUpdateParent(tnode: Node, snode: Node) {
    const incomings = this.model.getIncomingEdges(tnode)
    if (incomings) {
      incomings.map(edge => edge.setSource(snode, { anchor: 'right' }))
    } else {
      this.addEdge({
        shape: 'mindmap-edge',
        zIndex: 0,
        source: {
          cell: snode.id,
          anchor: 'right',
        },
        target: {
          cell: tnode.id,
          anchor: 'left',
        },
      })
    }
  }

  // TOTO 布局指定节点下的子节点
  nodeLayoutReset(node: Node) {
    const bbox = node.getBBox()
    const children = node.getChildren()
    const result = children?.reduce(
      (result, item) => {
        const bbox = item.getBBox()
        result.count += 1
        result.totalHeight += bbox.height + config.nodeVerticalGap
        return result
      },
      { count: 0, totalHeight: 0 },
    )
  }

  // 保存节点父子关系
  async draggingNodeSave(node: Node, eventData: Record<string, any>) {
    this.startBatch('draggingNode')
    const { embedNode, embedBBox } = eventData
    if (!embedNode) {
      return false
    }

    let changed = false
    const parent = node.getParent()
    const isSelf = parent?.id === embedNode.id
    if (embedNode === 'overflow') {
      // 脱离父节点
      changed = true
      node.setParent(null)
      parent?.unembed(node)
      // 删除终点为当前节点的连线
      this.model.getIncomingEdges(node)?.map(edge => edge.remove())
      this.nodeStore.changeNodeParent(node.data.id, '')
      node.position(embedBBox.x, embedBBox.y, { deep: true })
    } else if (parent && isSelf) {
      // 未发生变化
      changed = false
      this.findView(parent)?.unhighlight()
    } else {
      // 父节点发生变化
      changed = true
      parent?.unembed(node)
      node.setParent(embedNode)
      embedNode.embed(node)
      this.findView(embedNode)?.unhighlight()
      this.edgeUpdateParent(node, embedNode)
      this.nodeStore.changeNodeParent(node.data.id, embedNode.data.id)
      const bbox = embedNode.getBBox()
      node.position(bbox.x + bbox.width + config.nodeHorizontalGap, bbox.y, { deep: true })
    }

    if (changed) {
      await saveProjectFile()
    }

    this.stopBatch('draggingNode')
  }

  // shift + 加号拖拽
  plusDargingStart(node: Node, event: MouseEvent): Node | boolean {
    const { clientX, clientY } = event
    const point = this.snapToGrid(clientX, clientY)
    const edge = this.getCellById('plus-edge') as Edge
    if (edge) {
      edge.setSource(node)
      edge.setTarget(point)
    } else {
      this.addEdge({
        id: 'plus-edge',
        zIndex: 0,
        source: node.id,
        target: point,
        router: 'er',
        connector: 'rounded',
        attrs: {
          line: {
            stroke: 'red',
            targetMarker: '',
            strokeDasharray: 5,
          },
        },
      })
    }
    // 所有祖先节点
    const ancestors = node.getAncestors()?.map(item => item.id)
    // 拖拽的距离
    let dragDistance = Number.POSITIVE_INFINITY
    // 查找最近的节点
    const snode = this.getNodes()?.reduce((result: Node, item: Node): Node => {
      this.findView(item)?.unhighlight()
      const distance = getPointDistance(item, point)
      // bugfix 初始化，否则会缺失第一个节点
      if (!result.id) {
        result = item
      }
      // 父节点不能移动子节点
      if (distance < dragDistance && !ancestors?.includes(item.id)) {
        dragDistance = distance
        result = item
      }
      return result
    }, {} as Node)

    node.prop('plusChild', '')
    if (snode && snode.id !== node.id) {
      const bbox = snode.getBBox()
      const rangeX = bbox.x + bbox.width
      const rangeY = bbox.y + bbox.height
      if (point.x > bbox.x && point.x < rangeX && point.y > bbox.y && point.y < rangeY) {
        this.findView(snode)?.highlight()
        node.prop('plusChild', snode.id)
        return true
      }
    }
    return false
  }

  async plusDargComplete(node: Node) {
    this.getCellById('plus-edge')?.remove()
    const childId = node.prop('plusChild')
    if (childId) {
      const child = this.getCellById(childId) as Node
      this.findView(child)?.unhighlight()

      // 设置新的父级
      const parent = child.getParent()
      parent?.unembed(child)
      child.setParent(node)
      node.embed(child)
      this.edgeUpdateParent(child, node)
      this.nodeStore.changeNodeParent(child.data.id, node.data.id)
      await saveProjectFile()
    }
  }
}

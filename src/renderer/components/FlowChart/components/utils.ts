import type { Node, Point } from '@antv/x6'
import { config } from './constant'

// 添加 px 单位
export function addUnit(value: number | string | null): string {
  if (value === null) {
    return ''
  }
  const REGEXP = /^-?\d+(\.\d+)?$/
  return REGEXP.test(`${value}`) ? `${value}px` : String(value)
}

// 返回节点 bbox 坐标的中点
export function midpoint(node: Node): Record<string, any> {
  const bbox = node.getBBox()
  return {
    ...bbox,
    cx: bbox.x + bbox.width / 2,
    cy: bbox.y + bbox.height / 2,
  }
}

// 返回两个节点中心点距离
export function getDistance(snode: Node, dnode: Node) {
  const sbbox = midpoint(snode)
  const dbbox = midpoint(dnode)

  const lineX = sbbox.cx - dbbox.cx
  const lineY = sbbox.cy - dbbox.cy
  // 勾股定律
  return Math.sqrt(lineX ** 2 + lineY ** 2)
}

export function getPointDistance(snode: Node, point: Point.PointLike) {
  const sbbox = midpoint(snode)

  const lineX = sbbox.cx - point.x
  const lineY = sbbox.cy - point.y
  // 勾股定律
  return Math.sqrt(lineX ** 2 + lineY ** 2)
}

export function getTextSize(name: string, content: string, border: number) {
  const elWrap: HTMLElement = document.createElement('div')
  const elName: HTMLElement = document.createElement('div')
  const elContent: HTMLElement = document.createElement('div')

  const result: Record<string, number> = {
    width: 0,
    height: 0,
  }

  elWrap.style.minWidth = `${config.minWidth}px`
  elWrap.style.maxWidth = `${config.maxWidth}px`
  elWrap.style.visibility = 'hidden'
  elWrap.style.display = 'inline-block'

  elName.style.width = '100%'
  elName.style.overflow = 'hidden'
  elName.style.wordBreak = 'break-all'
  elName.style.textOverflow = 'ellipsis'
  elName.style.fontSize = `${config.nameFontSize}px`
  elName.style.whiteSpace = 'nowrap'
  elName.style.display = 'inline-block'

  elContent.style.width = '100%'
  elContent.style.overflow = 'hidden'
  elContent.style.wordBreak = 'break-all'
  elContent.style.textOverflow = 'ellipsis'
  elContent.style.fontSize = `${config.contentFontSize}px`
  elContent.style.whiteSpace = 'normal'
  elContent.style.display = '-webkit-box'
  elContent.style.webkitLineClamp = '2'
  elContent.style.webkitBoxOrient = 'vertical'

  // innerText
  elName.textContent = name || ''
  elContent.textContent = content || '-'

  elWrap.appendChild(elName)
  elWrap.appendChild(elContent)

  document.body.appendChild(elWrap)

  result.width = Number.parseFloat(window.getComputedStyle(elWrap)?.width || '0')
  result.height = Number.parseFloat(window.getComputedStyle(elWrap)?.height || '0')

  result.width += config.paddingX * 2 + border * 2
  result.height += config.paddingY * 2 + 1 + border * 2

  document.body.removeChild(elWrap)

  return result
}

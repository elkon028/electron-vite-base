export const config: Record<string, number> = {
  maxWidth: 300, // 节点最大宽 px
  minWidth: 80, // 节点最小宽 px
  paddingY: 8, // 节点 y 方向 padding
  paddingX: 10, // 节点 x 方向值 padding
  borderWidth: 2, // 任务节点 border
  nameFontSize: 14, // 名称文字字号, 用以计算文本宽高
  contentFontSize: 12, // 描述文字字号, 用以计算文本宽高
  overflowDistance: 300, // 节点拖拽多少距离后，将其它设为项目
  nodeHorizontalGap: 40, // 节点水平方向布局间距
  nodeVerticalGap: 10, // 节点垂直方向布局间距
}

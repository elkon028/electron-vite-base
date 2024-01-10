export function isPromise(o: any) {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Promise'
}

export function isObject(o: any) {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Object'
}

export function isArray(o: any) {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Array'
}

export function isBoolean(o: any) {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Boolean'
}

export function isObjectAndArray(o: any) {
  return isObject(o) || isArray(o)
}

export function toJsonString(o: any) {
  if (isObjectAndArray(o)) {
    return JSON.stringify(o)
  }

  return o
}

// 移动数组元素到指定位置
export function moveArrayIndex(arr: Array<any>, fromIndex: number, toIndex: number) {
  const item = arr.splice(fromIndex, 1)[0] // 删除源位置的元素并保存
  arr.splice(toIndex, 0, item) // 在目标位置插入元素
  return arr // 返回修改后的数组
}

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
  if (isObjectAndArray(o)) { return JSON.stringify(o) }

  return o
}

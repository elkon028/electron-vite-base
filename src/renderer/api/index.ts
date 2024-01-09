import { ElMessage } from 'element-plus'

import { toJsonString } from '@/utils'

function errorMessage(message) {
  ElMessage({
    type: 'error',
    duration: 5000,
    grouping: true,
    message,
    dangerouslyUseHTMLString: true,
  })
}

/**
 *
 * @param {string} method 方法名称
 * @param {any} param 参数
 * @returns Promise
 */
const ipcRenderer = function (method: string, param?: any) {
  param = toJsonString(param)
  return new Promise(async (resolve, reject) => {
    const result = await window.ipc[method](param)
    console.log(`[${method}]返回====`, { ...result })
    if (result.code) {
      errorMessage(result.message)
      return reject(result)
    }
    return resolve(result)
  })
}

export {
  ipcRenderer,
}

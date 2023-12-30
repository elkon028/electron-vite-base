import { ElMessage } from 'element-plus'

function errorMessage(message) {
  ElMessage({
    type: 'error',
    duration: 5000,
    grouping: true,
    message,
    dangerouslyUseHTMLString: true,
  })
}

const ipc = {
  switchDark() {
    return new Promise(async (resolve, reject) => {
      const result = await window.ipc.switchDark()
      console.log('[switchDark]返回====', { ...result })
      if (result.code) {
        errorMessage(result.message)
        return reject(result)
      }
      return resolve(result)
    })
  },
}

export { ipc }

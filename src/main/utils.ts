export function successJson(data: Record<string, any> = {}): Record<string, any> {
  return {
    code: 0,
    message: '操作成功',
    ...data,
  }
}

export function errorJson(message: string = '操作失败'): Record<string, any> {
  return {
    code: 1,
    message,
  }
}

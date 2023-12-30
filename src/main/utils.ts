export function successJson(data: Record<string, any>): Record<string, any> {
  return {
    code: 0,
    ...data,
  }
}

export function errorJson(message: string): Record<string, any> {
  return {
    code: 1,
    message,
  }
}

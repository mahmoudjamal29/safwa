export const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !(value instanceof File)

export const hasFile = (data: unknown): boolean => {
  if (data instanceof File) {
    return true
  }

  if (Array.isArray(data)) {
    return data.some(hasFile)
  }

  if (isObject(data)) {
    return Object.values(data).some(hasFile)
  }

  return false
}

export const isValidNumber = (
  value: null | number | string | undefined | unknown
): boolean => {
  if (!value) return false
  return !isNaN(+value)
}

export { cn } from './cn'
export * from './formatters'
export * from './parsers'
export * from './query'

 
export function isFieldInvalid(field: { state: { meta: { errors?: string[]; isValid?: boolean } } }): boolean {
  return (field?.state?.meta?.errors?.length ?? 0) > 0 || field?.state?.meta?.isValid === false
}

/**
 * Query string parsers for nuqs integration
 */

import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsJson,
  parseAsString
} from 'nuqs'

// Common parsers
export const stringParser = parseAsString
export const integerParser = parseAsInteger
export const booleanParser = parseAsBoolean

// Array parsers
export const stringArrayParser = parseAsArrayOf(parseAsString)
export const integerArrayParser = parseAsArrayOf(parseAsInteger)
export const booleanArrayParser = parseAsArrayOf(parseAsBoolean)

// JSON parsers - parseAsJson requires a validator function
export const jsonParser = parseAsJson((value: unknown) => value)
export const objectParser = parseAsJson((value: unknown) => value)

// Custom parsers for data table
export const pageParser = parseAsInteger.withDefault(1)
export const perPageParser = parseAsInteger.withDefault(10)
export const searchParser = parseAsString.withDefault('')
export const sortParser = parseAsString.withDefault('')
export const orderParser = parseAsString.withDefault('desc')

// Filter parsers
export const filterParser = parseAsJson((value: unknown) => value).withDefault(
  {}
)
export const dateRangeParser = parseAsJson(
  (value: unknown) => value
).withDefault({ from: '', to: '' })
export const multiSelectParser = parseAsArrayOf(parseAsString).withDefault([])

// Table state parsers
export const paginationParser = parseAsJson(
  (value: unknown) => value
).withDefault({
  pageIndex: 0,
  pageSize: 10
})

export const sortingParser = parseAsArrayOf(
  parseAsJson((value: unknown) => value).withDefault({ desc: false, id: '' })
).withDefault([])

export const columnFiltersParser = parseAsArrayOf(
  parseAsJson((value: unknown) => value).withDefault({ id: '', value: null })
).withDefault([])

export const columnVisibilityParser = parseAsJson(
  (value: unknown) => value
).withDefault({})
export const rowSelectionParser = parseAsJson(
  (value: unknown) => value
).withDefault({})

// Advanced parsers
export const dateParser = parseAsString.withDefault('')
export const numberParser = parseAsInteger.withDefault(0)
export const floatParser = parseAsString.withDefault('0')

// Status parsers
export const statusParser = parseAsString.withDefault('all')
export const typeParser = parseAsString.withDefault('all')

// Export parsers
export const exportFormatParser = parseAsString.withDefault('csv')
export const exportColumnsParser = parseAsArrayOf(parseAsString).withDefault([])

// View parsers
export const viewModeParser = parseAsString.withDefault('table')
export const densityParser = parseAsString.withDefault('comfortable')

// Custom parser factory
export const createParser = <T>(
  defaultValue: T,
  serialize?: (value: T) => string,
  parse?: (value: string) => T
) => {
  return {
    withDefault: (defaultValue: T) => ({
      defaultValue,
      parse,
      serialize
    })
  }
}

// Table-specific parsers
export const tableParsers = {
  columnFilters: columnFiltersParser,
  columnVisibility: columnVisibilityParser,
  filters: filterParser,
  order: orderParser,
  page: pageParser,
  pagination: paginationParser,
  perPage: perPageParser,
  rowSelection: rowSelectionParser,
  search: searchParser,
  sort: sortParser,
  sorting: sortingParser
}

// Feature-specific parsers
export const createFeatureParsers = (feature: string) => ({
  categories: parseAsArrayOf(parseAsString).withDefault([]),
  dateFrom: parseAsString.withDefault(''),
  dateTo: parseAsString.withDefault(''),
  filters: parseAsJson((value: unknown) => value).withDefault({}),
  order: parseAsString.withDefault('desc'),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  search: parseAsString.withDefault(''),
  sort: parseAsString.withDefault('created_at'),
  status: parseAsString.withDefault('all'),
  tags: parseAsArrayOf(parseAsString).withDefault([]),
  type: parseAsString.withDefault('all')
})

// Admin parsers
export const adminParsers = createFeatureParsers('admin')

// Role parsers
export const roleParsers = createFeatureParsers('role')

// User parsers
export const userParsers = createFeatureParsers('user')

// Dashboard parsers
export const dashboardParsers = {
  compare: parseAsBoolean.withDefault(false),
  groupBy: parseAsString.withDefault('day'),
  metric: parseAsString.withDefault('all'),
  period: parseAsString.withDefault('7d')
}

// Profile parsers
export const profileParsers = {
  section: parseAsString.withDefault('personal'),
  tab: parseAsString.withDefault('general')
}

// Settings parsers
export const settingsParsers = {
  language: parseAsString.withDefault('en'),
  section: parseAsString.withDefault('basic'),
  tab: parseAsString.withDefault('general'),
  theme: parseAsString.withDefault('system'),
  timezone: parseAsString.withDefault('UTC')
}

// Audit parsers
export const auditParsers = {
  action: parseAsString.withDefault('all'),
  dateFrom: parseAsString.withDefault(''),
  dateTo: parseAsString.withDefault(''),
  level: parseAsString.withDefault('all'),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),
  search: parseAsString.withDefault(''),
  user: parseAsString.withDefault('all')
}

// Notification parsers
export const notificationParsers = {
  dateFrom: parseAsString.withDefault(''),
  dateTo: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(20),
  search: parseAsString.withDefault(''),
  status: parseAsString.withDefault('all'),
  type: parseAsString.withDefault('all')
}

// Export all parsers
export const parsers = {
  boolean: booleanParser,
  booleanArray: booleanArrayParser,
  integer: integerParser,
  integerArray: integerArrayParser,
  json: jsonParser,
  object: objectParser,
  // Common
  string: stringParser,
  stringArray: stringArrayParser,

  // Table
  ...tableParsers,

  // Features
  admin: adminParsers,
  audit: auditParsers,
  dashboard: dashboardParsers,
  notification: notificationParsers,
  profile: profileParsers,
  role: roleParsers,
  settings: settingsParsers,
  user: userParsers
}

// Parser utilities
export const createQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(`${key}[]`, String(item)))
      } else if (typeof value === 'object') {
        searchParams.append(key, JSON.stringify(value))
      } else {
        searchParams.append(key, String(value))
      }
    }
  })

  return searchParams.toString()
}

export const parseQueryString = (queryString: string): Record<string, any> => {
  const params = new URLSearchParams(queryString)
  const result: Record<string, any> = {}

  for (const [key, value] of params.entries()) {
    if (key.endsWith('[]')) {
      const arrayKey = key.slice(0, -2)
      if (!result[arrayKey]) {
        result[arrayKey] = []
      }
      result[arrayKey].push(value)
    } else {
      try {
        result[key] = JSON.parse(value)
      } catch {
        result[key] = value
      }
    }
  }

  return result
}

// Parser validation
export const validateParser = (parser: any, value: any): boolean => {
  try {
    parser.parse(value)
    return true
  } catch {
    return false
  }
}

// Parser with validation
export const createValidatedParser = <T>(
  parser: any,
  validator: (value: T) => boolean
) => {
  return {
    ...parser,
    parse: (value: string) => {
      const parsed = parser.parse(value)
      if (!validator(parsed)) {
        throw new Error('Invalid value')
      }
      return parsed
    }
  }
}

// Sorting state parser for TanStack Table
export const getSortingStateParser = <TData>(columnIds: Set<string>) => {
  return parseAsArrayOf(
    parseAsJson((value: unknown) => value).withDefault({ desc: false, id: '' })
  ).withDefault([])
}

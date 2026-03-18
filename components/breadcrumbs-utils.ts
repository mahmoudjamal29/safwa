/**
 * Mapping of URL segments to breadcrumb translation keys.
 */
export const SEGMENT_MAP: Record<string, { key: string }> = {
  administration: { key: 'administration' },
  admins: { key: 'admins' },
  amenities: { key: 'amenities' },
  'bank-accounts': { key: 'bankAccounts' },
  bookings: { key: 'bookings' },
  'cancellation-policy': { key: 'cancellationPolicy' },
  categories: { key: 'categories' },
  centers: { key: 'centers' },
  cities: { key: 'cities' },
  companies: { key: 'companies' },
  config: { key: 'spaceConfigurations' },
  configs: { key: 'configs' },
  countries: { key: 'countries' },
  // Actions
  create: { key: 'create' },
  'create-order': { key: 'createOrder' },
  currencies: { key: 'currencies' },
  customers: { key: 'customers' },
  // Main routes
  dashboard: { key: 'dashboard' },
  doors: { key: 'doors' },

  edit: { key: 'edit' },
  'edit-city': { key: 'editCity' },
  'edit-country': { key: 'editCountry' },
  'edit-order': { key: 'editOrder' },
  'edit-state': { key: 'editState' },
  'edit-vendor': { key: 'editVendor' },
  faq: { key: 'faq' },
  financial: { key: 'financial' },
  floors: { key: 'floors' },
  // Sub-routes
  groups: { key: 'groups' },
  info: { key: 'info' },
  invoices: { key: 'invoices' },
  layouts: { key: 'layouts' },
  locations: { key: 'locations' },
  'my-notifications': { key: 'myNotifications' },
  nationalities: { key: 'nationalities' },
  news: { key: 'news' },
  notifications: { key: 'notifications' },
  operations: { key: 'operations' },
  orders: { key: 'orders' },
  pricing: { key: 'pricing' },
  // Public pages
  'privacy-policy': { key: 'privacy-policy' },
  'product-categories': { key: 'productCategories' },
  products: { key: 'products' },
  profile: { key: 'profile' },
  purchases: { key: 'purchases' },
  requests: { key: 'requests' },
  roles: { key: 'roles' },
  settings: { key: 'settings' },
  spaces: { key: 'spaces' },
  states: { key: 'states' },
  support: { key: 'support' },

  taxes: { key: 'taxes' },
  'terms-conditions': { key: 'terms-conditions' },
  tickets: { key: 'tickets' },
  transactions: { key: 'transactions' },
  types: { key: 'types' },
  user: { key: 'user' },
  users: { key: 'users' },

  vendors: { key: 'vendors' },
  view: { key: 'view' }
} as const

/**
 * Segments that are never real pages by themselves.
 * These are intermediate path segments used only as prefixes for dynamic routes.
 *
 * Patterns supported:
 * - 'segment' - exact match (e.g., 'user' matches only 'user')
 * - 'segment/*' - matches the segment AND any ID that follows it
 *                 (e.g., 'layouts/*' makes 'layouts/123' non-navigable)
 *
 * These segments will show in breadcrumbs but be disabled (non-clickable).
 */
export const NON_NAVIGABLE_SEGMENTS: string[] = [
  'user', // /customers/user/:id/* - "user" is just a path prefix
  'users', // /companies/:id/users/:user_id/* - "users" is just a path prefix
  'layouts',
  'layouts/*', // Makes both 'layouts' and 'layouts/:id' non-navigable
  'settings',
  'admins',
  'admins/*',
  'roles',
  'floors/*', // Make 'floor/:id/ non-navigable
  'pricing',
  'pricing/*',
  'types',
  'types/*',
  'amenities',
  'amenities/*',
  'operations',
  'financial',
  'purchases',
  'vendors/*',
  'categories/*',
  'products/*',
  'orders/*',
  'support',
  'faq/*',
  'news/*',
  'notifications/*',
  'countries',
  'states',
  'states/*',
  'cities',
  'nationalities/*',
  'currencies/*',
  'taxes/*',
  'bank-accounts/*'
]

// Types
export interface BreadcrumbItemData {
  disabled?: boolean
  href: null | string
  isActive: boolean
  title?: string
}

/**
 * Formats a segment into a human-readable title using the provided translator.
 */
export function formatSegmentTitle(
  segment: string,
  t: Translations<'components.breadcrumbs'>,
  resourceName?: string,
  isResourceIdSegment?: boolean
): string {
  // Handle resource IDs
  if (isResourceId(segment)) {
    // If this is a resource ID and we have a resource name, use it
    if (isResourceIdSegment && resourceName) {
      return resourceName
    }
    // Otherwise show as #ID
    return `#${segment}`
  }

  // Use translation if available
  const translationConfig = SEGMENT_MAP[segment]
  if (translationConfig) {
    return t(`segments.${translationConfig.key}` as never)
  }

  // Fallback: capitalize and replace hyphens with spaces
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Generate breadcrumb items from pathname
 */
export function generateBreadcrumbItems(
  pathname: string,
  t: Translations<'components.breadcrumbs'>,
  resourceName?: string
): BreadcrumbItemData[] {
  // Don't show breadcrumbs on home/dashboard page
  if (pathname === '/' || pathname === '/dashboard') {
    return []
  }

  const segments = pathname.split('/').filter(Boolean)
  const items: BreadcrumbItemData[] = [{ href: '/dashboard', isActive: false }]

  let currentPath = ''
  let resourceNameUsed = false

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    const isLast = i === segments.length - 1

    currentPath += `/${segment}`

    // Check if this segment is non-navigable (no standalone page)
    const prevSegment = i > 0 ? segments[i - 1] : null
    const isNonNavigable = isSegmentNonNavigable(segment, prevSegment)

    // Determine if this segment is a resource ID (numeric/UUID that follows a parent segment)
    const isResourceIdSegment = isResourceId(segment) && prevSegment !== null

    // Mark resource name as used when we encounter the first resource ID
    if (isResourceIdSegment && !resourceNameUsed) {
      resourceNameUsed = true
    }

    // Format the title
    const title = formatSegmentTitle(
      segment,
      t,
      resourceName,
      isResourceIdSegment
    )

    // Determine href:
    // - Last segment (current page): no link
    // - Non-navigable segments: no link, marked as disabled
    // - Others: link to the path
    const href = isLast || isNonNavigable ? null : currentPath

    items.push({
      disabled: isNonNavigable && !isLast,
      href,
      isActive: isLast,
      title
    })
  }

  return items
}

/**
 * Check if a segment is a resource identifier (numeric ID or UUID).
 */
export function isResourceId(segment: string): boolean {
  // Numeric ID
  if (!isNaN(Number(segment)) && !isNaN(parseFloat(segment))) {
    return true
  }
  // UUID format
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (uuidPattern.test(segment)) {
    return true
  }
  return false
}

/**
 * Check if a segment is non-navigable based on NON_NAVIGABLE_SEGMENTS patterns.
 *
 * Patterns supported:
 * - 'segment' - exact match
 * - 'segment/*' - matches the segment AND any resource ID that follows it
 *
 * @param segment - The current segment to check
 * @param prevSegment - The previous segment (used for wildcard pattern matching)
 * @returns true if the segment should be non-navigable
 */
export function isSegmentNonNavigable(
  segment: string,
  prevSegment: null | string
): boolean {
  // Check exact match
  if (NON_NAVIGABLE_SEGMENTS.includes(segment)) {
    return true
  }

  // Check wildcard patterns: if previous segment matches 'pattern/*',
  // and current segment is a resource ID, then current is non-navigable
  if (prevSegment) {
    const wildcardPattern = `${prevSegment}/*`
    if (
      NON_NAVIGABLE_SEGMENTS.includes(wildcardPattern) &&
      isResourceId(segment)
    ) {
      return true
    }
  }

  return false
}

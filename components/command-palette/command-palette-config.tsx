import {
  BriefcaseBusinessIcon,
  CalendarPlusIcon,
  FolderTreeIcon,
  HelpCircleIcon,
  PlusIcon,
  SettingsIcon,
  UserCogIcon,
  UsersIcon
} from 'lucide-react'

import { PERMISSIONS } from '@/lib/auth/permissions'

import { type Admin, adminsInfiniteOptions } from '@/query/admins'
import {
  type City,
  type CityListParams,
  getAllCitiesQuery,
  getAllStatesQuery,
  type State,
  type StateListParams
} from '@/query/area'
import {
  type Booking,
  type BookingListParams,
  getAllBookingsQuery
} from '@/query/bookings'
import { type Center, getAllCentersInfiniteQuery } from '@/query/centers'
import { type Company, getAllCompaniesInfiniteQuery } from '@/query/companies'
import {
  type Country,
  type CountryListParams,
  getAllCountriesQuery
} from '@/query/countries'
import {
  type Currency,
  type CurrencyListParams,
  getAllCurrenciesQuery
} from '@/query/currencies'
import {
  type Door,
  type DoorsListParams,
  getAllDoorsInfiniteQuery
} from '@/query/doors/'
import { type Faq, type FaqsListParams, getAllFaqsQuery } from '@/query/faqs/'
import {
  type Floor,
  type FloorsListParams,
  getAllFloorsQuery
} from '@/query/floors'
import {
  getAllInvoicesQuery,
  type Invoice,
  type InvoicesListParams
} from '@/query/invoices/'
import {
  getAllNationalitiesQuery,
  type Nationality,
  type NationalityListParams
} from '@/query/nationalities/'
import {
  getAllOrdersQuery,
  type Order,
  type OrdersListParams
} from '@/query/orders/'
import {
  getAllProductCategoriesQuery,
  type ProductCategoriesListParams,
  type ProductCategory
} from '@/query/product-categories/'
import {
  getAllProductsQuery,
  type Product,
  type ProductsListParams
} from '@/query/products/'
import { getAllRolesInfiniteQuery, type RolesListParams } from '@/query/roles/'
import type { Role } from '@/query/roles/roles-types'
import {
  getAllSpaceAmenitiesInfiniteQuery,
  type SpaceAmenitiesListParams,
  type SpaceAmenity
} from '@/query/space-amenities/'
import {
  getAllSpacePricingTemplateInfiniteQuery,
  type SpacePricingTemplate,
  type SpacePricingTemplatesListParams
} from '@/query/space-pricing-templates/'
import {
  getAllSpaceTypesInfiniteQuery,
  type SpaceType,
  type SpaceTypesListParams
} from '@/query/space-types/'
import {
  getAllTaxesQuery,
  type TaxesListParams,
  type TaxType
} from '@/query/taxes/'
import {
  getAllUserGroupsInfiniteQuery,
  type UserGroup,
  type UserGroupsListParams
} from '@/query/user-groups/'
import {
  getAllUserJoinRequestsInfiniteQuery,
  type UserRequest
} from '@/query/user-requests/'
import {
  getAllUsersInfiniteQuery,
  type User,
  type UsersListParams
} from '@/query/users'
import {
  getAllVendorsInfiniteQuery,
  type Vendor,
  type VendorsListParams
} from '@/query/vendors/'
import { getAllSpacesInfiniteQuery, type Workspace } from '@/query/workspace/'

import type {
  CommandPaletteConfig,
  CommandPaletteGroup,
  CommandPaletteItem
} from '@/components/command-palette/command-palette-types'
import { Flex } from '@/components/data-table/columns/flex'
import {
  BuildingIcon,
  ChairIcon,
  HomeIcon,
  InventoryIcon,
  PaperIcon
} from '@/components/icons'

export {
  type CommandPaletteConfig,
  type CommandPaletteGroup,
  type CommandPaletteItem
}

function localizeCommandPaletteConfig(
  config: CommandPaletteConfig,
  t: Translations<'components.commandPalette'>
): CommandPaletteConfig {
  return config.map((group) => ({
    ...group,
    heading: group.heading
      ? translateCommandPaletteText(t, group.heading)
      : undefined,
    items: group.items.map((item) => localizeCommandPaletteItem(item, t))
  }))
}

function localizeCommandPaletteItem(
  item: CommandPaletteItem,
  t: Translations<'components.commandPalette'>
): CommandPaletteItem {
  const localizedItem: CommandPaletteItem = {
    ...item,
    children: translateCommandPaletteText(t, item.children),
    keywords: localizeKeywords(t, item.keywords)
  }

  if (item.searchConfig) {
    localizedItem.searchConfig = {
      ...item.searchConfig,
      actionsHeading: item.searchConfig.actionsHeading
        ? translateCommandPaletteText(t, item.searchConfig.actionsHeading)
        : item.searchConfig.actionsHeading,
      children: item.searchConfig.children?.map((child) => ({
        ...child,
        keywords: localizeKeywords(t, child.keywords),
        label: translateCommandPaletteText(t, child.label)
      })),
      heading: translateCommandPaletteText(t, item.searchConfig.heading),
      placeholder: item.searchConfig.placeholder
        ? translateCommandPaletteText(t, item.searchConfig.placeholder)
        : item.searchConfig.placeholder
    }
  }

  if (item.parentConfig) {
    localizedItem.parentConfig = {
      tabs: item.parentConfig.tabs.map((tab) => ({
        ...tab,
        items: tab.items.map((tabItem) =>
          localizeCommandPaletteItem(tabItem, t)
        ),
        keywords: localizeKeywords(t, tab.keywords),
        label: translateCommandPaletteText(t, tab.label)
      }))
    }
  }

  return localizedItem
}

function localizeKeywords(
  t: Translations<'components.commandPalette'>,
  keywords?: string[]
): string[] | undefined {
  if (!keywords?.length) {
    return keywords
  }

  const localized = keywords.map((keyword) =>
    translateCommandPaletteText(t, keyword)
  )

  return Array.from(new Set([...keywords, ...localized]))
}

function toCommandPaletteTextKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function translateCommandPaletteText(
  t: Translations<'components.commandPalette'>,
  value: string
): string {
  if (value.startsWith('text.')) {
    return t(value as never)
  }

  const key = `text.${toCommandPaletteTextKey(value)}` as never
  return t.has(key) ? t(key) : value
}

export const createCommandPaletteConfig = (
  t: Translations<'components.commandPalette'>
): CommandPaletteConfig => {
  const config: CommandPaletteConfig = [
    {
      heading: 'text.main',
      id: 'admin',
      items: [
        {
          children: 'text.dashboard',
          href: '/',
          icon: HomeIcon,
          id: 'dashboard',
          keywords: ['home', 'main', 'overview', 'stats', 'statistics']
        },
        {
          children: 'text.user_management',
          icon: UserCogIcon,
          id: 'administration',
          keywords: [
            'administration',
            'admin',
            'admins',
            'roles',
            'permissions'
          ],
          parentConfig: {
            tabs: [
              {
                id: 'admins',
                items: [
                  {
                    children: 'text.admins',
                    href: '/administration?tab=admins',
                    icon: UserCogIcon,
                    id: 'administration-admins',
                    keywords: ['admin', 'admins', 'users', 'administrators'],
                    requiredPermission: PERMISSIONS.ADMINS_SHOW
                  },
                  {
                    children: 'text.create_admin',
                    href: '/administration/admins/create',
                    icon: PlusIcon,
                    id: 'administration-admins-create',
                    keywords: [
                      'new admin',
                      'add admin',
                      'create admin',
                      'admin'
                    ],
                    requiredPermission: PERMISSIONS.ADMINS_CREATE
                  },
                  {
                    children: 'text.search_admins',
                    closeOnSelect: false,
                    icon: UserCogIcon,
                    id: 'administration-admins-search',
                    keywords: [
                      'search admins',
                      'find admin',
                      'admin search',
                      'administrators'
                    ],
                    requiredPermission: PERMISSIONS.ADMINS_SHOW,
                    searchConfig: {
                      actionsHeading: 'text.admin_actions',
                      children: [
                        {
                          href: (id: string) => `/administration/admins/${id}`,
                          id: 'edit',
                          label: 'text.edit'
                        }
                      ] as const,
                      heading: 'text.admins',
                      infinite: true,
                      labelKey: 'name',
                      pageId: 'admins',
                      placeholder: 'text.search_admins',
                      queryOptions: adminsInfiniteOptions,
                      renderItem: (admin: Admin) => (
                        <Flex
                          avatar={admin.image_url}
                          subtitle={admin.email}
                          title={admin.name}
                        />
                      ),
                      valueKey: 'id'
                    }
                  }
                ],
                label: 'text.admins'
              },
              {
                id: 'roles',
                items: [
                  {
                    children: 'text.roles',
                    href: '/administration?tab=roles',
                    icon: UserCogIcon,
                    id: 'administration-roles',
                    keywords: ['roles', 'permissions', 'role'],
                    requiredPermission: PERMISSIONS.ROLES_SHOW
                  },
                  {
                    children: 'text.create_role',
                    href: '/administration/roles/create',
                    icon: PlusIcon,
                    id: 'administration-roles-create',
                    keywords: ['new role', 'add role', 'create role', 'role'],
                    requiredPermission: PERMISSIONS.ROLES_CREATE
                  },
                  {
                    children: 'text.search_roles',
                    closeOnSelect: false,
                    icon: UserCogIcon,
                    id: 'administration-roles-search',
                    keywords: [
                      'search roles',
                      'find role',
                      'role search',
                      'permissions'
                    ],
                    requiredPermission: PERMISSIONS.ROLES_SHOW,
                    searchConfig: {
                      actionsHeading: 'text.role_actions',
                      children: [
                        {
                          href: (id: string) => `/administration/roles/${id}`,
                          id: 'edit',
                          label: 'text.edit'
                        }
                      ] as const,
                      heading: 'text.roles',
                      infinite: true,
                      labelKey: 'name',
                      pageId: 'roles',
                      placeholder: 'text.search_roles',
                      queryOptions: (params: RolesListParams) =>
                        getAllRolesInfiniteQuery({ ...params, per_page: 20 }),
                      renderItem: (role: Role) => (
                        <Flex subtitle={role.description} title={role.name} />
                      ),
                      valueKey: 'id'
                    }
                  }
                ],
                label: 'text.roles'
              }
            ]
          }
        }
      ]
    },
    {
      heading: 'text.customers',
      id: 'account',
      items: [
        {
          children: 'text.customers',
          icon: UsersIcon,
          id: 'customers',
          keywords: ['customers', 'users', 'people', 'clients', 'groups'],
          parentConfig: {
            tabs: [
              {
                id: 'users',
                items: [
                  {
                    children: 'text.list',
                    href: '/customers',
                    icon: UsersIcon,
                    id: 'customers-main',
                    keywords: ['customers', 'users', 'people', 'clients']
                  },
                  {
                    children: 'text.search_customers',
                    closeOnSelect: false,
                    icon: UsersIcon,
                    id: 'customers-users-search',
                    keywords: [
                      'search users',
                      'find user',
                      'user search',
                      'search customers',
                      'find customer'
                    ],
                    searchConfig: {
                      actionsHeading: 'text.customer_actions',
                      children: [
                        {
                          href: (userId: string) => `/customers/user/${userId}`,
                          id: 'info',
                          label: 'text.info'
                        },
                        {
                          href: (userId: string) =>
                            `/customers/user/${userId}/edit`,
                          id: 'edit',
                          label: 'text.edit'
                        },
                        {
                          href: (userId: string) =>
                            `/customers/user/${userId}?tab=requests`,
                          id: 'requests',
                          label: 'text.requests'
                        },
                        {
                          href: (userId: string) =>
                            `/customers/user/${userId}?tab=offers`,
                          id: 'offers',
                          label: 'text.offers'
                        },
                        {
                          href: (userId: string) =>
                            `/customers/user/${userId}?tab=contracts`,
                          id: 'contracts',
                          label: 'text.contracts'
                        },
                        {
                          href: (userId: string) =>
                            `/customers/user/${userId}?tab=bookings`,
                          id: 'bookings',
                          label: 'text.bookings'
                        },
                        {
                          href: (userId: string) =>
                            `/customers/user/${userId}?tab=invoices`,
                          id: 'invoices',
                          label: 'text.invoices',
                          requiredPermission: PERMISSIONS.INVOICES_SHOW
                        },
                        {
                          href: (userId: string) =>
                            `/customers/user/${userId}?tab=subscriptions`,
                          id: 'subscriptions',
                          label: 'text.subscriptions'
                        },
                        {
                          href: (userId: string) =>
                            `/customers/user/${userId}?tab=services`,
                          id: 'services',
                          label: 'text.services'
                        },
                        {
                          href: (userId: string) =>
                            `/customers/user/${userId}?tab=support`,
                          id: 'support',
                          label: 'text.support'
                        }
                      ] as const,
                      heading: 'text.customers',
                      infinite: true,
                      labelKey: 'name',
                      pageId: 'users',
                      placeholder: 'text.search_customers',
                      queryOptions: (params: UsersListParams) =>
                        getAllUsersInfiniteQuery({ ...params, per_page: 20 }),
                      renderItem: (user: User) => (
                        <Flex
                          avatar={user.image_url}
                          subtitle={user.email}
                          title={user.name}
                        />
                      ),
                      valueKey: 'id'
                    }
                  },
                  {
                    children: 'text.create_user',
                    href: '/customers/user/create',
                    icon: PlusIcon,
                    id: 'customers-users-create',
                    keywords: ['new user', 'add user', 'create user', 'user']
                  }
                ],
                label: 'text.list'
              },
              {
                id: 'groups',
                items: [
                  {
                    children: 'text.customer_groups',
                    href: '/customers/groups',
                    icon: UsersIcon,
                    id: 'customers-groups',
                    keywords: ['groups', 'customer groups']
                  },
                  {
                    children: 'text.search_groups',
                    closeOnSelect: false,
                    icon: UsersIcon,
                    id: 'customers-groups-search',
                    keywords: [
                      'search groups',
                      'find group',
                      'group search',
                      'user groups'
                    ],
                    requiredPermission: PERMISSIONS.USER_GROUPS_SHOW,
                    searchConfig: {
                      actionsHeading: 'text.group_actions',
                      children: [
                        {
                          href: (id: string) => `/customers/groups/${id}`,
                          id: 'users',
                          label: 'text.users'
                        },
                        {
                          href: (id: string) => `/customers/groups/${id}/edit`,
                          id: 'edit',
                          label: 'text.edit'
                        }
                      ] as const,
                      heading: 'text.groups',
                      infinite: true,
                      labelKey: 'name',
                      pageId: 'groups',
                      placeholder: 'text.search_groups',
                      queryOptions: (params: UserGroupsListParams) =>
                        getAllUserGroupsInfiniteQuery({
                          ...params
                        }),
                      renderItem: (group: UserGroup) => (
                        <Flex
                          subtitle={
                            group.users_count !== undefined
                              ? `${group.users_count} users`
                              : undefined
                          }
                          title={group.name}
                        />
                      ),
                      valueKey: 'id'
                    }
                  },
                  {
                    children: 'text.create_customer_group',
                    href: '/customers/groups/create',
                    icon: PlusIcon,
                    id: 'customers-groups-create',
                    keywords: [
                      'new group',
                      'add group',
                      'create group',
                      'group'
                    ]
                  }
                ],
                label: 'text.customer_groups'
              }
            ]
          }
        },
        {
          children: 'text.companies',
          icon: BriefcaseBusinessIcon,
          id: 'companies',
          keywords: ['companies', 'business', 'organizations', 'orgs'],
          parentConfig: {
            tabs: [
              {
                id: 'companies',
                items: [
                  {
                    children: 'text.list',
                    href: '/companies',
                    icon: BriefcaseBusinessIcon,
                    id: 'companies-list',
                    keywords: ['companies', 'business', 'organizations', 'orgs']
                  },
                  {
                    children: 'text.search_companies',
                    closeOnSelect: false,
                    icon: BriefcaseBusinessIcon,
                    id: 'companies-search',
                    keywords: [
                      'search companies',
                      'find company',
                      'company search'
                    ],
                    requiredPermission: PERMISSIONS.COMPANIES_SHOW,
                    searchConfig: {
                      actionsHeading: 'text.company_actions',
                      children: [
                        {
                          href: (id: string) => `/companies/${id}`,
                          id: 'profile',
                          label: 'text.profile'
                        },
                        {
                          href: (id: string) => `/companies/${id}/edit`,
                          id: 'edit',
                          label: 'text.edit'
                        },
                        {
                          href: (id: string) => `/companies/${id}/users/create`,
                          id: 'create-user',
                          label: 'text.create_user'
                        },
                        {
                          href: (id: string) => `/companies/${id}?tab=members`,
                          id: 'members',
                          label: 'text.members'
                        },
                        {
                          href: (id: string) => `/companies/${id}?tab=pending`,
                          id: 'pending',
                          label: 'text.pending'
                        },
                        {
                          href: (id: string) => `/companies/${id}?tab=requests`,
                          id: 'requests',
                          label: 'text.requests',
                          requiredPermission:
                            PERMISSIONS.USER_INVITE_REQUESTS_SHOW
                        },
                        {
                          href: (id: string) => `/companies/${id}?tab=offers`,
                          id: 'offers',
                          label: 'text.offers'
                        },
                        {
                          href: (id: string) =>
                            `/companies/${id}?tab=contracts`,
                          id: 'contracts',
                          label: 'text.contracts'
                        },
                        {
                          href: (id: string) => `/companies/${id}?tab=bookings`,
                          id: 'bookings',
                          label: 'text.bookings'
                        },
                        {
                          href: (id: string) => `/companies/${id}?tab=invoices`,
                          id: 'invoices',
                          label: 'text.invoices',
                          requiredPermission: PERMISSIONS.INVOICES_SHOW
                        },
                        {
                          href: (id: string) =>
                            `/companies/${id}?tab=subscriptions`,
                          id: 'subscriptions',
                          label: 'text.subscriptions'
                        },
                        {
                          href: (id: string) => `/companies/${id}?tab=services`,
                          id: 'services',
                          label: 'text.services'
                        },
                        {
                          href: (id: string) => `/companies/${id}?tab=support`,
                          id: 'support',
                          label: 'text.support'
                        }
                      ] as const,
                      heading: 'text.companies',
                      infinite: true,
                      labelKey: 'name',
                      pageId: 'companies',
                      placeholder: 'text.search_companies',
                      queryOptions: getAllCompaniesInfiniteQuery,
                      renderItem: (company: Company) => (
                        <Flex
                          avatar={company.image_url}
                          subtitle={company.phone}
                          title={company.name}
                          variants={{
                            subtitle: {
                              variant: 'phone'
                            }
                          }}
                        />
                      ),
                      valueKey: 'id'
                    }
                  },
                  {
                    children: 'text.search_company_users',
                    closeOnSelect: false,
                    icon: UsersIcon,
                    id: 'companies-users-search',
                    keywords: [
                      'search company users',
                      'company members',
                      'users'
                    ],
                    searchConfig: {
                      actionsHeading: 'text.company_user_actions',
                      children: [
                        {
                          href: (value: string) => {
                            const [companyId, userId] = value.split(':')
                            return `/companies/${companyId}/users/${userId}/edit`
                          },
                          id: 'edit',
                          label: 'text.edit'
                        }
                      ] as const,
                      getItemValue: (user: User) =>
                        user.company_id
                          ? `${user.company_id}:${user.id}`
                          : `${user.id}`,
                      heading: 'text.company_users',
                      infinite: true,
                      labelKey: 'name',
                      pageId: 'company-users',
                      placeholder: 'text.search_company_users',
                      queryOptions: (params: UsersListParams) =>
                        getAllUsersInfiniteQuery({ ...params, per_page: 20 }),
                      renderItem: (user: User) => (
                        <Flex
                          avatar={user.image_url}
                          subtitle={user.company?.name ?? user.email}
                          title={user.name}
                        />
                      ),
                      valueKey: 'id'
                    }
                  },
                  {
                    children: 'text.create_company',
                    href: '/companies/create',
                    icon: PlusIcon,
                    id: 'companies-create',
                    keywords: [
                      'new company',
                      'add company',
                      'create company',
                      'company'
                    ]
                  }
                ],
                label: 'text.companies'
              }
            ]
          }
        }
      ]
    },
    {
      heading: 'text.structure',
      id: 'structure',
      items: [
        {
          children: 'text.centers',
          icon: BuildingIcon,
          id: 'centers',
          keywords: ['centers', 'buildings', 'locations'],
          parentConfig: {
            tabs: [
              {
                id: 'centers',
                items: [
                  {
                    children: 'text.list',
                    href: '/centers',
                    icon: BuildingIcon,
                    id: 'centers-list',
                    keywords: ['centers', 'buildings', 'locations']
                  },
                  {
                    children: 'text.floors',
                    href: '/centers/floors',
                    icon: BuildingIcon,
                    id: 'centers-floors',
                    keywords: ['floors', 'floor', 'levels']
                  },
                  {
                    children: 'text.create_floor',
                    href: '/centers/floors/create',
                    icon: PlusIcon,
                    id: 'centers-floors-create',
                    keywords: [
                      'new floor',
                      'add floor',
                      'create floor',
                      'floor'
                    ],
                    requiredPermission: PERMISSIONS.FLOORS_CREATE
                  },
                  {
                    children: 'text.doors',
                    href: '/centers/doors',
                    icon: BuildingIcon,
                    id: 'centers-doors',
                    keywords: ['doors', 'door', 'access']
                  },
                  {
                    children: 'text.search_doors',
                    closeOnSelect: false,
                    icon: BuildingIcon,
                    id: 'centers-doors-search',
                    keywords: ['search doors', 'find door', 'door search'],
                    searchConfig: {
                      actionsHeading: 'text.door_actions',
                      children: [
                        {
                          href: (id: string) => `/centers/doors/${id}`,
                          id: 'info',
                          label: 'text.info'
                        },
                        {
                          href: (id: string) => `/centers/doors/${id}/edit`,
                          id: 'edit',
                          label: 'text.edit'
                        }
                      ] as const,
                      heading: 'text.doors',
                      infinite: true,
                      labelKey: 'name',
                      pageId: 'doors',
                      placeholder: 'text.search_doors',
                      queryOptions: (params: DoorsListParams) =>
                        getAllDoorsInfiniteQuery({ ...params }),
                      renderItem: (door: Door) => {
                        const centerName = door.floor?.center?.name
                        const floorName = door.floor?.name
                        const subtitle = [centerName, floorName]
                          .filter(Boolean)
                          .join(' • ')
                        return (
                          <Flex
                            subtitle={subtitle || undefined}
                            title={door.name}
                          />
                        )
                      },
                      valueKey: 'id'
                    }
                  },
                  {
                    children: 'text.create_door',
                    href: '/centers/doors/create',
                    icon: PlusIcon,
                    id: 'centers-doors-create',
                    keywords: ['new door', 'add door', 'create door', 'door']
                  },
                  {
                    children: 'text.search_centers',
                    closeOnSelect: false,
                    icon: BuildingIcon,
                    id: 'centers-search',
                    keywords: [
                      'search centers',
                      'find center',
                      'center search'
                    ],
                    requiredPermission: PERMISSIONS.CENTERS_SHOW,
                    searchConfig: {
                      actionsHeading: 'text.center_actions',
                      children: [
                        {
                          href: (id: string) => `/centers/${id}`,
                          id: 'info',
                          label: 'text.info'
                        },
                        {
                          href: (id: string) => `/centers/${id}/edit`,
                          id: 'edit',
                          label: 'text.edit'
                        },
                        {
                          href: (id: string) => `/centers/${id}?tab=floors`,
                          id: 'floors',
                          label: 'text.floors'
                        },
                        {
                          href: (id: string) => `/centers/${id}/floors/create`,
                          id: 'create-floor',
                          label: 'text.create_floor'
                        }
                      ] as const,
                      heading: 'text.centers',
                      infinite: true,
                      labelKey: 'name',
                      pageId: 'centers',
                      placeholder: 'text.search_centers',
                      queryOptions: getAllCentersInfiniteQuery,
                      renderItem: (center: Center) => (
                        <Flex
                          avatar={center.main_image_url}
                          subtitle={center.city?.name}
                          title={center.name}
                        />
                      ),
                      valueKey: 'id'
                    }
                  },
                  {
                    children: 'text.create_center',
                    href: '/centers/create',
                    icon: PlusIcon,
                    id: 'centers-create',
                    keywords: [
                      'new center',
                      'add center',
                      'create center',
                      'center'
                    ]
                  },
                  {
                    children: 'text.search_floors',
                    closeOnSelect: false,
                    icon: BuildingIcon,
                    id: 'floors-search',
                    keywords: ['search floors', 'find floor', 'floor search'],
                    searchConfig: {
                      actionsHeading: 'text.floor_actions',
                      children: [
                        {
                          href: (value: string) => {
                            const [centerId, floorId] = value.split(':')
                            return `/centers/${centerId}/floors/${floorId}/edit`
                          },
                          id: 'edit',
                          label: 'text.edit'
                        }
                      ] as const,
                      getItemValue: (floor: Floor) =>
                        `${floor.center_id}:${floor.id}`,
                      heading: 'text.floors',
                      labelKey: 'name',
                      pageId: 'floors',
                      placeholder: 'text.search_floors',
                      queryOptions: (params: FloorsListParams) =>
                        getAllFloorsQuery({ ...params, per_page: 20 }),
                      renderItem: (floor: Floor) => (
                        <Flex
                          subtitle={floor.center?.name}
                          title={floor.name}
                        />
                      ),
                      valueKey: 'id'
                    }
                  }
                ],
                label: 'text.centers'
              }
            ]
          }
        },
        {
          children: 'text.spaces',
          icon: ChairIcon,
          id: 'spaces',
          keywords: ['workspaces', 'spaces', 'offices'],
          parentConfig: {
            tabs: [
              {
                id: 'spaces',
                items: [
                  {
                    children: 'text.spaces_list',
                    href: '/spaces',
                    icon: ChairIcon,
                    id: 'spaces-list',
                    keywords: ['workspaces', 'spaces', 'offices']
                  },
                  {
                    children: 'text.space_configurations',
                    href: '/spaces/config',
                    icon: ChairIcon,
                    id: 'spaces-config',
                    keywords: [
                      'space configurations',
                      'space configuration',
                      'space config',
                      'configurations'
                    ]
                  },
                  {
                    children: 'text.rate_plans',
                    href: '/spaces/config?tab=rate-plans',
                    icon: SettingsIcon,
                    id: 'space-config-rate-plans',
                    keywords: [
                      'rate plans',
                      'rate plan',
                      'rates',
                      'plans',
                      'pricing'
                    ]
                  },
                  {
                    children: 'text.search_rate_plans',
                    closeOnSelect: false,
                    icon: SettingsIcon,
                    id: 'space-config-rate-plans-search',
                    keywords: [
                      'search rate plans',
                      'find rate plan',
                      'rate plan search'
                    ],
                    searchConfig: {
                      actionsHeading: 'text.rate_plan_actions',
                      children: [
                        {
                          href: (id: string) =>
                            `/spaces/config/pricing/${id}/edit`,
                          id: 'edit',
                          label: 'text.edit'
                        }
                      ] as const,
                      heading: 'text.rate_plans',
                      infinite: true,
                      labelKey: 'name',
                      pageId: 'space-pricing-templates',
                      placeholder: 'text.search_rate_plans',
                      queryOptions: (params: SpacePricingTemplatesListParams) =>
                        getAllSpacePricingTemplateInfiniteQuery({
                          ...params,
                          per_page: 20
                        }),
                      renderItem: (template: SpacePricingTemplate) => (
                        <Flex
                          subtitle={`Min ${template.min_duration} • Max ${template.max_duration}`}
                          title={template.name}
                        />
                      ),
                      valueKey: 'id'
                    }
                  },
                  {
                    children: 'text.create_rate_plan',
                    href: '/spaces/config/pricing/create',
                    icon: PlusIcon,
                    id: 'space-rate-plans-create',
                    keywords: [
                      'new rate plan',
                      'add rate plan',
                      'create rate plan',
                      'rate plan'
                    ]
                  },
                  {
                    children: 'text.types',
                    href: '/spaces/config?tab=types',
                    icon: SettingsIcon,
                    id: 'space-config-types',
                    keywords: ['types', 'type', 'space types', 'space type']
                  },
                  {
                    children: 'text.search_types',
                    closeOnSelect: false,
                    icon: SettingsIcon,
                    id: 'space-config-types-search',
                    keywords: ['search types', 'find type', 'type search'],
                    searchConfig: {
                      actionsHeading: 'text.space_type_actions',
                      children: [
                        {
                          href: (id: string) =>
                            `/spaces/config/types/${id}/edit`,
                          id: 'edit',
                          label: 'text.edit'
                        }
                      ] as const,
                      heading: 'text.space_types',
                      infinite: true,
                      labelKey: 'name',
                      pageId: 'space-types',
                      placeholder: 'text.search_space_types',
                      queryOptions: (params: SpaceTypesListParams) =>
                        getAllSpaceTypesInfiniteQuery({
                          ...params,
                          per_page: 20
                        }),
                      renderItem: (spaceType: SpaceType) => (
                        <Flex
                          subtitle={spaceType.description}
                          title={spaceType.name}
                        />
                      ),
                      valueKey: 'id'
                    }
                  },
                  {
                    children: 'text.create_type',
                    href: '/spaces/config/types/create',
                    icon: PlusIcon,
                    id: 'space-config-types-create',
                    keywords: ['new type', 'add type', 'create type', 'type']
                  },
                  {
                    children: 'text.amenities',
                    href: '/spaces/config?tab=amenities',
                    icon: SettingsIcon,
                    id: 'space-config-amenities',
                    keywords: ['amenities', 'amenity', 'space amenities']
                  },
                  {
                    children: 'text.search_amenities',
                    closeOnSelect: false,
                    icon: SettingsIcon,
                    id: 'space-config-amenities-search',
                    keywords: [
                      'search amenities',
                      'find amenity',
                      'amenity search'
                    ],
                    searchConfig: {
                      actionsHeading: 'text.amenity_actions',
                      children: [
                        {
                          href: (id: string) =>
                            `/spaces/config/amenities/${id}/edit`,
                          id: 'edit',
                          label: 'text.edit'
                        }
                      ] as const,
                      heading: 'text.amenities',
                      infinite: true,
                      labelKey: 'name',
                      pageId: 'space-amenities',
                      placeholder: 'text.search_amenities',
                      queryOptions: (params: SpaceAmenitiesListParams) =>
                        getAllSpaceAmenitiesInfiniteQuery({
                          ...params,
                          per_page: 20
                        }),
                      renderItem: (amenity: SpaceAmenity) => (
                        <Flex title={amenity.name} />
                      ),
                      valueKey: 'id'
                    }
                  },
                  {
                    children: 'text.create_amenity',
                    href: '/spaces/config/amenities/create',
                    icon: PlusIcon,
                    id: 'space-config-amenities-create',
                    keywords: [
                      'new amenity',
                      'add amenity',
                      'create amenity',
                      'amenity'
                    ]
                  },
                  {
                    children: 'text.layouts',
                    href: '/spaces/config?tab=layouts',
                    icon: SettingsIcon,
                    id: 'space-config-layouts',
                    keywords: [
                      'layouts',
                      'layout',
                      'space layouts',
                      'floor plans'
                    ],
                    requiredPermission: PERMISSIONS.SPACE_LAYOUTS_SHOW
                  },
                  {
                    children: 'text.create_layout',
                    href: '/spaces/config/layouts/create',
                    icon: PlusIcon,
                    id: 'space-config-layouts-create',
                    keywords: [
                      'new layout',
                      'add layout',
                      'create layout',
                      'layout'
                    ],
                    requiredPermission: PERMISSIONS.SPACE_LAYOUTS_CREATE
                  },
                  {
                    children: 'text.search_spaces',
                    closeOnSelect: false,
                    icon: ChairIcon,
                    id: 'spaces-search',
                    keywords: [
                      'search spaces',
                      'find space',
                      'space search',
                      'find workspace',
                      'workspace search',
                      'spaces'
                    ],
                    requiredPermission: PERMISSIONS.SPACES_SHOW,
                    searchConfig: {
                      actionsHeading: 'text.space_actions',
                      children: [
                        {
                          href: (id: string) => `/spaces/${id}/edit`,
                          id: 'edit',
                          label: 'text.edit'
                        },
                        {
                          href: (id: string) => `/spaces/${id}?tab=rate-plans`,
                          id: 'pricing',
                          keywords: [
                            'pricing',
                            'prices',
                            'plans',
                            'rate plans',
                            'rate plan',
                            'rates',
                            'plan',
                            'rate'
                          ],
                          label: 'text.rate_plans',
                          requiredPermission: PERMISSIONS.SPACE_PRICING_SHOW
                        },
                        {
                          href: (id: string) =>
                            `/spaces/${id}?tab=working-hours`,
                          id: 'working-hours',
                          label: 'text.working_hours'
                        },
                        {
                          href: (id: string) => `/spaces/${id}?tab=doors`,
                          id: 'doors',
                          label: 'text.doors'
                        },
                        {
                          href: (id: string) => `/spaces/${id}?tab=layouts`,
                          id: 'layouts',
                          label: 'text.layouts'
                        }
                      ] as const,
                      heading: 'text.spaces',
                      infinite: true,
                      labelKey: 'name',
                      pageId: 'spaces',
                      placeholder: 'text.search_spaces',
                      queryOptions: getAllSpacesInfiniteQuery,
                      renderItem: (space: Workspace) => (
                        <Flex
                          subtitle={space.center?.name}
                          title={space.name}
                        />
                      ),
                      valueKey: 'id'
                    }
                  },
                  {
                    children: 'text.create_space',
                    href: '/spaces/create',
                    icon: PlusIcon,
                    id: 'workspaces-create',
                    keywords: [
                      'new space',
                      'add space',
                      'create space',
                      'space'
                    ]
                  }
                ],
                label: 'text.spaces'
              }
            ]
          }
        }
      ]
    },
    {
      heading: 'text.business',
      id: 'business',
      items: [
        {
          children: 'text.operations',
          icon: PaperIcon,
          id: 'workflow',
          keywords: [
            'workflow',
            'process',
            'business',
            'requests',
            'leads',
            'offers',
            'contracts'
          ],
          parentConfig: {
            tabs: [
              {
                id: 'bookings',
                items: [
                  {
                    children: 'text.bookings',
                    href: '/operations/bookings',
                    icon: PaperIcon,
                    id: 'workflow-bookings',
                    keywords: ['bookings', 'booking', 'reservations'],
                    requiredPermission: PERMISSIONS.BOOKINGS_SHOW
                  },
                  {
                    children: 'text.search_bookings',
                    closeOnSelect: false,
                    icon: PaperIcon,
                    id: 'workflow-bookings-search',
                    keywords: [
                      'search bookings',
                      'find booking',
                      'booking search'
                    ],
                    requiredPermission: PERMISSIONS.BOOKINGS_SHOW,
                    searchConfig: {
                      actionsHeading: 'text.booking_actions',
                      children: [
                        {
                          href: (id: string) => `/operations/bookings/${id}`,
                          id: 'info',
                          label: 'text.info'
                        },
                        {
                          href: (id: string) =>
                            `/operations/bookings/${id}/edit`,
                          id: 'edit',
                          label: 'text.edit'
                        }
                      ] as const,
                      heading: 'text.bookings',
                      labelKey: 'code',
                      pageId: 'bookings',
                      placeholder: 'text.search_bookings',
                      queryOptions: (params: BookingListParams) =>
                        getAllBookingsQuery({ ...params, per_page: 20 }),
                      renderItem: (booking: Booking) => (
                        <Flex
                          subtitle={booking.company?.name}
                          title={booking.code}
                        />
                      ),
                      valueKey: 'id'
                    }
                  },
                  {
                    children: 'text.create_booking',
                    href: '/operations/bookings/create',
                    icon: PlusIcon,
                    id: 'workflow-bookings-create',
                    keywords: [
                      'new booking',
                      'add booking',
                      'create booking',
                      'booking'
                    ],
                    requiredPermission: PERMISSIONS.BOOKINGS_CREATE
                  }
                ],
                label: 'text.bookings'
              },
              {
                id: 'requests',
                items: [
                  {
                    children: 'text.requests',
                    href: '/operations/requests',
                    icon: PaperIcon,
                    id: 'workflow-requests',
                    keywords: ['requests', 'request', 'workflow']
                  },
                  {
                    children: 'text.search_requests',
                    closeOnSelect: false,
                    icon: PaperIcon,
                    id: 'workflow-requests-search',
                    keywords: [
                      'search requests',
                      'find request',
                      'request search'
                    ],
                    requiredPermission: PERMISSIONS.USER_JOIN_REQUESTS_SHOW,
                    searchConfig: {
                      actionsHeading: 'text.request_actions',
                      children: [
                        {
                          href: (id: string) =>
                            `/operations/requests/${id}/edit`,
                          id: 'edit',
                          label: 'text.edit'
                        }
                      ] as const,
                      heading: 'text.requests',
                      infinite: true,
                      labelKey: 'id',
                      pageId: 'requests',
                      placeholder: 'text.search_requests',
                      queryOptions: getAllUserJoinRequestsInfiniteQuery(),
                      // This must be improved when the API response is available
                      renderItem: (request: UserRequest) => {
                        const requestId =
                          'id' in request ? String(request.id) : ''
                        const userName =
                          request &&
                          typeof request === 'object' &&
                          'user' in request &&
                          request.user &&
                          typeof request.user === 'object' &&
                          'name' in request.user
                            ? String(request.user.name)
                            : null

                        return (
                          <Flex subtitle={userName} title={`#${requestId}`} />
                        )
                      },
                      valueKey: 'id'
                    }
                  },
                  {
                    children: 'text.create_request',
                    href: '/operations/requests/create',
                    icon: PlusIcon,
                    id: 'workflow-requests-create',
                    keywords: [
                      'new request',
                      'add request',
                      'create request',
                      'request'
                    ]
                  }
                ],
                label: 'text.requests'
              }
            ]
          }
        },
        {
          children: 'text.financial',
          icon: CalendarPlusIcon,
          id: 'reservation',
          keywords: [
            'reservation',
            'booking',
            'appointments',
            'bookings',
            'invoices'
          ],
          parentConfig: {
            tabs: [
              {
                id: 'invoices',
                items: [
                  {
                    children: 'text.invoices',
                    href: '/financial/invoices',
                    icon: CalendarPlusIcon,
                    id: 'reservation-invoices',
                    keywords: ['invoices', 'invoice', 'billing'],
                    requiredPermission: PERMISSIONS.INVOICES_SHOW
                  },
                  {
                    children: 'text.search_invoices',
                    closeOnSelect: false,
                    icon: CalendarPlusIcon,
                    id: 'reservation-invoices-search',
                    keywords: ['search invoices', 'find invoice'],
                    requiredPermission: PERMISSIONS.INVOICES_SHOW,
                    searchConfig: {
                      actionsHeading: 'text.invoice_actions',
                      children: [
                        {
                          href: (id: string) => `/financial/invoices/${id}`,
                          id: 'info',
                          label: 'text.info'
                        }
                      ] as const,
                      heading: 'text.invoices',
                      labelKey: 'id',
                      pageId: 'invoices',
                      placeholder: 'text.search_invoices',
                      queryOptions: (params: InvoicesListParams) =>
                        getAllInvoicesQuery({ ...params, per_page: 20 }),
                      renderItem: (invoice: Invoice) => (
                        <Flex
                          subtitle={invoice.user?.name}
                          title={`#${invoice.id}`}
                        />
                      ),
                      valueKey: 'id'
                    }
                  }
                ],
                label: 'text.invoices'
              },
              {
                id: 'transactions',
                items: [
                  {
                    children: 'text.transactions',
                    href: '/financial/transactions',
                    icon: CalendarPlusIcon,
                    id: 'reservation-transactions',
                    keywords: ['transactions', 'payments']
                  }
                ],
                label: 'text.transactions'
              }
            ]
          }
        },
        {
          children: 'text.purchases',
          icon: InventoryIcon,
          id: 'inventory',
          keywords: [
            'inventory',
            'stock',
            'products',
            'vendors',
            'services',
            'orders'
          ],
          parentConfig: {
            tabs: [
              {
                id: 'vendors',
                items: [
                  {
                    children: 'text.vendors',
                    href: '/purchases/vendors',
                    icon: InventoryIcon,
                    id: 'inventory-vendors',
                    keywords: ['vendors', 'vendor', 'suppliers']
                  },
                  {
                    children: 'text.search_vendors',
                    closeOnSelect: false,
                    icon: InventoryIcon,
                    id: 'inventory-vendors-search',
                    keywords: [
                      'search vendors',
                      'find vendor',
                      'vendor search'
                    ],
                    searchConfig: {
                      actionsHeading: 'text.vendor_actions',
                      children: [
                        {
                          href: (id: string) =>
                            `/purchases/vendors/${id}/profile`,
                          id: 'profile',
                          label: 'text.profile'
                        },
                        {
                          href: (id: string) =>
                            `/purchases/vendors/${id}/edit-vendor`,
                          id: 'edit',
                          label: 'text.edit'
                        }
                      ] as const,
                      heading: 'text.vendors',
                      labelKey: 'name',
                      pageId: 'vendors',
                      placeholder: 'text.search_vendors',
                      queryOptions: (params: VendorsListParams) =>
                        getAllVendorsInfiniteQuery({ ...params }),
                      renderItem: (vendor: Vendor) => (
                        <Flex subtitle={vendor.phone} title={vendor.name} />
                      ),
                      valueKey: 'id'
                    }
                  },
                  {
                    children: 'text.create_vendor',
                    href: '/purchases/vendors/create',
                    icon: PlusIcon,
                    id: 'inventory-vendors-create',
                    keywords: ['new vendor', 'add vendor', 'create vendor']
                  }
                ],
                label: 'text.vendors'
              },
              {
                id: 'categories',
                items: [
                  {
                    children: 'text.categories',
                    href: '/purchases/categories',
                    icon: InventoryIcon,
                    id: 'inventory-categories',
                    keywords: ['product categories', 'categories', 'product']
                  },
                  {
                    children: 'text.search_categories',
                    closeOnSelect: false,
                    icon: InventoryIcon,
                    id: 'inventory-categories-search',
                    keywords: [
                      'search product categories',
                      'find product category',
                      'product category search'
                    ],
                    searchConfig: {
                      actionsHeading: 'text.product_category_actions',
                      children: [
                        {
                          href: (id: string) =>
                            `/purchases/categories/${id}/edit`,
                          id: 'edit',
                          label: 'text.edit'
                        }
                      ] as const,
                      heading: 'text.product_categories',
                      labelKey: 'name',
                      pageId: 'product-categories',
                      placeholder: 'text.search_product_categories',
                      queryOptions: (params: ProductCategoriesListParams) =>
                        getAllProductCategoriesQuery({
                          ...params,
                          per_page: 20
                        }),
                      renderItem: (category: ProductCategory) => (
                        <Flex
                          subtitle={
                            category.parent_id
                              ? 'Child category'
                              : 'Parent category'
                          }
                          title={category.name}
                        />
                      ),
                      valueKey: 'id'
                    }
                  },
                  {
                    children: 'text.create_category',
                    href: '/purchases/categories/create',
                    icon: PlusIcon,
                    id: 'inventory-categories-create',
                    keywords: [
                      'new product category',
                      'add product category',
                      'create product category'
                    ]
                  }
                ],
                label: 'text.categories'
              },
              {
                id: 'products',
                items: [
                  {
                    children: 'text.products',
                    href: '/purchases/products',
                    icon: InventoryIcon,
                    id: 'inventory-products',
                    keywords: ['products', 'product', 'items']
                  },
                  {
                    children: 'text.search_products',
                    closeOnSelect: false,
                    icon: InventoryIcon,
                    id: 'inventory-products-search',
                    keywords: ['search products', 'find product'],
                    searchConfig: {
                      actionsHeading: 'text.product_actions',
                      children: [
                        {
                          href: (id: string) =>
                            `/purchases/products/${id}/edit`,
                          id: 'edit',
                          label: 'text.edit'
                        }
                      ] as const,
                      heading: 'text.products',
                      labelKey: 'name',
                      pageId: 'products',
                      placeholder: 'text.search_products',
                      queryOptions: (params: ProductsListParams) =>
                        getAllProductsQuery({ ...params, per_page: 20 }),
                      renderItem: (product: Product) => (
                        <Flex
                          subtitle={product.vendor?.name}
                          title={product.name}
                        />
                      ),
                      valueKey: 'id'
                    }
                  },
                  {
                    children: 'text.create_product',
                    href: '/purchases/products/create',
                    icon: PlusIcon,
                    id: 'inventory-products-create',
                    keywords: ['new product', 'add product', 'create product']
                  }
                ],
                label: 'text.products'
              },
              {
                id: 'orders',
                items: [
                  {
                    children: 'text.orders',
                    href: '/purchases/orders',
                    icon: InventoryIcon,
                    id: 'inventory-orders',
                    keywords: ['orders', 'order', 'purchases']
                  },
                  {
                    children: 'text.search_orders',
                    closeOnSelect: false,
                    icon: InventoryIcon,
                    id: 'inventory-orders-search',
                    keywords: ['search orders', 'find order', 'order search'],
                    searchConfig: {
                      actionsHeading: 'text.order_actions',
                      children: [
                        {
                          href: (id: string) => `/purchases/orders/${id}/info`,
                          id: 'info',
                          label: 'text.info'
                        }
                      ] as const,
                      heading: 'text.orders',
                      labelKey: 'id',
                      pageId: 'orders',
                      placeholder: 'text.search_orders',
                      queryOptions: (params: OrdersListParams) =>
                        getAllOrdersQuery({ ...params, per_page: 20 }),
                      renderItem: (order: Order) => (
                        <Flex
                          subtitle={order.vendor?.name ?? order.user?.name}
                          title={order.order_number ?? `#${order.id}`}
                        />
                      ),
                      valueKey: 'id'
                    }
                  },
                  {
                    children: 'text.create_order',
                    href: '/purchases/orders/create',
                    icon: PlusIcon,
                    id: 'inventory-orders-create',
                    keywords: [
                      'new order',
                      'add order',
                      'create order',
                      'order'
                    ],
                    requiredPermission: PERMISSIONS.ORDERS_CREATE
                  }
                ],
                label: 'text.orders'
              }
            ]
          }
        }
      ]
    },
    {
      heading: 'text.support',
      id: 'support',
      items: [
        {
          children: 'text.support',
          icon: HelpCircleIcon,
          id: 'support',
          keywords: [
            'support',
            'tickets',
            'faq',
            'faqs',
            'questions',
            'answers'
          ],
          parentConfig: {
            tabs: [
              {
                id: 'tickets',
                items: [
                  {
                    children: 'text.tickets',
                    href: '/support/tickets',
                    icon: HelpCircleIcon,
                    id: 'support-tickets',
                    keywords: ['tickets', 'ticket', 'support tickets']
                  }
                ],
                label: 'text.tickets'
              },
              {
                id: 'faq',
                items: [
                  {
                    children: 'text.faq',
                    href: '/support/faq',
                    icon: HelpCircleIcon,
                    id: 'support-faq',
                    keywords: ['faq', 'faqs', 'questions', 'answers'],
                    requiredPermission: PERMISSIONS.FAQS_SHOW
                  },
                  {
                    children: 'text.search_faq',
                    closeOnSelect: false,
                    icon: HelpCircleIcon,
                    id: 'support-faq-search',
                    keywords: [
                      'search faq',
                      'find faq',
                      'questions',
                      'answers'
                    ],
                    requiredPermission: PERMISSIONS.FAQS_SHOW,
                    searchConfig: {
                      actionsHeading: 'text.faq_actions',
                      children: [
                        {
                          href: (id: string) => `/support/faq/${id}/edit`,
                          id: 'edit',
                          label: 'text.edit'
                        }
                      ] as const,
                      getItemLabel: (faq: Faq) => {
                        const translation =
                          faq.translations?.find(
                            (item) => item.locale === 'en'
                          ) ?? faq.translations?.[0]
                        return translation?.question ?? `FAQ #${faq.id}`
                      },
                      heading: 'text.faq',
                      labelKey: 'id',
                      pageId: 'faq',
                      placeholder: 'text.search_faq',
                      queryOptions: (params: FaqsListParams) =>
                        getAllFaqsQuery({ ...params, per_page: 20 }),
                      renderItem: (faq: Faq) => {
                        const translation =
                          faq.translations?.find(
                            (item) => item.locale === 'en'
                          ) ?? faq.translations?.[0]
                        return (
                          <Flex
                            subtitle={translation?.answer}
                            title={translation?.question ?? `FAQ #${faq.id}`}
                          />
                        )
                      },
                      valueKey: 'id'
                    }
                  },
                  {
                    children: 'text.create_faq',
                    href: '/support/faq/create',
                    icon: PlusIcon,
                    id: 'support-faq-create',
                    keywords: ['new faq', 'add faq', 'create faq', 'faq'],
                    requiredPermission: PERMISSIONS.FAQS_CREATE
                  }
                ],
                label: 'text.faq'
              }
            ]
          }
        }
      ]
    },
    {
      heading: 'text.settings',
      id: 'settings',
      items: [
        {
          children: 'text.setting',
          icon: SettingsIcon,
          id: 'settings',
          keywords: [
            'settings',
            'setting',
            'config',
            'configuration',
            'space configurations',
            'news',
            'notifications',
            'bank accounts',
            'customer groups',
            'locations',
            'doors',
            'product categories',
            'service categories'
          ],
          parentConfig: {
            tabs: [
              {
                id: 'hub',
                items: [
                  {
                    children: 'text.settings',
                    href: '/settings',
                    icon: SettingsIcon,
                    id: 'settings-hub',
                    keywords: [
                      'settings',
                      'hub',
                      'configuration',
                      'preferences'
                    ]
                  },
                  {
                    children: 'text.configurations',
                    href: '/settings/configs',
                    icon: SettingsIcon,
                    id: 'settings-configurations',
                    keywords: [
                      'configurations',
                      'configs',
                      'settings config',
                      'system config'
                    ],
                    requiredPermission: PERMISSIONS.CONFIGS_SHOW
                  }
                ],
                label: 'text.settings'
              },
              {
                id: 'news',
                items: [
                  {
                    children: 'text.news',
                    href: '/settings/news',
                    icon: SettingsIcon,
                    id: 'settings-news',
                    keywords: ['news', 'announcements', 'updates'],
                    requiredPermission: PERMISSIONS.NEWS_SHOW
                  },
                  {
                    children: 'text.create_news',
                    href: '/settings/news/create',
                    icon: PlusIcon,
                    id: 'settings-news-create',
                    keywords: [
                      'new news',
                      'add news',
                      'create news',
                      'announcement'
                    ],
                    requiredPermission: PERMISSIONS.NEWS_CREATE
                  }
                ],
                label: 'text.news'
              },
              {
                id: 'notifications',
                items: [
                  {
                    children: 'text.notifications',
                    href: '/settings/notifications',
                    icon: SettingsIcon,
                    id: 'settings-notifications',
                    keywords: ['notifications', 'alerts', 'messages'],
                    requiredPermission: PERMISSIONS.NOTIFICATIONS_SHOW
                  },
                  {
                    children: 'text.create_notification',
                    href: '/settings/notifications/create',
                    icon: PlusIcon,
                    id: 'settings-notifications-create',
                    keywords: [
                      'new notification',
                      'add notification',
                      'create notification',
                      'send notification'
                    ],
                    requiredPermission: PERMISSIONS.NOTIFICATIONS_SEND
                  },
                  {
                    children: 'text.my_notifications',
                    href: '/my-notifications',
                    icon: SettingsIcon,
                    id: 'my-notifications',
                    keywords: [
                      'my notifications',
                      'notification center',
                      'alerts',
                      'messages'
                    ],
                    requiredPermission: PERMISSIONS.NOTIFICATIONS_SHOW
                  }
                ],
                label: 'text.notifications'
              },
              {
                id: 'bank-accounts',
                items: [
                  {
                    children: 'text.bank_accounts',
                    href: '/settings/bank-accounts',
                    icon: SettingsIcon,
                    id: 'settings-bank-accounts',
                    keywords: [
                      'bank accounts',
                      'banks',
                      'finance accounts',
                      'payment accounts'
                    ],
                    requiredPermission: PERMISSIONS.BANK_ACCOUNTS_SHOW
                  },
                  {
                    children: 'text.create_bank_account',
                    href: '/settings/bank-accounts/create',
                    icon: PlusIcon,
                    id: 'settings-bank-accounts-create',
                    keywords: [
                      'new bank account',
                      'add bank account',
                      'create bank account',
                      'bank account'
                    ],
                    requiredPermission: PERMISSIONS.BANK_ACCOUNTS_CREATE
                  }
                ],
                label: 'text.bank_accounts'
              },
              {
                id: 'countries',
                items: [
                  {
                    children: 'text.locations',
                    href: '/settings/locations',
                    icon: FolderTreeIcon,
                    id: 'settings-locations',
                    keywords: [
                      'locations',
                      'areas',
                      'countries',
                      'states',
                      'cities'
                    ]
                  },
                  {
                    children: 'text.countries',
                    href: '/settings/locations/countries',
                    icon: FolderTreeIcon,
                    id: 'area-countries',
                    keywords: ['countries', 'country', 'nations']
                  },
                  {
                    children: 'text.search_countries',
                    closeOnSelect: false,
                    icon: FolderTreeIcon,
                    id: 'area-countries-search',
                    keywords: [
                      'search countries',
                      'find country',
                      'country search'
                    ],
                    searchConfig: {
                      actionsHeading: 'text.country_actions',
                      children: [
                        {
                          href: (id: string) =>
                            `/settings/locations/countries/${id}/edit-country`,
                          id: 'edit',
                          label: 'text.edit'
                        }
                      ] as const,
                      heading: 'text.countries',
                      labelKey: 'name',
                      pageId: 'countries',
                      placeholder: 'text.search_countries',
                      queryOptions: (params: CountryListParams) =>
                        getAllCountriesQuery({ ...params, per_page: 20 }),
                      renderItem: (country: Country) => (
                        <Flex subtitle={country.code} title={country.name} />
                      ),
                      valueKey: 'id'
                    }
                  },
                  {
                    children: 'text.create_country',
                    href: '/settings/locations/countries/create',
                    icon: PlusIcon,
                    id: 'area-countries-create',
                    keywords: [
                      'new country',
                      'add country',
                      'create country',
                      'country'
                    ]
                  }
                ],
                label: 'text.countries'
              },
              {
                id: 'states',
                items: [
                  {
                    children: 'text.states',
                    href: '/settings/locations/states',
                    icon: FolderTreeIcon,
                    id: 'area-states',
                    keywords: ['states', 'state', 'provinces', 'regions']
                  },
                  {
                    children: 'text.search_states',
                    closeOnSelect: false,
                    icon: FolderTreeIcon,
                    id: 'area-states-search',
                    keywords: ['search states', 'find state', 'state search'],
                    searchConfig: {
                      actionsHeading: 'text.state_actions',
                      children: [
                        {
                          href: (id: string) =>
                            `/settings/locations/states/${id}/edit-state`,
                          id: 'edit',
                          label: 'text.edit'
                        }
                      ] as const,
                      heading: 'text.states',
                      labelKey: 'name',
                      pageId: 'states',
                      placeholder: 'text.search_states',
                      queryOptions: (params: StateListParams) =>
                        getAllStatesQuery({ ...params, per_page: 20 }),
                      renderItem: (state: State) => (
                        <Flex
                          subtitle={state.country_name}
                          title={state.name}
                        />
                      ),
                      valueKey: 'id'
                    }
                  },
                  {
                    children: 'text.create_state',
                    href: '/settings/locations/states/create',
                    icon: PlusIcon,
                    id: 'area-states-create',
                    keywords: [
                      'new state',
                      'add state',
                      'create state',
                      'state'
                    ]
                  }
                ],
                label: 'text.states'
              },
              {
                id: 'cities',
                items: [
                  {
                    children: 'text.cities',
                    href: '/settings/locations/cities',
                    icon: FolderTreeIcon,
                    id: 'area-cities',
                    keywords: ['cities', 'city', 'towns']
                  },
                  {
                    children: 'text.search_cities',
                    closeOnSelect: false,
                    icon: FolderTreeIcon,
                    id: 'area-cities-search',
                    keywords: ['search cities', 'find city', 'city search'],
                    searchConfig: {
                      actionsHeading: 'text.city_actions',
                      children: [
                        {
                          href: (id: string) =>
                            `/settings/locations/cities/${id}/edit-city`,
                          id: 'edit',
                          label: 'text.edit'
                        }
                      ] as const,
                      heading: 'text.cities',
                      labelKey: 'name',
                      pageId: 'cities',
                      placeholder: 'text.search_cities',
                      queryOptions: (params: CityListParams) =>
                        getAllCitiesQuery({ ...params, per_page: 20 }),
                      renderItem: (city: City) => (
                        <Flex subtitle={city.state_name} title={city.name} />
                      ),
                      valueKey: 'id'
                    }
                  },
                  {
                    children: 'text.create_city',
                    href: '/settings/locations/cities/create',
                    icon: PlusIcon,
                    id: 'area-cities-create',
                    keywords: ['new city', 'add city', 'create city', 'city']
                  }
                ],
                label: 'text.cities'
              },
              {
                id: 'currencies',
                items: [
                  {
                    children: 'text.currencies',
                    href: '/settings/currencies',
                    icon: FolderTreeIcon,
                    id: 'area-currencies',
                    keywords: ['currencies', 'currency', 'money', 'exchange']
                  },
                  {
                    children: 'text.search_currencies',
                    closeOnSelect: false,
                    icon: FolderTreeIcon,
                    id: 'area-currencies-search',
                    keywords: ['search currencies', 'find currency'],
                    searchConfig: {
                      actionsHeading: 'text.currency_actions',
                      children: [
                        {
                          href: (id: string) =>
                            `/settings/currencies/${id}/edit`,
                          id: 'edit',
                          label: 'text.edit'
                        }
                      ] as const,
                      heading: 'text.currencies',
                      labelKey: 'name',
                      pageId: 'currencies',
                      placeholder: 'text.search_currencies',
                      queryOptions: (params: CurrencyListParams) =>
                        getAllCurrenciesQuery({ ...params, per_page: 20 }),
                      renderItem: (currency: Currency) => (
                        <Flex subtitle={currency.code} title={currency.name} />
                      ),
                      valueKey: 'id'
                    }
                  },
                  {
                    children: 'text.create_currency',
                    href: '/settings/currencies/create',
                    icon: PlusIcon,
                    id: 'area-currencies-create',
                    keywords: [
                      'new currency',
                      'add currency',
                      'create currency',
                      'currency'
                    ]
                  }
                ],
                label: 'text.currencies'
              },
              {
                id: 'nationalities',
                items: [
                  {
                    children: 'text.nationalities',
                    href: '/settings/nationalities',
                    icon: FolderTreeIcon,
                    id: 'area-nationalities',
                    keywords: [
                      'nationalities',
                      'nationality',
                      'nations',
                      'citizenship'
                    ]
                  },
                  {
                    children: 'text.search_nationalities',
                    closeOnSelect: false,
                    icon: FolderTreeIcon,
                    id: 'area-nationalities-search',
                    keywords: ['search nationalities', 'find nationality'],
                    searchConfig: {
                      actionsHeading: 'text.nationality_actions',
                      children: [
                        {
                          href: (id: string) =>
                            `/settings/nationalities/${id}/edit`,
                          id: 'edit',
                          label: 'text.edit'
                        }
                      ] as const,
                      heading: 'text.nationalities',
                      labelKey: 'name',
                      pageId: 'nationalities',
                      placeholder: 'text.search_nationalities',
                      queryOptions: (params: NationalityListParams) =>
                        getAllNationalitiesQuery({ ...params }),
                      renderItem: (nationality: Nationality) => (
                        <Flex title={nationality.name} />
                      ),
                      valueKey: 'id'
                    }
                  },
                  {
                    children: 'text.create_nationality',
                    href: '/settings/nationalities/create',
                    icon: PlusIcon,
                    id: 'area-nationalities-create',
                    keywords: [
                      'new nationality',
                      'add nationality',
                      'create nationality',
                      'nationality'
                    ]
                  }
                ],
                label: 'text.nationalities'
              },
              {
                id: 'taxes',
                items: [
                  {
                    children: 'text.taxes',
                    href: '/settings/taxes',
                    icon: SettingsIcon,
                    id: 'settings-taxes',
                    keywords: ['taxes', 'tax', 'rates'],
                    requiredPermission: PERMISSIONS.TAXES_SHOW
                  },
                  {
                    children: 'text.search_taxes',
                    closeOnSelect: false,
                    icon: SettingsIcon,
                    id: 'settings-taxes-search',
                    keywords: ['search taxes', 'find tax', 'tax search'],
                    requiredPermission: PERMISSIONS.TAXES_SHOW,
                    searchConfig: {
                      actionsHeading: 'text.tax_actions',
                      children: [
                        {
                          href: (id: string) => `/settings/taxes/${id}/edit`,
                          id: 'edit',
                          label: 'text.edit',
                          requiredPermission: PERMISSIONS.TAXES_UPDATE
                        }
                      ] as const,
                      heading: 'text.taxes',
                      labelKey: 'title',
                      pageId: 'taxes',
                      placeholder: 'text.search_taxes',
                      queryOptions: (params: TaxesListParams) =>
                        getAllTaxesQuery({ ...params, per_page: 20 }),
                      renderItem: (tax: TaxType) => (
                        <Flex subtitle={tax.country?.name} title={tax.title} />
                      ),
                      valueKey: 'id'
                    }
                  },
                  {
                    children: 'text.create_tax',
                    href: '/settings/taxes/create',
                    icon: PlusIcon,
                    id: 'settings-taxes-create',
                    keywords: ['new tax', 'add tax', 'create tax', 'tax'],
                    requiredPermission: PERMISSIONS.TAXES_CREATE
                  }
                ],
                label: 'text.taxes'
              }
            ]
          }
        }
      ]
    }
  ]

  return localizeCommandPaletteConfig(config, t)
}

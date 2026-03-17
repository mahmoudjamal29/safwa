import {
  LayoutDashboardIcon,
  FileTextIcon,
  PlusCircleIcon,
  PackageIcon,
  ArrowRightLeftIcon,
  UsersIcon
} from '@/lib/icons'

import type { MenuConfig } from '@/types/sidebar'

export const createMenuConfig = (t: (key: string) => string): MenuConfig => [
  {
    separator: true,
    title: t('sections.main')
  },
  {
    icon: LayoutDashboardIcon,
    path: '/',
    title: t('menu.dashboard')
  },
  {
    separator: true,
    title: t('sections.sales')
  },
  {
    icon: FileTextIcon,
    path: '/invoices',
    title: t('menu.invoices')
  },
  {
    icon: PlusCircleIcon,
    path: '/invoices/new',
    title: t('menu.newInvoice')
  },
  {
    separator: true,
    title: t('sections.inventory')
  },
  {
    icon: PackageIcon,
    path: '/products',
    title: t('menu.products')
  },
  {
    icon: ArrowRightLeftIcon,
    path: '/inventory',
    title: t('menu.inventoryMovements')
  },
  {
    separator: true,
    title: t('sections.clients')
  },
  {
    icon: UsersIcon,
    path: '/customers',
    title: t('menu.customers')
  }
]

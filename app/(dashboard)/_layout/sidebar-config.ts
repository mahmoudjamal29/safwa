import {
  LayoutDashboardIcon,
  FileTextIcon,
  PlusCircleIcon,
  PackageIcon,
  ArrowRightLeftIcon,
  UsersIcon
} from 'lucide-react'
import type { MenuConfig } from '@/types/sidebar'

export const createMenuConfig = (t: (key: string) => string): MenuConfig => [
  {
    title: t('sections.main'),
    separator: true
  },
  {
    icon: LayoutDashboardIcon,
    path: '/',
    title: t('menu.dashboard')
  },
  {
    title: t('sections.sales'),
    separator: true
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
    title: t('sections.inventory'),
    separator: true
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
    title: t('sections.clients'),
    separator: true
  },
  {
    icon: UsersIcon,
    path: '/customers',
    title: t('menu.customers')
  }
]

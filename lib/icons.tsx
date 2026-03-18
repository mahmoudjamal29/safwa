import {
  ArrowLeftRightIcon as ArrowLeftRightIconData,
  Calendar01Icon as Calendar01IconData,
  ChevronFirst as ChevronFirstData,
  ChevronLast as ChevronLastData,
  ChevronLeft as ChevronLeftData,
  ChevronRight as ChevronRightData,
  DashboardCircleIcon as DashboardCircleIconData,
  EyeIcon as EyeIconData,
  FileText as FileTextData,
  Logout01Icon as Logout01IconData,
  Menu01Icon as Menu01IconData,
  Package01Icon as Package01IconData,
  PencilEdit01Icon as PencilEdit01IconData,
  PlusSignCircleIcon as PlusSignCircleIconData,
  PlusSignIcon as PlusSignIconData,
  Settings as SettingsIconData,
  Tick01Icon as Tick01IconData,
  Trash as TrashIconData,
  Trash2 as Trash2IconData,
  User02Icon as User02IconData,
  UserGroupIcon as UserGroupIconData,
  Invoice01Icon as Invoice01IconData,
  Money01Icon as Money01IconData,
} from '@hugeicons/core-free-icons'
/**
 * Centralised icon exports using @hugeicons/react + @hugeicons/core-free-icons.
 * All icons share the same `{ className?, size?, color? }` interface.
 */
import { HugeiconsIcon, type HugeiconsIconProps, type HugeiconsProps } from '@hugeicons/react'

type IconProps = Omit<HugeiconsProps, 'icon'>

const makeIcon = (data: HugeiconsIconProps['icon']) =>
  function Icon({ size = 20, ...props }: IconProps) {
    return <HugeiconsIcon icon={data} size={size} {...props} />
  }

export const LayoutDashboardIcon = makeIcon(DashboardCircleIconData)
export const FileTextIcon        = makeIcon(FileTextData)
export const InvoiceIcon         = makeIcon(Invoice01IconData)
export const PlusCircleIcon      = makeIcon(PlusSignCircleIconData)
export const PlusIcon            = makeIcon(PlusSignIconData)
export const PackageIcon         = makeIcon(Package01IconData)
export const ArrowRightLeftIcon  = makeIcon(ArrowLeftRightIconData)
export const UsersIcon           = makeIcon(UserGroupIconData)
export const MenuIcon            = makeIcon(Menu01IconData)
export const UserIcon            = makeIcon(User02IconData)
export const LogOutIcon          = makeIcon(Logout01IconData)
export const EyeIcon             = makeIcon(EyeIconData)
export const TrashIcon           = makeIcon(TrashIconData)
export const Trash2Icon          = makeIcon(Trash2IconData)
export const PencilIcon          = makeIcon(PencilEdit01IconData)
export const ChevronLeftIcon     = makeIcon(ChevronLeftData)
export const ChevronRightIcon    = makeIcon(ChevronRightData)
export const ChevronsLeftIcon    = makeIcon(ChevronFirstData)
export const ChevronsRightIcon   = makeIcon(ChevronLastData)
export const SettingsIcon        = makeIcon(SettingsIconData)
export const CalendarIcon        = makeIcon(Calendar01IconData)
export const CheckIcon           = makeIcon(Tick01IconData)
export const MoneyIcon           = makeIcon(Money01IconData)

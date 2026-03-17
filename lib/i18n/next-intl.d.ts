import ar from './ar/common.json'
import arAuth from './ar/auth.json'
import arLayout from './ar/layout.json'
import arDashboard from './ar/dashboard.json'
import arInvoices from './ar/invoices.json'
import arProducts from './ar/products.json'
import arInventory from './ar/inventory.json'
import arCustomers from './ar/customers.json'

type Messages = {
  common: typeof ar
  auth: typeof arAuth
  layout: typeof arLayout
  dashboard: typeof arDashboard
  invoices: typeof arInvoices
  products: typeof arProducts
  inventory: typeof arInventory
  customers: typeof arCustomers
}

declare global {
  interface IntlMessages extends Messages {}
  // Translations helper type used in sidebar-config
  type Translations<T extends string> = (key: T extends `${infer NS}.${infer Key}` ? Key : T) => string
}

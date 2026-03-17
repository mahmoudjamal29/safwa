import type { Locale } from './i18n-config'

const loadMessages = async (locale: Locale) => {
  const [common, auth, layout, dashboard, invoices, products, inventory, customers, components] =
    await Promise.all([
      import(`./${locale}/common.json`),
      import(`./${locale}/auth.json`),
      import(`./${locale}/layout.json`),
      import(`./${locale}/dashboard.json`),
      import(`./${locale}/invoices.json`),
      import(`./${locale}/products.json`),
      import(`./${locale}/inventory.json`),
      import(`./${locale}/customers.json`),
      import(`./${locale}/components.json`)
    ])
  return {
    common: common.default,
    auth: auth.default,
    layout: layout.default,
    dashboard: dashboard.default,
    invoices: invoices.default,
    products: products.default,
    inventory: inventory.default,
    customers: customers.default,
    components: components.default
  }
}

export const messages: Record<Locale, () => Promise<Record<string, unknown>>> = {
  ar: () => loadMessages('ar'),
  en: () => loadMessages('en')
}

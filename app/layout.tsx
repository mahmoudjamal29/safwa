import type { Metadata } from 'next'
import { Tajawal, Noto_Naskh_Arabic } from 'next/font/google'
import { getLocale } from '@/lib/i18n/request'
import { RootProviders } from '@/lib/providers/providers-root'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import './globals.css'

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-tajawal'
})

const notoNaskh = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-naskh'
})

export const metadata: Metadata = {
  title: 'الصفوة - نظام الإدارة',
  description: 'نظام إدارة الأعمال للصفوة لتجارة المنتجات الغذائية'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={`${tajawal.variable} ${notoNaskh.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <RootProviders>{children}</RootProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

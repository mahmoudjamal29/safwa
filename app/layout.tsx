import type { Metadata, Viewport } from 'next'
import { Tajawal, Noto_Naskh_Arabic, Figtree } from 'next/font/google'

import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

import { getLocale } from '@/lib/i18n/request'
import { RootProviders } from '@/lib/providers/providers-root'
import { PwaRegister } from '@/components/pwa-register'

import './globals.css'
import { cn } from "@/utils/cn";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

const tajawal = Tajawal({
  subsets: ['arabic'],
  variable: '--font-tajawal',
  weight: ['300', '400', '500', '700']
})

const notoNaskh = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  variable: '--font-naskh',
  weight: ['400', '500', '600', '700']
})

export const viewport: Viewport = {
  themeColor: '#0A1628',
}

export const metadata: Metadata = {
  description: 'نظام إدارة الأعمال للصفوة لتجارة المنتجات الغذائية',
  title: 'الصفوة - نظام الإدارة',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'الصفوة',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning className={cn("font-sans", figtree.variable)}>
      <body className={`${tajawal.variable} ${notoNaskh.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <RootProviders>{children}</RootProviders>
        </NextIntlClientProvider>
        <PwaRegister />
      </body>
    </html>
  )
}

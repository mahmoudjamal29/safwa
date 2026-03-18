import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'الصفوة - نظام الإدارة',
    short_name: 'الصفوة',
    description: 'نظام إدارة الأعمال لشركة الصفوة للمنتجات الغذائية',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A1628',
    theme_color: '#0A1628',
    orientation: 'portrait',
    lang: 'ar',
    dir: 'rtl',
    icons: [
      {
        src: '/icons/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}

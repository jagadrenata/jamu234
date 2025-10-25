import type { Metadata } from 'next'
import Debugger from '@/components/Debugger'
import { Geist_Mono } from 'next/font/google'
import './globals.css'
import RouterProvider from '@/components/RouterProvider'

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  // 🏷️ Judul default dan template (ideal untuk SEO: 50–60 karakter)
  title: {
    default: 'Jamu 234 – Jamu Tradisional Di Sleman Yogyakarta',
    template: '%s | Jamu 234 – Jamu Tradisional Di Sleman',
  },

  description: 'Jamu 234 menghadirkan jamu tradisional dari empon-empon asli berkualitas tanpa pemanis buatan, menjaga daya tahan dan kebugaran tubuh.',

  // 🌍 Bahasa & metadata dasar
  metadataBase: new URL('https://jamu234.biz.id'),
  alternates: {
    canonical: 'https://jamu234.biz.id',
  },

  // 🧭 Keyword untuk SEO (variatif tapi tetap fokus)
  keywords: ['Jamu 234', 'Jamu tradisional Sleman', 'Jamu234', 'Jamu Bu Marmur', 'Jamu Jagad'],

  // 👤 Informasi kreator
  authors: [{ name: 'Jagad', url: 'https://renn.biz.id' }],
  creator: 'Jagad',
  publisher: 'Renn Sites',

  // 🖼️ Open Graph (untuk sosial media seperti Facebook, WhatsApp, Telegram)
  openGraph: {
    title: 'Jamu 234 – Minuman Herbal Tradisional dari Sleman',
    description: 'Nikmati jamu tradisional Jamu 234, diracik dari empon-empon pilihan tanpa pemanis buatan untuk menjaga kesehatan dan kebugaran.',
    url: 'https://jamu234.biz.id',
    siteName: 'Jamu 234',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Jamu 234 – Jamu Tradisional di Sleman Yogyakarta',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },

  // 🐦 Twitter Card (konsisten dengan Open Graph)
  twitter: {
    card: 'summary_large_image',
    title: 'Jamu 234 – Jamu Tradisional Di Sleman Yogyakarta',
    description: 'Nikmati jamu tradisional Jamu 234, diracik dari empon-empon pilihan tanpa pemanis buatan untuk menjaga kesehatan dan kebugaran.',
    creator: '@jagadrenata',
    images: ['/twitter-image.jpg'],
  },

  // 📱 Ikon & manifest
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/234.png', type: 'image/png', sizes: '48x48' }],
    shortcut: ['/favicon.ico'],
    apple: [{ url: '/web-app-manifest-192x192.png', sizes: '192x192' }],
  },

  manifest: '/manifest.json',

  

  // 📄 Robots.txt & indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${geistMono.variable}`}>
        {children}
        {process.env.NODE_ENV === 'development' && <Debugger />}
        <RouterProvider />
      </body>
    </html>
  )
}

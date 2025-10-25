import type { Metadata } from 'next'
import Debugger from '@/components/Debugger'
import { Geist_Mono } from 'next/font/google'
import './globals.css'
import RouterProvider from '@/components/RouterProvider'
import { siteMetadata } from '@/lib/metadata'

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = siteMetadata

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

'use client'

import React from 'react'
import Link from 'next/link'
import { MdDashboard, MdShoppingCart, MdReceipt, MdSettings } from 'react-icons/md'
import { useRouteStore } from '@/store/routeStore'

const ClientSidebar = ({ sidebarOpen }: { sidebarOpen: boolean }) => {
  const { currentPath } = useRouteStore()

  // Ambil bagian setelah "clientarea"
  const relativePath = React.useMemo(() => {
    if (!currentPath) return ''
    const parts = currentPath.split('/')
    const idx = parts.indexOf('clientarea')
    if (idx === -1) return currentPath
    return parts.slice(idx + 1).join('/')
  }, [currentPath])

  const links = [
    { href: '', label: 'Dashboard', icon: <MdDashboard className="text-xl" /> },
    { href: 'orders', label: 'Pesanan', icon: <MdShoppingCart className="text-xl" /> },
    { href: 'invoices', label: 'Tagihan', icon: <MdReceipt className="text-xl" /> },
    { href: 'account', label: 'Akun', icon: <MdSettings className="text-xl" /> },
  ]

  return (
    <aside
      className={`fixed md:sticky top-0 z-20 bg-white border-r flex flex-col p-5 w-64 h-screen transform transition-transform duration-300 
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >
      <div className="text-2xl font-bold text-orange-500 mb-6">LOGO</div>

      <nav className="flex flex-col gap-2 text-gray-700">
        {links.map((link) => {
          const isActive =
            relativePath === link.href ||
            relativePath.startsWith(link.href + '/')

          return (
            <Link
              key={link.href}
              href={`/clientarea/${link.href}`}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 transition-colors
                ${
                  isActive
                    ? 'bg-orange-500 text-white'
                    : 'hover:bg-orange-100 hover:text-orange-600'
                }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default ClientSidebar
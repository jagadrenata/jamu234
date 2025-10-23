import { useState } from 'react'
import { IoMenu } from 'react-icons/io5'
import { IoCartOutline } from 'react-icons/io5'
import Cart from '@/components/Cart'
import ClientSidebar from '@/components/ClientSidebar'
import Image from 'next/image'
const ClientNavbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showCart, setShowCart] = useState<boolean>(false)

  return (
    <>
      <nav className='w-screen md:w-[calc(100vw-256px)] h-auto flex items-center justify-between bg-white shadow p- p-4 fixed top-0 right-0 z-10'>
        <div className='flex items-center gap-3'>
          {/* HAMBURGER MENU (mobile only) */}
          <button className='md:hidden text-2xl text-gray-700' onClick={() => setSidebarOpen(!sidebarOpen)}>
            <IoMenu />
          </button>
          <div className='text-xl font-semibold text-gray-800'>Area Pelanggan</div>
        </div>
        <div className='flex items-center gap-4 relative'>
          <IoCartOutline className='cursor-pointer text-3xl text-gray-700 hover:text-orange-500 transition-colors' onClick={() => setShowCart(true)} />
          <Image width={40} height={40} src='/profile.png' alt='profile' className='w-10 h-10 rounded-full border cursor-pointer' />
        </div>
      </nav>
      <ClientSidebar sidebarOpen={sidebarOpen} />
      {/* BACKDROP (mobile sidebar) */}
      {sidebarOpen && <div className='fixed inset-0 bg-black bg-opacity-30 md:hidden z-10' onClick={() => setSidebarOpen(false)} />}
      {showCart && <Cart closeCart={() => setShowCart(false)} />}
    </>
  )
}

export default ClientNavbar

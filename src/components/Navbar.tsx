'use client'
import { useEffect, useState } from 'react'
import Cart from '@/components/Cart'
import { bussinesInfo } from '@/data'
import { HiMenu } from 'react-icons/hi'
import { IoCartOutline, IoClose } from 'react-icons/io5'
import Image from 'next/image'

interface Navigation {
  name: string
  icon: null
  href: string
}

const Navbar = () => {
  const [show, setShow] = useState(false)
  const [showCart, setShowCart] = useState<boolean>(false)
  const [scroll, setScroll] = useState(false)

  const menuActive = show ? 'left-0' : '-left-full'

  const navigations: Navigation[] = [
    {
      name: 'Beranda',
      icon: null,
      href: '/',
    },
    {
      name: 'Tentang',
      icon: null,
      href: '/about',
    },
    {
      name: 'Pesanan Saya',
      icon: null,
      href: '/anon/my-orders',
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 5) {
        setScroll(true)
        setShow(false)
      } else {
        setScroll(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const activeScroll = scroll ? 'py-4 bg-white shadow-md' : 'py-6 bg-transparent'

  return (
    <>
      <nav className={`fixed w-full transition-all duration-300 z-40 ${activeScroll}`}>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between'>
            {/* Logo */}
            <div className='logo flex items-center gap-2'>
              <Image className='w-10 h-10' width={40} height={40} src={bussinesInfo.logoPath ?? '/234.png'} alt={`${bussinesInfo.name ?? 'bussinesInfo.name'} logo`} />
              <span className='text-xl font-bold text-orange-500'>{bussinesInfo.name.charAt(0).toUpperCase() + bussinesInfo.name.slice(1).toLowerCase() ?? 'bussinesInfo.name'}</span>
            </div>

            {/* Menu */}
            <ul
              className={`flex lg:gap-12 md:static md:flex-row md:shadow-none md:bg-transparent 
              md:w-auto md:h-full md:translate-y-0 md:text-gray-800 md:p-0 md:m-0 md:transition-none 
              gap-8 fixed ${menuActive}  flex-col 
              pl-16 pr-24 pb-6 pt-20 h-screen top-0 rounded shadow-lg bg-white font-medium text-orange-600 transition-all`}
            >
              {navigations &&
                navigations.map((navigation: Navigation, id: number) => {
                  return (
                    <li key={id}>
                      <a href={navigation.href} className='hover:text-orange-500 transition-colors'>
                        {navigation.name}
                      </a>
                    </li>
                  )
                })}
              <li className='block md:hidden'>
                <a href='/auth' className='hover:text-orange-500 transition-colors'>
                  Login
                </a>
              </li>
            </ul>

            {/* Action Buttons */}
            <div className='flex items-center gap-4'>
              <a
                href='/auth'
                className='bg-orange-500 px-5 py-2 rounded-full text-white font-semibold 
                hover:bg-orange-600 transition-colors cursor-pointer hidden md:block'
              >
                Login
              </a>
              <IoCartOutline className='cursor-pointer text-3xl text-gray-700 hover:text-orange-500 transition-colors' onClick={() => setShowCart(true)} />

              {show ? (
                <IoClose className='cursor-pointer text-3xl md:hidden block text-gray-700' onClick={() => setShow(false)} />
              ) : (
                <HiMenu className='cursor-pointer text-3xl md:hidden block text-gray-700' onClick={() => setShow(true)} />
              )}
            </div>
          </div>
        </div>
      </nav>

      {showCart && <Cart closeCart={() => setShowCart(false)} />}
    </>
  )
}

export default Navbar

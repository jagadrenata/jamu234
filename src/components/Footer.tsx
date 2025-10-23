import Image from 'next/image'
import { bussinesInfo } from '@/data'

export default function Footer() {
  return (
    <footer className='bg-white rounded-lg shadow-sm m-4'>
      <div className='w-full max-w-screen-xl mx-auto p-4 md:py-8'>
        <div className='sm:flex sm:items-center sm:justify-between'>
          <a href='https://jamu234.biz.id/' className='flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse'>
            <Image width={32} height={32} src={bussinesInfo.logoPath ?? '/234.png'} className='h-8' alt='Company Logo' />
            <span className='self-center text-2xl font-semibold whitespace-nowrap'>{bussinesInfo.name.charAt(0).toUpperCase() + bussinesInfo.name.slice(1).toLowerCase() ?? 'bussinesInfo.name'}</span>
          </a>
          <ul className='flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0'>
            <li>
              <a href='#' className='hover:underline me-4 md:me-6'>
                About
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline me-4 md:me-6'>
                Privacy Policy
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline me-4 md:me-6'>
                Licensing
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline'>
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className='my-6 border-gray-200 sm:mx-auto lg:my-8' />
        <span className='block text-sm text-gray-500 sm:text-center'>
          © 2023{' '}
          <a href='https://jamu234.biz.id/' className='hover:underline'>
            {bussinesInfo.name.charAt(0).toUpperCase() + bussinesInfo.name.slice(1).toLowerCase() ?? 'bussinesInfo.name'}
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  )
}

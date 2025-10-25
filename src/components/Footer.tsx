import Image from 'next/image'
import { businesInfo } from '@/data'

export default function Footer() {
  return (
    <footer className='bg-white rounded-lg shadow-sm m-4'>
      <div className='w-full max-w-screen-xl mx-auto p-4 md:py-8'>
        <div className='sm:flex sm:items-center sm:justify-between'>
          <a href='https://jamu234.biz.id/' className='flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse'>
            <Image width={32} height={32} src={businesInfo.logoPath ?? '/234.png'} className='h-8' alt='Logo Perusahaan' />
            <span className='self-center text-2xl font-semibold whitespace-nowrap'>{businesInfo.name.charAt(0).toUpperCase() + businesInfo.name.slice(1).toLowerCase()}</span>
          </a>

          <ul className='flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0'>
            <li>
              <a href='/about' className='hover:underline me-4 md:me-6'>
                Tentang
              </a>
            </li>
            <li>
              <a href='/privacy-policy' className='hover:underline me-4 md:me-6'>
                Kebijakan Privasi
              </a>
            </li>
            <li>
              <a href='/licensing' className='hover:underline me-4 md:me-6'>
                Lisensi
              </a>
            </li>
            <li>
              <a href='/contact' className='hover:underline'>
                Kontak
              </a>
            </li>
          </ul>
        </div>

        <hr className='my-6 border-gray-200 sm:mx-auto lg:my-8' />

        <span className='block text-sm text-gray-500 sm:text-center'>
          © {new Date().getFullYear()}{' '}
          <a href='https://jamu234.biz.id/' className='hover:underline'>
            {businesInfo.name.charAt(0).toUpperCase() + businesInfo.name.slice(1).toLowerCase()}
          </a>
          . Hak Cipta Dilindungi.
        </span>
      </div>
    </footer>
  )
}

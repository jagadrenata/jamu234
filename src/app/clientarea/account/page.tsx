'use client'
import ClientNavbar from '@/components/ClientNavbar'
import { useRouteStore } from '@/store/routeStore'
import Link from 'next/link'
import Image from 'next/image'

export default function Account() {
  const currentPath = useRouteStore((state) => state.currentPath)

  return (
    <div className='min-h-screen flex flex-col md:flex-row bg-gray-50'>
      <ClientNavbar />

      <div className='pt-24 flex-1 flex flex-col md:ml-0'>
        {/* BREADCRUMB */}
        <div className='px-4 md:px-6 py-3 text-sm text-gray-500'>{currentPath}</div>

        {/* PROFILE CONTENT */}
        <div className='p-4 md:p-6'>
          <h3 className='text-lg md:text-xl font-semibold text-gray-800 mb-4'>Akun Saya</h3>

          <div className='bg-white rounded-xl shadow p-5 w-full'>
            <div className='flex items-center mb-4'>
              <Image width={16 * 4} height={16 * 4} src='https://via.placeholder.com/64' alt='Profile' className='w-16 h-16 rounded-full border mr-4' />
              <div>
                <h4 className='text-lg font-semibold text-gray-800'>Jagad</h4>
                <p className='text-gray-500 text-sm'>jagad@example.com</p>
              </div>
            </div>

            <div className='text-sm text-gray-600 space-y-2'>
              <p>
                <strong>Telepon:</strong> +62 812 3456 7890
              </p>
              <p>
                <strong>Alamat:</strong> Jl. Malioboro No. 12, Yogyakarta
              </p>
            </div>

            <div className='mt-5 flex gap-3'>
              <Link href='/clientarea/account/edit' className='px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm'>
                Edit Profil
              </Link>
              <Link href='/clientarea/account/address' className='px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 text-sm'>
                Edit Alamat
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'
import ClientNavbar from '@/components/ClientNavbar'
import { useRouteStore } from '@/store/routeStore'

export default function EditAccount() {
  const currentPath = useRouteStore((state) => state.currentPath)

  return (
    <div className='min-h-screen flex flex-col md:flex-row bg-gray-50'>
      <ClientNavbar />

      <div className='pt-24 flex-1 flex flex-col md:ml-0'>
        <div className='px-4 md:px-6 py-3 text-sm text-gray-500'>{currentPath}</div>

        <div className='p-4 md:p-6'>
          <h3 className='text-lg md:text-xl font-semibold text-gray-800 mb-4'>Edit Profil</h3>

          <form className='bg-white p-6 rounded-xl shadow w-full space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Nama Lengkap</label>
              <input type='text' className='w-full border rounded-lg px-3 py-2 focus:ring-1 focus:ring-orange-500 outline-none text-sm' defaultValue='Jagad' />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
              <input type='email' className='w-full border rounded-lg px-3 py-2 focus:ring-1 focus:ring-orange-500 outline-none text-sm' defaultValue='jagad@example.com' />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Nomor Telepon</label>
              <input type='tel' className='w-full border rounded-lg px-3 py-2 focus:ring-1 focus:ring-orange-500 outline-none text-sm' defaultValue='+62 812 3456 7890' />
            </div>
            <button type='submit' className='w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm'>
              Simpan Perubahan
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
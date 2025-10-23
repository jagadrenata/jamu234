'use client'
import { useRouteStore } from '@/store/routeStore'
import { FiRefreshCcw } from 'react-icons/fi'
import { IoSearchOutline } from 'react-icons/io5'
import { FaBox, FaClipboardCheck, FaHourglassHalf } from 'react-icons/fa'
import ClientNavbar from '@/components/ClientNavbar'

export default function Page() {
  const currentPath = useRouteStore((state) => state.currentPath)
  return (
    <div className='min-h-screen flex flex-col md:flex-row bg-gray-50'>
      <ClientNavbar />

      {/* MAIN CONTENT */}
      <div className='pt-24 flex-1 flex flex-col md:ml-0'>
        {/* BREADCRUMB */}
        <div className='px-4 md:px-6 py-3 text-sm text-gray-500'> {currentPath && currentPath}</div>

        {/* STATUS CARDS */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 md:px-6'>
          <div className='bg-white shadow rounded-xl p-4 flex justify-between items-center'>
            <div>
              <h4 className='font-semibold text-gray-700'>Pesanan Selesai</h4>
              <span className='text-2xl font-bold text-orange-500'>5</span>
            </div>
            <FaClipboardCheck className='text-orange-500 text-3xl' />
          </div>
          <div className='bg-white shadow rounded-xl p-4 flex justify-between items-center'>
            <div>
              <h4 className='font-semibold text-gray-700'>Pesanan Diproses</h4>
              <span className='text-2xl font-bold text-orange-500'>1</span>
            </div>
            <FaHourglassHalf className='text-orange-500 text-3xl' />
          </div>
          <div className='bg-white shadow rounded-xl p-4 flex justify-between items-center'>
            <div>
              <h4 className='font-semibold text-gray-700'>Tagihan Tertunda</h4>
              <span className='text-2xl font-bold text-orange-500'>5</span>
            </div>
            <FaBox className='text-orange-500 text-3xl' />
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className='p-4 md:p-6'>
          <h3 className='text-lg md:text-xl font-semibold text-gray-800'>Pesanan Anda</h3>
          <p className='text-gray-500 text-sm mb-4'>Menampilkan semua pesanan Anda saat ini.</p>

          {/* Search bar */}
          <div className='flex flex-col sm:flex-row sm:items-center gap-3 mb-4'>
            <div className='flex items-center border rounded-lg px-3 py-2 bg-white w-full sm:max-w-sm'>
              <IoSearchOutline className='text-gray-500 mr-2' />
              <input type='text' placeholder='Cari pesanan...' className='w-full focus:outline-none text-sm' />
            </div>
            <button className='flex items-center justify-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 text-sm'>
              <FiRefreshCcw /> Refresh
            </button>
          </div>

          {/* Table */}
          <div className='overflow-x-auto bg-white rounded-xl shadow'>
            <table className='w-full text-left border-collapse text-sm md:text-base'>
              <thead>
                <tr className='bg-white text-gray-700 text-sm border-b'>
                  <th className='p-3 whitespace-nowrap'>Produk</th>
                  <th className='p-3 whitespace-nowrap'>Varian</th>
                  <th className='p-3 whitespace-nowrap'>Tanggal</th>
                  <th className='p-3 whitespace-nowrap'>ID Order</th>
                  <th className='p-3 whitespace-nowrap'>Status</th>
                  <th className='p-3 whitespace-nowrap'>Total</th>
                  <th className='p-3 text-center whitespace-nowrap'>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr className='hover:bg-orange-50'>
                  <td className='p-3 border-b'>Kopi Arabika Premium</td>
                  <td className='p-3 border-b'>250ml</td>
                  <td className='p-3 border-b'>2 Okt 2025</td>
                  <td className='p-3 border-b'>#12345</td>
                  <td className='p-3 border-b text-green-600 font-semibold'>Selesai</td>
                  <td className='p-3 border-b'>Rp 45.000</td>
                  <td className='p-3 border-b text-center'>
                    <button className='text-orange-500 hover:underline'>Lihat</button>
                  </td>
                </tr>
                <tr className='hover:bg-orange-50'>
                  <td className='p-3 border-b'>Teh Hitam Premium</td>
                  <td className='p-3 border-b'>1 Liter</td>
                  <td className='p-3 border-b'>1 Okt 2025</td>
                  <td className='p-3 border-b'>#12344</td>
                  <td className='p-3 border-b text-yellow-600 font-semibold'>Diproses</td>
                  <td className='p-3 border-b'>Rp 30.000</td>
                  <td className='p-3 border-b text-center'>
                    <button className='text-orange-500 hover:underline'>Lihat</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

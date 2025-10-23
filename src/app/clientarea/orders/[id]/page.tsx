'use client'

import { useRouter } from 'next/navigation'
import { useRouteStore } from '@/store/routeStore'
import ClientNavbar from '@/components/ClientNavbar'
import { FaMapMarkerAlt, FaTruck, FaShoppingBag, FaMoneyBillWave } from 'react-icons/fa'
import { MdContentCopy } from 'react-icons/md'

export default function OrderDetailPage() {
  const router = useRouter()
  const currentPath = useRouteStore((state) => state.currentPath)

  const order = {
    id: '250802R2RPNG5S',
    status: 'Pesanan tiba di alamat tujuan. Diterima oleh yang bersangkutan.',
    courier: 'SPX Standard - SPXID057402036198',
    deliveryDate: '05-08-2025 15:28',
    name: 'Jagad Renata',
    phone: '+62 882-0061-86099',
    address: 'blok 5a (barat tugu rumah no 3), KAB. SLEMAN, MLATI, DI YOGYAKARTA, 55288',
    product: {
      name: 'Aki Motor GTZ5S MF Aki Kering Motor Beat Vario',
      image: '/images/aki.jpg',
      price: 99900,
      total: 91910,
    },
    method: 'COD',
    time: {
      order: '02-08-2025 16:53',
      pay: '05-08-2025 15:28',
      ship: '04-08-2025 16:53',
      done: '08-08-2025 09:44',
    },
  }

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text)

  return (
    <div className='min-h-screen flex flex-col md:flex-row bg-gray-50'>
      <ClientNavbar />

      {/* MAIN CONTENT */}
      <div className='pt-24 flex-1 flex flex-col md:ml-0'>
        {/* BREADCRUMB */}
        <div className='px-4 md:px-6 py-2 text-sm text-gray-500 flex items-center gap-2'>
          {currentPath && <span>{currentPath}</span>}
        </div>

        {/* CONTENT */}
        <div className='px-4 md:px-6 pb-6 space-y-3'>
          <h3 className='text-base md:text-lg font-semibold text-gray-800 mb-1'>Rincian Pesanan</h3>

          {/* Info Pengiriman */}
          <div className='bg-white rounded-lg shadow-sm p-3 md:p-4'>
            <h2 className='font-semibold text-gray-800 flex items-center mb-1 text-sm md:text-base'>
              <FaTruck className='mr-2 text-orange-500' /> Informasi Pengiriman
            </h2>
            <p className='text-sm text-gray-700'>{order.courier}</p>
            <p className='text-green-600 text-sm mt-1 font-medium'>{order.status}</p>
            <p className='text-xs text-gray-500 mt-1'>{order.deliveryDate}</p>
          </div>

          {/* Alamat Pengiriman */}
          <div className='bg-white rounded-lg shadow-sm p-3 md:p-4'>
            <h2 className='font-semibold text-gray-800 flex items-center mb-1 text-sm md:text-base'>
              <FaMapMarkerAlt className='mr-2 text-orange-500' /> Alamat Pengiriman
            </h2>
            <p className='font-medium text-sm'>{order.name}</p>
            <p className='text-sm text-gray-700'>{order.phone}</p>
            <p className='text-sm text-gray-700 mt-1'>{order.address}</p>
          </div>

          {/* Produk */}
          <div className='bg-white rounded-lg shadow-sm p-3 md:p-4'>
            <h2 className='font-semibold text-gray-800 flex items-center mb-2 text-sm md:text-base'>
              <FaShoppingBag className='mr-2 text-orange-500' /> Produk Dipesan
            </h2>
            <div className='flex items-center'>
              <img src={order.product.image} alt='produk' className='w-14 h-14 rounded-lg object-cover mr-3 border' />
              <div className='flex-1'>
                <p className='font-medium text-sm leading-snug'>{order.product.name}</p>
                <p className='text-orange-500 font-semibold text-sm mt-1'>Rp{order.product.price.toLocaleString('id-ID')}</p>
              </div>
            </div>
            <div className='border-t mt-2 pt-2 flex justify-between text-sm'>
              <span className='font-medium'>Total Pesanan</span>
              <span className='text-orange-600 font-semibold'>Rp{order.product.total.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Metode Pembayaran */}
          <div className='bg-white rounded-lg shadow-sm p-3 md:p-4'>
            <h2 className='font-semibold text-gray-800 flex items-center mb-1 text-sm md:text-base'>
              <FaMoneyBillWave className='mr-2 text-orange-500' /> Metode Pembayaran
            </h2>
            <p className='text-sm font-medium'>{order.method}</p>
          </div>

          {/* Rincian Waktu */}
          <div className='bg-white rounded-lg shadow-sm p-3 md:p-4'>
            <h2 className='font-semibold text-gray-800 mb-1 text-sm md:text-base'>Rincian Waktu</h2>
            <div className='text-sm space-y-0.5'>
              <p>Waktu Pemesanan: {order.time.order}</p>
              <p>Waktu Pembayaran: {order.time.pay}</p>
              <p>Waktu Pengiriman: {order.time.ship}</p>
              <p>Waktu Selesai: {order.time.done}</p>
            </div>
          </div>

          {/* Nomor Pesanan */}
          <div className='bg-white rounded-lg shadow-sm p-3 md:p-4'>
            <div className='flex justify-between items-center'>
              <div>
                <p className='text-xs text-gray-600'>Nomor Pesanan</p>
                <p className='font-semibold text-gray-800 text-sm'>{order.id}</p>
              </div>
              <button onClick={() => copyToClipboard(order.id)} className='text-gray-600 hover:text-orange-500 transition'>
                <MdContentCopy size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useMyOrderStore } from '@/store/myOrdersStore'
import { useSearchParams } from 'next/navigation'
import jwt from 'jsonwebtoken'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PaymentSuccess from '@/components/PaymentSuccess'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import { FaSearch } from 'react-icons/fa'

interface DecodedOrderToken {
  order_id: string
  name: string
  phone: string
  email: string
}

export default function MyOrder() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [success, setSuccess] = useState(false)

  const { myOrders, addOrder, exists } = useMyOrderStore()
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')

  // Decode token ref Midtrans dan tambahkan order baru ke store
  useEffect(() => {
    if (!ref) return

    const fetchOrder = async (decoded: DecodedOrderToken) => {
      try {
        if (exists(decoded.order_id)) return
        const res = await fetch(`/api/orders/${decoded.order_id}?email=${decoded.email}`)
        if (!res.ok) throw new Error('Gagal mengambil data order')
        const { order, items } = await res.json()

        addOrder({
          id: order.id,
          total_price: order.total_price,
          status: order.status,
          name: order.name,
          phone: order.phone,
          email: order.email,
          created_at: order.created_at,
          items,
        })
        setSuccess(true)
      } catch (err) {
        console.error('Fetch order error:', err)
      }
    }

    try {
      const decoded = jwt.decode(ref) as DecodedOrderToken | null
      if (!decoded?.order_id) return

      // Selalu ambil data terbaru dari DB
      fetchOrder(decoded)
    } catch (err) {
      console.error('Invalid ref token:', err)
    }
  }, [ref])

  // Filter dan pencarian
  const filteredOrders = myOrders.filter((o) => {
    const matchStatus = filterStatus === 'all' || o.status === filterStatus
    const matchSearch = search.trim() === '' || o.id.toString().toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <>
      <Navbar />

      {success && (
        <PaymentSuccess
          orderId={
            ref
              ? // pastikan hasil decode bertipe aman
                (jwt.decode(ref) as { order_id?: string } | null)?.order_id ?? '-'
              : '-'
          }
          amount={0}
          onViewOrder={() => {
            window.scrollTo({ top: 400, behavior: 'smooth' })
          }}
          onDownload={() => alert('Unduh bukti pembayaran')}
          onContinue={() => window.location.reload()}
        />
      )}

      <div className=' pb-10 pt-32'>
        {/* FILTER & SEARCH */}
        <div className='container mx-auto'>
          <div className='p-4 shadow-sm flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between'>
            <div className='flex items-center border rounded overflow-hidden w-full sm:w-1/2'>
              <input type='text' placeholder='Cari Order ID...' className='flex-1 px-3 py-2 outline-none' value={search} onChange={(e) => setSearch(e.target.value)} />
              <button className='px-3 text-gray-500'>
                <FaSearch />
              </button>
            </div>

            <select className='border px-3 py-2 rounded w-full sm:w-auto' value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value='all'>Semua Status</option>
              <option value='pending'>Pending</option>
              <option value='paid'>Dibayar</option>
              <option value='complete'>Selesai</option>
              <option value='failed'>Gagal</option>
            </select>
          </div>

          {/* LIST ORDER */}
          <div className='p-4 grid gap-4 md:grid-cols-2'>
            {filteredOrders.length === 0 ? (
              <div className='text-gray-500 text-center col-span-2 py-10'>Tidak ada pesanan disimpan.</div>
            ) : (
              filteredOrders.map((order) => {
                const statusColor =
                  order.status === 'pending'
                    ? 'bg-orange-500'
                    : order.status === 'paid'
                    ? 'bg-green-500'
                    : order.status === 'complete'
                    ? 'bg-blue-500'
                    : order.status === 'failed'
                    ? 'bg-red-500'
                    : 'bg-gray-400'

                const statusLabel =
                  order.status === 'pending' ? 'Pending' : order.status === 'paid' ? 'Dibayar' : order.status === 'complete' ? 'Selesai' : order.status === 'failed' ? 'Gagal' : 'Tidak Diketahui'

                return (
                  <div key={order.id} className='relative bg-white shadow-md rounded p-4 flex flex-col justify-between'>
                    <span className={`absolute top-3 right-3 ${statusColor} text-white text-xs font-semibold px-3 py-1 rounded-xl`}>{statusLabel}</span>

                    <div>
                      <h2 className='font-semibold text-orange-500'>Order #{order.id}</h2>
                      <p className='text-sm text-gray-500'> {order.created_at ? new Date(order.created_at).toLocaleString('id-ID') : '-'}</p>
                      <div className='mt-3 space-y-1 text-sm text-gray-700'>
                        <p>Nama: {order.name}</p>
                        <p>Email: {order.email}</p>
                        <p>Telepon: {order.phone}</p>
                      </div>
                    </div>

                    <div className='mt-4 flex justify-between items-center'>
                      <span className='font-semibold text-gray-700'>Total: Rp{order.total_price?.toLocaleString() || 0}</span>
                      {order.midtrans_url ? (
                        <Link href={order.midtrans_url} target='_blank' className='bg-orange-500 text-white text-sm px-4 py-2 rounded hover:bg-orange-600'>
                          Bayar
                        </Link>
                      ) : (
                        <button disabled className='bg-gray-300 text-gray-500 text-sm px-4 py-2 rounded'>
                          Tidak tersedia
                        </button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      <WhatsAppFloat />
      <Footer />
    </>
  )
}

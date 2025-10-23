/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { FaSearch, FaShoppingBag } from 'react-icons/fa'
import { useMyOrdersStore } from '@/store/myOrdersStore'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppFloat from '@/components/WhatsAppFloat'

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [filteredOrders, setFilteredOrders] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const { addOrder } = useMyOrdersStore()

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('anon_orders').select(`
    id,
    total_price,
    status,
    created_at,
    midtrans_url,
    midtrans_token,
    anon_order_items (
      quantity,
      price,
      product_variants (
        name,
        img
      )
    )
  `)

      console.log(data)
      if (!error && data) {
        setOrders(data)
        setFilteredOrders(data)
      }
      setLoading(false)
    }
    fetchOrders()
  }, [])

  // Filter dan search
  useEffect(() => {
    let filtered = [...orders]
    if (filterStatus !== 'all') {
      filtered = filtered.filter((o) => o.status === filterStatus)
    }
    if (search.trim() !== '') {
      filtered = filtered.filter((o) => o.id.toLowerCase().includes(search.toLowerCase()))
    }
    setFilteredOrders(filtered)
  }, [filterStatus, search, orders])

  if (loading) return <div className='text-center py-10 text-gray-500'>Memuat pesanan...</div>

  return (
    <>
      <Navbar />

      <div className='bg-gray-50 pb-10 pt-32'>
        {/* FILTER & SEARCH */}
        <div className='p-4 shadow-sm flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between'>
          <div className='flex items-center border rounded-lg overflow-hidden w-full sm:w-1/2'>
            <input type='text' placeholder='Cari Order ID...' className='flex-1 px-3 py-2 outline-none' value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className='px-3 text-gray-500'>
              <FaSearch />
            </button>
          </div>
          <select className='border px-3 py-2 rounded-lg w-full sm:w-auto' value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
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
            <div className='text-gray-500 text-center col-span-2 py-10'>Tidak ada pesanan ditemukan.</div>
          ) : (
            filteredOrders.map((order) => {
              // Warna status
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
                <div key={order.id} className='relative bg-white shadow-md rounded-xl p-4 flex flex-col justify-between'>
                  {/* STATUS BADGE */}
                  <span className={`absolute top-3 right-3 ${statusColor} text-white text-xs font-semibold px-3 py-1 rounded-full`}>{statusLabel}</span>

                  <div>
                    <h2 className='font-semibold text-orange-500'>Order #{order.id}</h2>
                    <p className='text-sm text-gray-500'>{new Date(order.created_at).toLocaleString('id-ID')}</p>

                    <div className='mt-3 space-y-2'>
                      {order.anon_order_items.map((item: any, i: number) => (
                        <div key={i} className='flex items-center gap-3 border-b pb-2'>
                          {item.product_variants?.img && <img src={item.product_variants.img[0]} alt={item.product_variants.name} className='w-14 h-14 rounded-lg object-cover' />}
                          <div className='flex-1'>
                            <p className='font-medium'>{item.product_variants?.name}</p>
                            <p className='text-sm text-gray-500'>
                              {item.quantity}x - Rp{item.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className='mt-4 flex justify-between items-center'>
                    <span className='font-semibold text-gray-700'>Total: Rp{order.total_price.toLocaleString()}</span>
                    {order.midtrans_url ? (
                      <Link href={order.midtrans_url} target='_blank' className='bg-orange-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-orange-600'>
                        Bayar
                      </Link>
                    ) : (
                      <button disabled className='bg-gray-300 text-gray-500 text-sm px-4 py-2 rounded-lg'>
                        Tidak tersedia
                      </button>
                    )}
                  </div>

                  <div className='mt-2 text-xs text-gray-400'>Token: {order.midtrans_token || '-'}</div>
                </div>
              )
            })
          )}
        </div>
      </div>
      <WhatsAppFloat />
      <Footer />
    </>
  )
}

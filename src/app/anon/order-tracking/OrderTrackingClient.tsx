'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

type Product = { name: string; img?: string[] }
type ProductVariant = { id: number; name?: string; img?: string[]; products?: Product }
type AnonOrder = {
  id: number
  total_price: number
  phone: string
  email?: string
  name: string
  status: 'pending' | 'completed' | 'cancelled' | string
}
type AnonOrderItem = {
  id: number
  quantity: number
  price: number
  product_variants: ProductVariant
  anon_orders: AnonOrder
}
type OrderItem = {
  productName: string
  variantName?: string
  img: string
  quantity: number
  price: number
}
type Order = {
  id: number
  status: string
  total: number
  items: OrderItem[]
}

export default function OrderTrackingClient() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  const searchParams = useSearchParams()
  const queryName = searchParams.get('name') || ''
  const queryPhone = searchParams.get('phone') || ''
  const queryOrderId = searchParams.get('id') || searchParams.get('orderid')

  useEffect(() => {
    if (queryName && queryPhone) {
      setName(queryName)
      setPhone(queryPhone)
      handleSearch(queryName, queryPhone, queryOrderId || undefined)
    }
  }, [queryName, queryPhone, queryOrderId])

  const handleSearch = async (n = name, p = phone, id?: string) => {
    setLoading(true)
    try {
      const result = await searchAnonOrder(n, p, id)
      setOrders(result)
    } catch (err) {
      alert('Gagal mencari pesanan.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function searchAnonOrder(name: string, phone: string, orderId?: string): Promise<Order[]> {
    const { data, error } = await supabase.from('anon_order_items').select(`
        id,
        quantity,
        price,
        product_variants(id, name, img, products(name, img)),
        anon_orders(id, total_price, phone, email, name, status)
      `)

    if (error) throw error
    if (!data) return []

    const typedData = data as unknown as AnonOrderItem[]

    const filtered = typedData.filter((item) => {
      const matchName = item.anon_orders?.name?.toLowerCase().includes(name.toLowerCase())
      const matchPhone = item.anon_orders?.phone === phone
      const matchId = orderId ? item.anon_orders?.id.toString() === orderId : true
      return matchName && matchPhone && matchId
    })

    const groupedMap = new Map<number, Order>()
    for (const item of filtered) {
      const orderId = item.anon_orders.id
      if (!groupedMap.has(orderId)) {
        groupedMap.set(orderId, {
          id: orderId,
          status: item.anon_orders.status,
          total: item.anon_orders.total_price,
          items: [],
        })
      }

      const order = groupedMap.get(orderId)!
      order.items.push({
        productName: item.product_variants?.products?.name || 'Produk tidak diketahui',
        variantName: item.product_variants?.name || '',
        img: item.product_variants?.img?.[0] || item.product_variants?.products?.img?.[0] || '/no-image.png',
        quantity: item.quantity,
        price: item.price,
      })
    }

    return Array.from(groupedMap.values())
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4'>
      <h1 className='text-2xl font-bold text-center mb-4 text-orange-500'>Lacak Pesanan Anonim</h1>

      <div className='bg-white shadow-md p-4 rounded-lg space-y-3'>
        <input
          type='text'
          placeholder='Nama penerima'
          className='w-full border p-2 rounded focus:ring-2 focus:ring-orange-400'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type='text'
          placeholder='Nomor HP'
          className='w-full border p-2 rounded focus:ring-2 focus:ring-orange-400'
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button
          onClick={() => handleSearch()}
          disabled={loading}
          className='bg-orange-500 hover:bg-orange-600 text-white w-full p-2 rounded font-medium transition'
        >
          {loading ? 'Mencari...' : 'Cari Pesanan'}
        </button>
      </div>

      {orders.length > 0 ? (
        <div className='mt-6 space-y-4'>
          {orders.map((order) => (
            <div key={order.id} className='bg-white shadow p-4 rounded-lg border border-gray-100'>
              <div className='flex justify-between items-center mb-2'>
                <h2 className='font-semibold text-lg text-orange-500'>Pesanan #{order.id}</h2>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    order.status === 'pending'
                      ? 'bg-orange-100 text-orange-800'
                      : order.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <p className='text-sm text-gray-700 mb-3'>
                Total: <span className='font-semibold text-orange-500'>Rp{order.total.toLocaleString('id-ID')}</span>
              </p>

              <div className='space-y-3'>
                {order.items.map((item, i) => (
                  <div key={i} className='flex gap-3 items-center border-t pt-2'>
                    <Image
                      src={item.img}
                      alt={item.productName}
                      width={60}
                      height={60}
                      className='rounded-lg object-cover w-16 h-16 border'
                    />
                    <div className='flex-1'>
                      <p className='font-medium'>{item.productName}</p>
                      {item.variantName && <p className='text-sm text-gray-600'>Varian: {item.variantName}</p>}
                      <p className='text-sm text-gray-600'>
                        {item.quantity} x Rp{item.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href={`https://wa.me/6281234567890?text=Halo, saya ingin menanyakan status pesanan #${order.id}`}
                target='_blank'
                rel='noopener noreferrer'
                className='mt-4 block text-center bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg font-medium transition'
              >
                Hubungi Penjual
              </a>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className='text-center text-gray-500 mt-6'>Belum ada pesanan ditemukan</p>
      )}
    </div>
  )
}
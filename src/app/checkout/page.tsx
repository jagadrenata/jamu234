'use client'
import { useEffect, useState } from 'react'
import { FaMapMarkerAlt, FaBoxOpen, FaLock, FaChevronRight,FaHome } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useSelectedCartStore } from '@/store/selectedCartStore'
import { useCartsStore } from '@/store/cartStore'
import { v4 as uuidv4 } from 'uuid'
import { alertSuccess, alertError } from '@/lib/alert'
import type { FormEvent } from 'react'
import type { Cart } from '@/store/cartStore'

export interface Variant {
  id: number
  name: string
  price: number
  img: string[]
  products: {
    name: string
    img: string[]
  }
}

interface CheckoutItem extends Cart {
  productName: string
  variantName: string
  price: number
  img: string
}

interface BuyerForm {
  name: string
  email: string
  phone: string
}

export default function Checkout() {
  const { selectedCarts, clearSelection } = useSelectedCartStore()
  const { carts } = useCartsStore()
  const [items, setItems] = useState<CheckoutItem[]>([])
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const selectedItems = carts.filter((c: Cart) => selectedCarts.includes(c.id))
      if (selectedItems.length === 0) {
        setItems([])
        setLoading(false)
        return
      }

      // Ambil data varian produk
      const variantIds = selectedItems.map((i: Cart) => i.id)
      const { data, error } = await supabase.from('product_variants').select('id, name, price, img, products(name, img)').in('id', variantIds)

      const variants = data as unknown as Variant[]

      if (error) {
        console.error(error)
        setLoading(false)
        return
      }

      // Gabungkan cart + data varian
      const merged = selectedItems.map((cart: Cart) => {
        const variant = variants.find((v: Variant) => v.id === cart.id)
        const product = variant?.products

        return {
          ...cart,
          productName: product?.name || 'Produk tidak ditemukan',
          variantName: variant?.name || '-',
          price: variant?.price || 0,
          img: variant?.img?.[0] || product?.img?.[0] || '/234.png',
        }
      })

      setItems(merged)
      setLoading(false)
    }

    fetchData()
  }, [carts, selectedCarts])

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone) return alertError('Lengkapi semua data pembeli.')

    try {
      const orderId = `anon-${uuidv4().slice(0, 8)}`
      const total = subtotal

      // Simpan ke tabel anon_orders
      const { error: orderErr } = await supabase.from('anon_orders').insert([
        {
          id: orderId,
          name: form.name,
          email: form.email,
          phone: form.phone,
          total_price: total,
          status: 'pending',
        },
      ])
      if (orderErr) throw orderErr

      //  Simpan item pesanan
      const orderItems = items.map((item) => ({
        order_id: orderId,
        variant_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }))
      const { error: itemErr } = await supabase.from('anon_order_items').insert(orderItems)
      if (itemErr) throw itemErr

      // Panggil API Midtrans
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          total_price: total,
          name: form.name,
          email: form.email,
          phone: form.phone,
        }),
      })
      const data = await res.json()
      if (!data.redirect_url) throw new Error('Tidak dapat membuat transaksi.')

      clearSelection()
      alertSuccess('Pesanan berhasil dibuat! Mengarahkan ke pembayaran...')
      window.location.href = data.redirect_url
    } catch (err) {
      console.error(err)
      alertError('Checkout gagal.')
    }
  }

  const formatRp = (num?: number) => 'Rp ' + (num ? num.toLocaleString('id-ID') : '0')

  if (loading) return <div className='p-5 text-center'>Memuat...</div>

  const isEmpty = !selectedCarts || selectedCarts.length === 0

  return (
    <div className='w-screen min-h-screen bg-gray-50 flex flex-col'>
      {/* Header */}
      <div className='w-full shadow-sm p-4 flex justify-between items-center bg-white sticky top-0 z-10'>
        <h3 className='text-xl font-semibold text-slate-800'>Periksa Kembali Pesanan</h3>
      </div>

      {isEmpty ? (
        // Tampilan jika tidak ada pesanan
        <div className='flex flex-col justify-center items-center flex-1 text-center p-6'>
          <FaBoxOpen className='text-gray-400 text-6xl mb-4' />
          <h2 className='text-lg font-semibold text-gray-700 mb-2'>Pesanan Tidak Ditemukan</h2>
          <p className='text-gray-500 mb-6 max-w-xs'>Kamu belum menambahkan produk ke dalam keranjang. Yuk kembali dan pilih produk favoritmu!</p>
          <Link href='/' className='inline-flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:bg-orange-600 active:bg-orange-700 transition'>
            <FaHome className='text-white' />
            Kembali ke Beranda
          </Link>
        </div>
      ) : (
        // Tampilan jika ada pesanan
        <div className='p-3 gap-3 flex flex-col max-w-2xl mx-auto w-full'>
          {/* Produk Dipesan */}
          <div className='my-2 p-3 shadow-md border border-gray-100 rounded-xl bg-white'>
            <div className='flex items-center gap-2 mb-3'>
              <FaBoxOpen className='text-orange-500 w-5 h-5' />
              <h3 className='text-lg font-medium text-slate-800'>Produk Dipesan</h3>
            </div>

            {items.map((item, i) => (
              <div key={i} className='flex flex-col sm:flex-row items-center sm:items-start gap-3 p-3 border rounded-lg mb-2 hover:shadow-sm transition'>
                <Image width={96} height={96} alt='Gambar Produk' src={item.img || '/234.png'} className='w-24 h-24 border rounded-md object-cover' />
                <div className='flex flex-col text-center sm:text-left'>
                  <span className='text-base font-medium text-slate-800'>{item.productName}</span>
                  <span className='text-sm text-slate-500'>{item.variantName}</span>
                  <span className='text-sm text-slate-600'>×{item.quantity}</span>
                  <span className='text-base font-semibold text-orange-500 mt-1'>{formatRp(item.price)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Form Pembeli */}
          <div className='bg-white rounded-xl shadow-md w-full p-6'>
            <h2 className='text-lg font-semibold mb-4 text-slate-800'>Informasi Pembeli</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Alamat Email <span className='text-red-500'>*</span>
                </label>
                <input
                  type='email'
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder='contoh@email.com'
                  className='w-full border rounded-lg px-3 py-2 focus:ring focus:ring-orange-300 focus:outline-none'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>
                  Nama Lengkap <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder='Masukkan nama lengkap'
                  className='w-full border rounded-lg px-3 py-2 focus:ring focus:ring-orange-300 focus:outline-none'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>
                  Nomor HP / WhatsApp <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder='08xxxxxxxxxx'
                  className='w-full border rounded-lg px-3 py-2 focus:ring focus:ring-orange-300 focus:outline-none'
                />
              </div>

              {/* Rincian Pembayaran */}
              <h2 className='text-lg font-semibold mt-6 mb-2 text-slate-800'>Rincian Pembayaran</h2>
              <div className='space-y-1 text-sm'>
                <div className='flex justify-between'>
                  <span>Subtotal</span>
                  <span>{formatRp(subtotal)}</span>
                </div>
                <div className='flex justify-between font-bold border-t pt-2 mt-2'>
                  <span>Total Pembayaran</span>
                  <span>{formatRp(subtotal)}</span>
                </div>
              </div>

              {/* Tombol Beli */}
              <button
                type='submit'
                disabled={!items.length}
                className='w-full mt-6 bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 active:bg-orange-700 shadow-md transition disabled:opacity-60'
              >
                BELI SEKARANG - {formatRp(subtotal)}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}


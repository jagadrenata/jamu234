'use client'
import { useEffect, useState } from 'react'
import { FaMapMarkerAlt, FaBoxOpen, FaLock, FaChevronRight, FaHome } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '@/lib/supabase'
import type { Cart } from '@/store/cartStore'
import { useCartsStore } from '@/store/cartStore'
import { useSelectedCartStore } from '@/store/selectedCartStore'
import { alertSuccess, alertError } from '@/lib/alert'
import type { FormEvent } from 'react'
import { businesInfo } from '@/data'

const Map = dynamic(() => import('@/components/Map'), { ssr: false })

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
}

export default function Checkout() {
  const { selectedCarts, clearSelection } = useSelectedCartStore()
  const { carts } = useCartsStore()
  const [items, setItems] = useState<CheckoutItem[]>([])
  const [form, setForm] = useState({ name: '', email: '', phone: null })
  const [loading, setLoading] = useState(true)
  const [deliveryOption, setDeliveryOption] = useState<'stembayo' | 'rumah' | 'ambil'>('stembayo')
  const [stembayoData, setStembayoData] = useState({ role: 'murid', location: '', note: '' })
  const [mapPosition, setMapPosition] = useState({ lat: -7.7544, lng: 110.3707 })
  const [addressNote, setAddressNote] = useState('')

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
    if (!form.name || !form.email) return alertError('Lengkapi semua data pembeli.')

    try {
      const total = subtotal
      let deliveryText = ''
      let address: { lat: number; lng: number } | null = null

      if (deliveryOption === 'stembayo') {
        deliveryText =
          `Pengantaran: Area Stembayo\n` + `Peran: ${stembayoData.role}\n` + `Nama penerima: ${form.name}\n` + `Lokasi: ${stembayoData.location}\n` + `Catatan: ${stembayoData.note || '-'}`
      } else if (deliveryOption === 'rumah') {
        deliveryText = `Pengantaran: Ke Rumah (maks 1 km)\n` + `Koordinat: ${mapPosition.lat.toFixed(5)}, ${mapPosition.lng.toFixed(5)}\n` + `Catatan: ${addressNote || '-'}`
        address = mapPosition
      } else {
        deliveryText = `Pengambilan di rumah penjual`
      }

      // 🔹 Kirim ke API server, bukan langsung Supabase
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          total_price: total,
          address,
          delivery_option: deliveryText,
          items: items.map((item) => ({
            variant_id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal membuat pesanan')

      // 🔹 Format daftar produk untuk WhatsApp
      const productList = items.map((item) => `- ${item.productName} ×${item.quantity}`).join('\n')

      const message = encodeURIComponent(
        `Halo Admin, saya ingin melakukan pesanan.\n\n` +
          `🆔 ID Pesanan: ${data.order.id}\n` +
          `👤 Nama: ${form.name}\n` +
          `📧 Email: ${form.email}\n` +
          `🛍️ Produk:\n${productList}\n\n` +
          `💰 Total: ${formatRp(total)}\n` +
          `📦 Status: pending\n\n` +
          `${deliveryText}\n\n` +
          `Mohon verifikasi pesanan saya.`,
      )

      const waUrl = `https://wa.me/${businesInfo.contacsInfo.whatsapp}?text=${message}`

      clearSelection()
      alertSuccess('Pesanan berhasil dikirim! Mengarahkan ke WhatsApp...')
      window.location.href = waUrl
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
          <Link href='/' className='inline-flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded font-medium shadow-md hover:bg-orange-600 active:bg-orange-700 transition'>
            <FaHome className='text-white' />
            Kembali ke Beranda
          </Link>
        </div>
      ) : (
        // Tampilan jika ada pesanan
        <div className='p-3 gap-3 flex flex-col max-w-2xl mx-auto w-full'>
          {/* Produk Dipesan */}
          <div className='my-2 p-3 shadow-md border border-gray-100 rounded bg-white'>
            <div className='flex items-center gap-2 mb-3'>
              <FaBoxOpen className='text-orange-500 w-5 h-5' />
              <h3 className='text-lg font-medium text-slate-800'>Produk Dipesan</h3>
            </div>

            {items.map((item, i) => (
              <div key={i} className='flex flex-col sm:flex-row items-center sm:items-start gap-3 p-3 border rounded mb-2 hover:shadow-sm transition'>
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
          <div className='bg-white rounded shadow-md w-full p-6'>
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
                  className='w-full border rounded px-3 py-2 focus:ring focus:ring-orange-300 focus:outline-none'
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
                  className='w-full border rounded px-3 py-2 focus:ring focus:ring-orange-300 focus:outline-none'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>
                  Nomor HP / WhatsApp <span className='text-red-500'>*</span>
                </label>
              </div>

              {/* Opsi Pengantaran */}
              <h2 className='text-lg font-semibold mt-6 mb-3 text-slate-800'>Opsi Pengantaran</h2>
              <div className='grid gap-3'>
                {/* Diantar ke Stembayo */}
                <div
                  onClick={() => setDeliveryOption('stembayo')}
                  className={`p-4 rounded border-2 cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                    deliveryOption === 'stembayo' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                  }`}
                >
                  <FaMapMarkerAlt className={`text-lg ${deliveryOption === 'stembayo' ? 'text-orange-500' : 'text-gray-400'}`} />
                  <div>
                    <h3 className='font-medium text-slate-800'>Diantar ke Area Stembayo</h3>
                    <p className='text-sm text-slate-500'>Khusus area sekolah</p>
                  </div>
                </div>

                {deliveryOption === 'stembayo' && (
                  <div className='mt-3 bg-white border rounded p-4 space-y-3 shadow-sm'>
                    <div className='flex gap-4'>
                      <button
                        type='button'
                        onClick={() => setStembayoData({ ...stembayoData, role: 'guru' })}
                        className={`flex-1 py-2 rounded font-medium border text-center transition ${
                          stembayoData.role === 'guru' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-slate-700 border-gray-300 hover:border-orange-400'
                        }`}
                      >
                        Guru
                      </button>
                      <button
                        type='button'
                        onClick={() => setStembayoData({ ...stembayoData, role: 'murid' })}
                        className={`flex-1 py-2 rounded font-medium border text-center transition ${
                          stembayoData.role === 'murid' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-slate-700 border-gray-300 hover:border-orange-400'
                        }`}
                      >
                        Murid
                      </button>
                    </div>

                    <input
                      type='text'
                      placeholder='Lokasi (contoh: kelas 11 DPIB, ruang guru)'
                      className='w-full border rounded px-3 py-2 focus:ring focus:ring-orange-200 outline-none'
                      value={stembayoData.location}
                      onChange={(e) => setStembayoData({ ...stembayoData, location: e.target.value })}
                    />

                    <textarea
                      placeholder='Catatan tambahan (opsional)'
                      className='w-full border rounded px-3 py-2 focus:ring focus:ring-orange-200 outline-none'
                      value={stembayoData.note}
                      onChange={(e) => setStembayoData({ ...stembayoData, note: e.target.value })}
                    />
                  </div>
                )}

                {/* Antar ke Rumah */}
                <div
                  onClick={() => setDeliveryOption('rumah')}
                  className={`p-4 rounded border-2 cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                    deliveryOption === 'rumah' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                  }`}
                >
                  <FaHome className={`text-lg ${deliveryOption === 'rumah' ? 'text-orange-500' : 'text-gray-400'}`} />
                  <div>
                    <h3 className='font-medium text-slate-800'>Antar ke Rumah</h3>
                    <p className='text-sm text-slate-500'>Maksimal 1 km dari lokasi penjual</p>
                  </div>
                </div>

                {deliveryOption === 'rumah' && (
                  <div className='mt-3 bg-white border rounded p-4 space-y-3 shadow-sm'>
                    <Map position={mapPosition} onChange={setMapPosition} />
                    <textarea
                      placeholder='Keterangan alamat (opsional)'
                      className='w-full border rounded px-3 py-2 focus:ring focus:ring-orange-200 outline-none'
                      value={addressNote}
                      onChange={(e) => setAddressNote(e.target.value)}
                    />
                  </div>
                )}

                {/* 🔸 Ambil di Rumah Penjual */}
                <div
                  onClick={() => setDeliveryOption('ambil')}
                  className={`p-4 rounded border-2 cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                    deliveryOption === 'ambil' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                  }`}
                >
                  <FaBoxOpen className={`text-lg ${deliveryOption === 'ambil' ? 'text-orange-500' : 'text-gray-400'}`} />
                  <div>
                    <h3 className='font-medium text-slate-800'>Ambil di Rumah Penjual</h3>
                    <p className='text-sm text-slate-500'>Gratis, tanpa biaya pengiriman</p>
                  </div>
                </div>
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
                className='w-full mt-6 bg-orange-500 text-white font-semibold py-3 rounded hover:bg-orange-600 active:bg-orange-700 shadow-md transition disabled:opacity-60'
              >
                LANJUTKAN DI WHATSAPP
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { IoClose } from 'react-icons/io5'
import { useCartsStore } from '@/store/cartStore'
import { useSelectedCartStore } from '@/store/selectedCartStore'
import Link from 'next/link'
import Image from 'next/image'
import { alertError, alertConfirm, alertSuccess } from '@/lib/alert'

interface Product {
  name: string
  img: string[]
}

interface Variant {
  id: number
  price: number
  name: string
  img?: string[]
  products?: Product
}

interface CartData {
  id: number
  quantity?: number
  price: number
  name: string
  img: string
  variant_name?: string
}

// Fungsi ubah angka ke format rupiah
export const formatRupiah = (angka: number) => {
  if (!angka && angka !== 0) return 'Rp0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka)
}

interface Props {
  closeCart: () => void
}

export default function Cart({ closeCart }: Props) {
  const { carts, cartDatas, getCarts, setCartDatas, deleteCart, updateQuantity } = useCartsStore()
  const { selectedCarts, toggleSelect, clearSelection } = useSelectedCartStore()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    getCarts()
  })

  useEffect(() => {
    // Fetch hanya sekali setelah carts tersedia dan belum ada cartDatas
    if (carts?.length && cartDatas.length === 0) {
      getCartDatas()
    }
  }, [carts])

  const getCartDatas = async () => {
    setIsLoading(true)
    const variantIds = carts.map((c) => c.id)
    const { data, error } = await supabase.from('product_variants').select('id, price, img,name, products(name, img)').in('id', variantIds)
    const variants = data as unknown as Variant[]

    if (error) {
      alertError('Gagal memuat data produk', error.message)
      return
    }

    const merged: CartData[] = carts.map((cart) => {
      const variant = variants?.find((v) => v.id === cart.id)
      const product = variant?.products
      return {
        ...cart,
        price: variant?.price ?? 0,
        name: product?.name ?? 'Produk tidak ditemukan',
        img: variant?.img?.[0] || product?.img?.[0] || '/234.png',
        variant_name: variant?.name || '', // optional, kalau ada di carts
      }
    })

    setCartDatas(merged)
    setIsLoading(false)
  }

  const totalHarga = cartDatas.filter((cart) => selectedCarts.includes(cart.id)).reduce((acc, curr) => acc + (curr.price || 0) * (curr.quantity || 1), 0)

  const handleDeleteCart = async (id: number): Promise<void> => {
    try {
      const isConfirmed = await alertConfirm('Apakah yakin ingin menghapus item ini?')
      if (!isConfirmed) return

      await deleteCart(id)
      setCartDatas(cartDatas.filter((item) => item.id !== id))
      alertSuccess('Item berhasil dihapus', null, 1000)
    } catch (err) {
      if (err instanceof Error) {
        alertError('Gagal menghapus item', err.message)
      } else {
        alertError('Gagal menghapus item', String(err))
      }
    }
  }

  const handleUpdateQuantity = async (id: number, newQty: number) => {
    await updateQuantity(id, newQty)
    setCartDatas(cartDatas.map((item) => (item.id === id ? { ...item, quantity: newQty } : item)))
  }
  return (
    <>
      {/* Overlay */}
      <div onClick={closeCart} className='fixed top-0 left-0 w-screen h-screen bg-black/50 z-50'></div>

      {/* Drawer */}
      <div className='fixed top-0 right-0 bg-white w-screen max-w-md h-screen z-60 flex flex-col shadow-xl'>
        {/* Header */}
        <div className='w-full bg-orange-500 text-white p-4 flex justify-between items-center shadow-md'>
          <h3 className='text-xl font-semibold'>Keranjang</h3>
          <IoClose className='text-3xl cursor-pointer hover:text-gray-200 transition' onClick={closeCart} />
        </div>

        {/* Cart Items */}
        <div className='flex-1 overflow-y-auto'>
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className='flex items-center gap-3 p-4 border-b border-gray-200 animate-pulse'>
                <div className='w-5 h-5 bg-gray-300 rounded'></div> {/* checkbox placeholder */}
                <div className='w-20 h-20 bg-gray-300 rounded'></div> {/* image placeholder */}
                <div className='flex-1 flex flex-col gap-2'>
                  <div className='h-4 bg-gray-300 rounded w-3/4'></div> {/* name */}
                  <div className='h-3 bg-gray-300 rounded w-1/2'></div> {/* variant */}
                  <div className='h-4 bg-gray-300 rounded w-1/4 mt-1'></div> {/* price */}
                  <div className='flex gap-2 mt-2'>
                    <div className='w-7 h-7 bg-gray-300 rounded'></div>
                    <div className='w-5 h-4 bg-gray-300 rounded'></div>
                    <div className='w-7 h-7 bg-gray-300 rounded'></div>
                  </div>
                </div>
              </div>
            ))}

          {!isLoading &&
            cartDatas.map((cart) => (
              <div key={cart.id} className='flex items-center gap-3 p-4 border-b border-gray-200'>
                <input type='checkbox' className='w-5 h-5 accent-orange-500' checked={selectedCarts.includes(cart.id)} onChange={() => toggleSelect(cart.id)} />
                <Image width={80} height={80} src={cart.img || '/234.png'} className='w-20 h-20 object-cover border rounded' alt='produk' />
                <div className='flex flex-col w-full'>
                  <span className='text-lg font-medium text-gray-800'>{cart.name || 'Judul Produk'}</span>
                  <span className='text-sm text-gray-500'>Varian: {cart.variant_name || '500ml'}</span>
                  <span className='text-sm font-semibold text-orange-600 mt-1'>{formatRupiah(cart.price || 0)}</span>
                  <div className='flex w-full justify-between'>
                    <div className='flex items-center gap-4 mt-2'>
                      <button
                        className='w-7 h-7 border rounded flex items-center justify-center text-lg hover:bg-gray-100'
                        onClick={() => handleUpdateQuantity(cart.id, Math.max(1, (cart.quantity || 1) - 1))}
                      >
                        -
                      </button>
                      <span className='font-semibold text-gray-800'>{cart.quantity || 1}</span>
                      <button
                        className='w-7 h-7 border rounded flex items-center justify-center text-lg hover:bg-gray-100'
                        onClick={() => handleUpdateQuantity(cart.id, Math.max(1, (cart.quantity || 1) + 1))}
                      >
                        +
                      </button>
                    </div>
                    <button onClick={() => handleDeleteCart(cart.id)} className='text-sm text-red-500'>
                      hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className='p-4 border-t border-gray-200 space-y-3'>
          <div className='flex justify-between items-center'>
            <span className='text-gray-700 font-medium'>Total Terpilih</span>
            <span className='font-semibold text-orange-600'>{formatRupiah(totalHarga)}</span>
          </div>

          <Link href='/checkout'>
            <button
              disabled={selectedCarts.length === 0}
              className={`w-full mb-3 py-3 px-5 rounded shadow transition ${selectedCarts.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
            >
              Beli Sekarang ({selectedCarts.length})
            </button>
          </Link>

          <button onClick={clearSelection} className='w-full py-3 px-5 border border-orange-500 text-orange-500 rounded hover:bg-orange-50 transition'>
            Hapus Pilihan
          </button>

          <button onClick={closeCart} className='w-full py-3 px-5 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition'>
            Lanjut Belanja
          </button>
        </div>
      </div>
    </>
  )
}

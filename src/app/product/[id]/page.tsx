'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import dynamic from 'next/dynamic'
import { IoCartOutline } from 'react-icons/io5'
import { alertError } from '@/lib/alert'

interface Products {
  name: string
  description: string
  img: string[]
}
interface Product {
  product_id: number
  price: number
  id: number
  img: string[]
  name: string
  products: Products
}

interface SelectedVariant {
  id: number
  title: string
  description: string
  price: number
  images: string[] | []
  rating: number
  buyers: number
}
// Lazy load komponen berat
const Cart = dynamic(() => import('@/components/Cart'))
const SelectVariantModal = dynamic(() => import('@/components/SelectVariantModal'))

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [showCart, setShowCart] = useState(false)
  const [showModalVariant, setShowModalVariant] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<SelectedVariant | null>(null)
  const [product, setProduct] = useState<Product[] | null>(null)
  const [allImage, setAllImage] = useState<string[] | []>([])
  const [currentImage, setCurrentImage] = useState<string | null>(null)

  // Ambil id dari params
  const { id } = React.use(params)

  const getProduct = async () => {
    const { data, error } = await supabase.from('product_variants').select('    product_id,price,id,img,name,products(name, description, img)').eq('product_id', id)

    const variants = data as unknown as Product[]

    if (error) {
      alertError('Gagal mengambil dat', error?.message || 'Terjadi kesalahan')
      return
    }

    // Gabungkan semua gambar dari variant + product
    const images: string[] = []
    const productImages = variants[0]?.products?.img || []
    images.push(...productImages)
    variants.forEach((variant) => {
      if (variant.img) images.push(...variant.img)
    })

    setAllImage(images)

    // simpan produk beserta variant
    setProduct(variants)

    if (!variants?.length) return console.warn('Produk tidak ditemukan')

    const defaultVariant = variants[0]

    //simpan variant dipilih
    setSelectedVariant({
      id: defaultVariant.id,
      title: defaultVariant.products?.name,
      description: defaultVariant.products?.description,
      price: defaultVariant.price,
      images: defaultVariant.img || defaultVariant.products?.img || [],
      rating: 4.6,
      buyers: 124,
    })
  }

  useEffect(() => {
    if (id) getProduct()
  }, [id])

  const handleImageClick = (src: string) => {
    if (!product) return

    // cari variant yang punya gambar ini
    const matchedVariant = product.find((v: Product) => v.img?.includes(src))
    if (!matchedVariant) {
      setCurrentImage(src)
      return
    }
    const prdct = matchedVariant.products

    if (matchedVariant) {
      setSelectedVariant({
        id: matchedVariant.id,
        title: prdct?.name,
        description: prdct?.description,
        price: matchedVariant.price,
        images: matchedVariant.img || prdct?.img || [],
        rating: 4.6,
        buyers: 124,
      })
    }

    setCurrentImage(src)
  }

  // Saat product belum siap, tampilkan skeleton UI, bukan loading full-screen
  return (
    <div className='min-h-screen bg-white text-slate-900'>
      {/* Navbar */}
      <nav className='sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-100'>
        <div className='max-w-5xl mx-auto flex items-center justify-between px-4 py-3'>
          <button className='flex items-center gap-2 text-sm text-slate-700'>
            <span className='inline-block w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center'>&lt;</span>
            <span className='hidden sm:inline'>{selectedVariant?.title || 'Memuat...'}</span>
          </button>
          <button className='flex items-center gap-2 text-sm text-slate-700'>
            <IoCartOutline className='cursor-pointer text-2xl' onClick={() => setShowCart(true)} />
            <span className='hidden sm:inline'>Keranjang</span>
            <span className='ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-700'>3</span>
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className='max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Left */}
        <section className='md:col-span-2 flex flex-col gap-4'>
          <div className='rounded-lg overflow-hidden border border-gray-100 shadow-sm'>
            {selectedVariant?.images?.[0] ? (
              <img src={currentImage || selectedVariant?.images?.[0]} alt={selectedVariant.title} loading='lazy' className='w-full h-auto object-cover' />
            ) : (
              <div className='w-full h-64 bg-gray-100 animate-pulse flex items-center justify-center text-gray-400'>Memuat gambar...</div>
            )}
          </div>

          <div className='flex gap-3 overflow-x-auto pb-2'>
            {allImage?.map((src, i) => (
              <button key={i} onClick={() => handleImageClick(src)} className='flex-shrink-0 rounded-lg overflow-hidden border border-gray-100 shadow-sm w-20 h-20 md:w-24 md:h-24'>
                <img src={src} alt={`thumb-${i}`} className='w-full h-full object-cover' />
              </button>
            ))}
          </div>
          <div className='mt-2 text-sm text-slate-700'>Produk lainnya</div>
        </section>

        {/* Right */}
        <aside className='md:col-span-1 flex flex-col gap-4'>
          <div className='rounded-lg border border-gray-100 p-4 shadow-sm'>
            <div className='flex items-baseline justify-between gap-2'>
              <h2 className='text-2xl font-semibold'>
                {selectedVariant ? `Rp ${selectedVariant.price?.toLocaleString('id-ID')}` : <span className='bg-gray-200 text-transparent animate-pulse rounded'>Rp...</span>}
              </h2>
              <span className='text-sm text-slate-500'>Stok: Tersedia</span>
            </div>

            <h3 className='mt-2 text-lg font-medium'>{selectedVariant?.title || <span className='bg-gray-200 text-transparent animate-pulse rounded'>Memuat...</span>}</h3>

            <div className='mt-3 text-sm text-slate-600'>
              {selectedVariant ? (
                <span className='inline-flex items-center gap-2'>
                  <span className='font-medium'>{selectedVariant.rating}</span>
                  <span>|</span>
                  <span>{selectedVariant.buyers} pembeli</span>
                </span>
              ) : (
                <div className='w-24 h-3 bg-gray-200 rounded animate-pulse'></div>
              )}
            </div>

            <hr className='my-3' />

            <div className='text-sm text-slate-700'>
              <div className='font-medium mb-1'>Deskripsi</div>
              {selectedVariant ? (
                <p className='text-sm leading-relaxed text-slate-600'>{selectedVariant.description}</p>
              ) : (
                <div className='space-y-2'>
                  <div className='w-full h-3 bg-gray-200 rounded animate-pulse'></div>
                  <div className='w-3/4 h-3 bg-gray-200 rounded animate-pulse'></div>
                </div>
              )}
            </div>
          </div>

          {/* Tombol */}
          <div className='rounded-lg border border-gray-100 p-4 shadow-sm flex flex-col gap-3'>
            <div className='flex items-center justify-between'>
              <div className='text-right'>
                <p className='text-xs text-slate-500'>Subtotal</p>
                <p className='font-medium'>{selectedVariant ? `Rp ${selectedVariant.price?.toLocaleString('id-ID')}` : 'Rp ...'}</p>
              </div>
            </div>

            <div className='flex gap-3'>
              <button
                onClick={() => setShowModalVariant(true)}
                className='flex-1 py-3 rounded-lg text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700 shadow-md disabled:bg-gray-300'
                disabled={!selectedVariant}
              >
                Tambah ke Keranjang
              </button>
              <button className='w-14 h-12 rounded-lg border border-orange-500 text-orange-600 flex items-center justify-center'>♡</button>
            </div>
          </div>
        </aside>
      </main>

      {/* Lazy modal pakai Suspense */}
      <Suspense fallback={null}>
        {showCart && <Cart closeCart={() => setShowCart(false)} />}
        {showModalVariant && <SelectVariantModal product={product || []} onClose={() => setShowModalVariant(false)} />}{' '}
      </Suspense>
    </div>
  )
}

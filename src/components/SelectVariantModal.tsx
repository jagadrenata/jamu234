'use client'
import { IoClose } from 'react-icons/io5'
import { useState } from 'react'
import { useCartsStore } from '@/store/cartStore'
import Image from 'next/image'

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
interface Props {
  onClose: () => void
  product: Product[]
}

export default function SelectVariantModal({ onClose, product }: Props) {
  const { addCart, getCarts } = useCartsStore()
  const [selectedVariant, setSelectedVariant] = useState<Product>(product[0] || null)
  const [quantity, setQuantity] = useState<number>(1)

  const handleSelect = (variant: Product) => {
    setSelectedVariant(variant)
  }

  const handleAddToCart = async () => {
    if (!selectedVariant) return

    addCart({
      id: selectedVariant.id,
      product_id: selectedVariant.product_id,
      quantity,
    })

    onClose()
    getCarts()
  }

  if (!product?.length) return null

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} className='fixed top-0 left-0 w-screen max-w-5xl h-screen bg-black/50 z-40'></div>

      {/* Modal Bottom Sheet */}
      <div className='fixed bottom-0 left-0 w-full max-h-[90vh] bg-white rounded-t-2xl shadow-lg z-50 overflow-y-auto animate-slide-up'>
        {/* Header */}
        <div className='flex items-start gap-4 p-4 border-b'>
          <Image
            width={80}
            height={80}
            src={selectedVariant?.img?.[0] || selectedVariant?.products?.img?.[0] || '/234.png'}
            alt={selectedVariant?.name || 'Product'}
            className='w-20 h-20 rounded object-cover'
          />
          <div className='flex flex-col'>
<span className='text-lg font-semibold text-gray-800'>
  {selectedVariant?.products?.name || 'Loading...'}
</span>
            <span className='text-orange-500 font-bold text-xl'>Rp {selectedVariant?.price?.toLocaleString('id-ID')}</span>
            <span className='text-sm text-gray-500'>{selectedVariant?.name}</span>
          </div>
          <IoClose className='ml-auto text-3xl cursor-pointer text-gray-500 hover:text-gray-700' onClick={onClose} />
        </div>

        {/* Variants */}
        <div className='p-4 space-y-3'>
          <h3 className='text-base font-semibold text-gray-700 mb-2'>Pilih Varian</h3>
          <div className='grid grid-cols-3 gap-2'>
            {product.map((variant: Product) => (
              <label
                key={variant.id}
                className={`flex items-center justify-center border rounded cursor-pointer text-sm transition ${
                  selectedVariant?.id === variant.id ? 'bg-orange-500 text-white border-orange-500' : 'hover:bg-orange-50'
                }`}
                onClick={() => handleSelect(variant)}
              >
                <span className='px-3 py-2 w-full h-full flex items-center justify-center rounded'>{variant.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Jumlah */}
        <div className='p-4 space-y-3 flex items-center justify-between'>
          <div>
            <h3 className='text-base font-semibold text-gray-700 mb-2'>Jumlah</h3>
            <div className='mt-1 inline-flex items-center border border-gray-200 rounded overflow-hidden'>
              <button className='px-3 py-1 text-lg' onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                -
              </button>
              <div className='px-4 py-1'>{quantity}</div>
              <button className='px-3 py-1 text-lg' onClick={() => setQuantity((q) => q + 1)}>
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='p-4 border-t'>
          <button onClick={handleAddToCart} className='w-full py-3 bg-orange-500 text-white font-semibold rounded hover:bg-orange-600 transition'>
            Masukkan Keranjang
          </button>
        </div>
      </div>
    </>
  )
}

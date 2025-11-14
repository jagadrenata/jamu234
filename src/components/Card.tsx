'use client'
import Image from 'next/image'
import { FaStar, FaRegStar } from 'react-icons/fa'
import Link from 'next/link'

interface productType {
  id: number
  name: string
  img: string[]
  price: number | null
}

interface Props {
  product: productType
}

export default function Card({ product }: Props) {
  return (<Link
  href={`/product/${product.id}`}
  className='group block w-full max-w-sm bg-white border border-gray-200 rounded shadow-md hover:shadow-lg hover:border-orange-400 active:scale-95 active:opacity-90 transition-all duration-200'
>

      {/* Gambar Produk */}
      <div className='overflow-hidden rounded-t'>
        <Image
          src={product.img[0]}
          alt={product.name}
          width={360}
          height={240}
          className='object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300'
        />
      </div>

      {/* Detail Produk */}
      <div className='px-5 pb-5 pt-6'>
        <h5 className='text-lg font-semibold tracking-tight text-slate-900 line-clamp-2'>
          {product.name || 'Nama Produk'}
        </h5>

        {/* Rating */}
        <div className='flex items-center mt-3 mb-4'>
          <div className='flex items-center space-x-1 text-orange-500'>
            <FaStar className='w-4 h-4' />
            <FaStar className='w-4 h-4' />
            <FaStar className='w-4 h-4' />
            <FaStar className='w-4 h-4' />
            <FaRegStar className='w-4 h-4 text-gray-300' />
          </div>
          <span className='bg-orange-50 text-orange-700 text-xs font-semibold px-2.5 py-0.5 rounded ms-3'>
            4.6
          </span>
        </div>

        {/* Harga */}
        <p className='text-2xl font-bold text-slate-900'>
          Rp {(product.price ?? 0).toLocaleString('id-ID')}
        </p>
      </div>
    </Link>
  )
}
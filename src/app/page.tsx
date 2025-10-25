'use client'
import { useEffect } from 'react'
import { useProductsStore } from '@/store/store'
import { businesInfo } from '@/data'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import Footer from '../components/Footer'
import WhatsAppFloat from '../components/WhatsAppFloat'
import { Fraunces } from 'next/font/google'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '700'], // pilih bobot yang mau dipakai
})

export default function Home() {
  const { getProducts, products } = useProductsStore()

  useEffect(() => {
    getProducts()
  }, [getProducts])

  return (
    <>
      <Navbar />

      <div className='Homepage pb-10'>
        <div className='container mx-auto pt-32 px-4'>
          <div className='h-80 w-full bg-[url("/20250904_211642_0000.png")] bg-no-repeat bg-center bg-cover rounded-4xl shadow flex flex-col items-center justify-center text-center'>
            <h1
              className={`${fraunces.className} text-6xl font-bold bg-gradient-to-b from-brown-400/100 via-brown-400/100 to-orange-500/100 bg-clip-text text-transparent`}
              style={{ textShadow: '4px 4px 4px rgba(0,0,0,0.1 )' }}
            >
              {businesInfo.name ?? 'businesInfo.name'}
            </h1>
            <p>{businesInfo.description ?? 'businesInfo.description'}</p>
          </div>

          <div className='mt-20'>
            <h2 className='text-2xl font-bold '>Products</h2>
            <div>
              {products &&
                products.map((product) => {
                  return <Card product={product} key={product.id} />
                })}
              {products ? '' : <div>loading ....</div>}
            </div>
          </div>
        </div>
      </div>
      <WhatsAppFloat />
      <Footer />
    </>
  )
}

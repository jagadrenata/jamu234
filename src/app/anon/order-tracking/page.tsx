
import Navbar from '@/components/Navbar'
import { Suspense } from 'react'
import OrderTrackingClient from './OrderTrackingClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function Page() {
  return (<>
    
  <Navbar />
    <Suspense fallback={<p>Memuat...</p>}>
      <OrderTrackingClient />
    </Suspense>
  </>      
  )
}
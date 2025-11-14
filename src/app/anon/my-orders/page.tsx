'use client'

import { Suspense } from 'react'
import MyOrder from './MyOrder'

export default function MyOrdersPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <MyOrder/>
    </Suspense>
  )
}
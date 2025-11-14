'use client'

import { Suspense } from 'react'
import Feedback from './Feedback'

export default function page() {
  return (
    <Suspense fallback={<div>Memuat...</div>}>
      <Feedback />
    </Suspense>
  )
}

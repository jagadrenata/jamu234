'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    eruda?: {
      init: () => void
      _isInit?: boolean
    }
  }
}

export default function Debugger() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.src = '//cdn.jsdelivr.net/npm/eruda'
      script.async = true
      script.onload = () => {
        if (window.eruda && !window.eruda._isInit) {
          window.eruda.init()
        }
      }
      document.body.appendChild(script)
    }
  }, [])

  return null
}
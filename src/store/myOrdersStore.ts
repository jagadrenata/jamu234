'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// --- Tipe address ---
type Address = {
  desc?: string
  long?: number
  lang?: number
}

// --- Tipe product ---
type Product = {
  id: number
  name: string
  description?: string
  img?: string[]
}

// --- Tipe product variant ---
type ProductVariant = {
  id: number
  product_id: number
  name: string
  price: number
  quantity: number
  img?: string[]
  product?: Product
}

// --- Tipe item order ---
type OrderItem = {
  id: number
  order_id: string
  variant_id: number
  quantity: number
  price: number
  variant?: ProductVariant
}

// --- Tipe utama order ---
type Order = {
  id: string
  total_price: number
  status: string
  name: string
  email?: string | null
  phone?: string | null
  address?: Address | null
  midtrans_url?: string | null
  midtrans_token?: string | null
  created_at?: string
  items?: OrderItem[] // daftar item beserta variant & product
}

// --- Tipe store ---
type MyOrdersStore = {
  myOrders: Order[]
  loading: boolean
  fetchOrders: () => Promise<void>
  addOrder: (data: Order) => void
  exists: (id: string) => boolean
}

export const useMyOrderStore = create<MyOrdersStore>()(
  persist(
    (set, get) => ({
      myOrders: [],
      loading: false,

      fetchOrders: async () => {
        set({ loading: true })
        try {
          // Contoh: nanti fetch dari Supabase API /api/orders
          // const res = await fetch('/api/orders?email=xxx')
          // const data = await res.json()
          // set({ myOrders: data.orders })
        } finally {
          set({ loading: false })
        }
      },

      addOrder: (data) => {
        const exists = get().myOrders.some((o) => o.id === data.id)
        if (!exists) set({ myOrders: [data, ...get().myOrders] })
      },

      exists: (id) => get().myOrders.some((o) => o.id === id),
    }),
    { name: 'my-orders-storage' },
  ),
)
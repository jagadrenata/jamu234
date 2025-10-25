'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'

type Order = {
  id: number
  total_price: number
  status: string
  created_at: string
  midtrans_url?: string
  midtrans_token?: string
}

type MyOrdersStore = {
  myOrders: Order[]
  loading: boolean
  fetchOrders: () => Promise<void>
  addOrder: (data: Order) => void
}

export const useMyOrdersStore = create<MyOrdersStore>()(
  persist(
    (set, get) => ({
      myOrders: [],
      loading: false,

      // Ambil semua orders milik user login
      fetchOrders: async () => {

      },

      // Tambah order baru ke store
      addOrder: (data) => set({ myOrders: [data, ...get().myOrders] }),

    }),
    { name: 'my-orders-storage' },
  ),
)

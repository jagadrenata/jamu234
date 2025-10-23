/* eslint-disable @typescript-eslint/no-explicit-any */
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
  setOrders: (orders: Order[]) => void
  addOrder: (data: Order) => void
  deleteOrder: (id: number) => Promise<void>
}

export const useMyOrdersStore = create<MyOrdersStore>()(
  persist(
    (set, get) => ({
      myOrders: [],

      setOrders: (orders) => set({ myOrders: orders }),

      addOrder: (data) => set({ myOrders: [...get().myOrders, data] }),

      deleteOrder: async (id) => {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          await supabase.from('orders').delete().eq('id', id).eq('user_id', user.id)
        }

        set({
          myOrders: get().myOrders.filter((item) => item.id !== id),
        })
      },
    }),
    {
      name: 'my-orders-storage',
    },
  ),
)
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'
import { alertSuccess, alertError } from '@/lib/alert'

// Tipe data untuk satu cart item
export interface Cart {
  id: number
  user_id?: string | null
  product_id: number
  quantity: number
}
interface CartData {
  id: number
  quantity?: number
  price: number
  name: string
  img: string
  variant_name?: string
}

// Struktur state utama
interface CartsState {
  carts: Cart[]
  cartDatas: CartData[]
  isLoaded: boolean
  getCarts: () => Promise<void>
  addCart: (cart: Cart) => Promise<void>
  deleteCart: (id: number) => Promise<void>
  updateQuantity: (id: number, quantity: number) => Promise<void>
  setCartDatas: (data: CartData[]) => void
}

export const useCartsStore = create<CartsState>()(
  persist(
    (set, get) => ({
      carts: [],
      isLoaded: false,
      cartDatas: [],
      fetched: false,

      // Ambil carts dari Supabase saat cart dibuka
      getCarts: async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        // kalau belum login, skip fetch (gunakan local cache)
        if (!user) {
          set({ isLoaded: true })
          return
        }

        const { data, error } = await supabase.from('carts').select('*').eq('user_id', user.id)
        if (error) {
          console.error('Error fetching carts:', error)
          alertError('Gagal memuat keranjang')
          return
        }

        set({ carts: data || [], isLoaded: true })
      },

      // Tambah cart
      addCart: async (cart: Cart) => {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        const carts = get().carts

        // Cek apakah product sudah ada
        const existing = carts.find((item) => item.id === cart.id && (user ? item.user_id === user.id : item.user_id === null))

        if (existing) {
          const newQuantity = existing.quantity + cart.quantity
          await get().updateQuantity(existing.id!, newQuantity)
          return
        }

        if (user) {
          const { data: newCart, error } = await supabase
            .from('carts')
            .insert({ ...cart, user_id: user.id })
            .select()
            .single()

          if (error) {
            alertError('Gagal menambah ke keranjang', error.message)
            return
          }

          set({ carts: [...carts, newCart] })
        } else {
          // belum login → simpan di local saja
          set({ carts: [...carts, { ...cart, user_id: null }] })
        }

        alertSuccess('Ditambahkan ke keranjang', null, 1500)
      },

      // Hapus item dari keranjang
      deleteCart: async (id: number) => {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          await supabase.from('carts').delete().eq('id', id).eq('user_id', user.id)
        }

        set({ carts: get().carts.filter((item) => item.id !== id) })
      },

      // Update jumlah quantity (local + Supabase)
      updateQuantity: async (id: number, quantity: number) => {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          const { error } = await supabase.from('carts').update({ quantity }).eq('id', id).eq('user_id', user.id)
          if (error) {
            alertError('Gagal memperbarui jumlah item')
            return
          }
        }

        set({
          carts: get().carts.map((item) => (item.id === id ? { ...item, quantity } : item)),
        })
        await get().getCarts()
        //alertSuccess('Jumlah diperbarui', null, 1000)
      },
      setCartDatas: (data) => set({ cartDatas: data }),
    }),
    {
      name: 'carts-storage',

      partialize: (state) => ({ carts: state.carts }), // hanya simpan carts
    },
  ),
)

import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

// =====================
// AUTH STORE
// =====================
interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Contoh dummy signIn dan signUp (kalau nanti kamu mau tambahkan logic-nya)
  signIn: async (email, password) => {
    set({ loading: true })
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) set({ error: error.message, loading: false })
    else set({ user: data.user ?? null, loading: false })
  },

  signUp: async (email, password) => {
    set({ loading: true })
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) set({ error: error.message, loading: false })
    else set({ user: data.user ?? null, loading: false })
  },

  signOut: async () => {
    set({ loading: true })
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Logout gagal:', error.message)
      set({ error: error.message, loading: false })
      return
    }
    set({ user: null, loading: false })
  },
}))

// =====================
// PRODUCTS STORE
// =====================
interface ProductType {
  id: number
  name: string
  img: string[]
  price: number | null
}

interface ProductsState {
  products: ProductType[]
  getProducts: () => Promise<void>
}
interface ProductData {
  name: string
  description?: string
  img: string[]
}

interface ProductVariantRow {
  product_id: number
  price: number | null
  img: string[] | []
  products: ProductData
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],

  getProducts: async () => {
    const { data, error } = await supabase.from('product_variants').select('product_id, price, img, products(name, description, img)')

    if (error) {
      console.error('Error mengambil produk:', error.message)
      return
    }

    // Cast data ke tipe ProductVariantRow[]
    const rows = (data ?? []) as unknown as ProductVariantRow[]
    const uniqueProducts: ProductType[] = Object.values(
      rows.reduce(
        (acc: Record<number, ProductType>, item: ProductVariantRow) => {
          const id = item.product_id
          if (!acc[id]) {
            const product = item.products // products berupa objek
            acc[id] = {
              id,
              name: product?.name || 'Produk tidak ditemukan',
              img: item?.img || product?.img || [],
              price: item.price ?? null,
            }
          }
          return acc
        },
        {} as Record<number, ProductType>,
      ),
    )

    set({ products: uniqueProducts })
  },
}))

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SelectedCartStore {
  selectedCarts: number[] // simpan id cart yang dipilih
  toggleSelect: (cartId: number) => void
  clearSelection: () => void
}

export const useSelectedCartStore = create<SelectedCartStore>()(
  persist(
    (set, get) => ({
      selectedCarts: [],
      toggleSelect: (cartId) => {
        const current = get().selectedCarts
        if (current.includes(cartId)) {
          set({ selectedCarts: current.filter((id) => id !== cartId) })
        } else {
          set({ selectedCarts: [...current, cartId] })
        }
      },
      clearSelection: () => set({ selectedCarts: [] }),
    }),
    {
      name: 'selected-carts',
    },
  ),
)

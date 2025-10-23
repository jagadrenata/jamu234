'use client'

import { create } from 'zustand'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

interface RouteStore {
  currentPath: string
  setCurrentPath: (path: string) => void
  router: AppRouterInstance | null
  setRouter: (router: AppRouterInstance) => void
  push: (url: string) => void
  replace: (url: string) => void
  back: () => void
}

export const useRouteStore = create<RouteStore>((set, get) => ({
  currentPath: '',
  router: null,
  setCurrentPath: (path) => {
    // Hilangkan slash pertama
    let cleanPath = path.startsWith('/') ? path.slice(1) : path

    // Jika kosong (misal halaman root '/'), jadikan 'home'
    if (!cleanPath) cleanPath = 'home'

    set({ currentPath: cleanPath })
  },

  setRouter: (router) => set({ router }),
  push: (url) => get().router?.push(url),
  replace: (url) => get().router?.replace(url),
  back: () => get().router?.back(),
}))


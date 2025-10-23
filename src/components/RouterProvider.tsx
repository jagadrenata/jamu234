'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRouteStore } from '@/store/routeStore'

export default function RouteProvider() {
  const pathname = usePathname()
  const setCurrentPath = useRouteStore((state) => state.setCurrentPath)
  const router = useRouter()
  const setRouter = useRouteStore((state) => state.setRouter)

  useEffect(() => {
    setRouter(router)
  }, [router, setRouter])

  useEffect(() => {
    setCurrentPath(pathname)
  }, [pathname, setCurrentPath])

  return null
}

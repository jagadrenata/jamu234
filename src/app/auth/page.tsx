'use client'

import { useAuthStore } from '@/store/store'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { businesInfo } from '@/data'
import { alertSuccess, alertError } from '@/lib/alert'
import type { FormEvent } from 'react'

export default function Home() {
  const router = useRouter()

  const [data, setData] = useState({ email: '', password: '' })
  const [isSignup, setIsSignup] = useState(true)

  const { user, setUser, setLoading, setError, loading, error } = useAuthStore()

  useEffect(() => {
    getUser()
  })

  // Check session saat reload
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [setUser])

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      router.replace('/clientarea')
    }
  }
  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error('Login failed:', error.message)
      setError(error.message)
      setLoading(false)
      alertError('Login gagal', error.message)
      return
    }

    setUser(data.user)
    setLoading(false)
    alertSuccess('Login berhasil', null, 1000)
    router.replace('/clientarea')
  }

  const signUp = async (email: string, password: string): Promise<void> => {
    setLoading(true)
    setError(null)

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })

    if (authError) {
      console.error('SignUp failed:', authError.message)
      setError(authError.message)
      setLoading(false)
      alertError('Pendaftaran gagal', authError.message)
      return
    }

    const userId = authData.user?.id
    const username = email.split('@')[0]

    const { error: profileError } = await supabase.from('profiles').insert([
      {
        id: userId,
        email,
        name: username,
      },
    ])

    setLoading(false)

    if (profileError) {
      console.error('Insert profile failed:', profileError.message)

      if (profileError.code === '23505') {
        alertError('Pendaftaran gagal', 'Email sudah digunakan, silahkan login atau daftar menggunakan email lain')
      } else {
        alertError('Pendaftaran gagal', profileError.message)
      }

      return // penting! hentikan eksekusi agar tidak lanjut ke alertSuccess
    }

    if (!authError && !profileError) {
      setUser(authData.user)
      alertSuccess('Akun berhasil dibuat!', 'Silakan cek email untuk verifikasi.', 30000)
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      if (isSignup) {
        signUp(data.email, data.password)
      } else {
        signIn(data.email, data.password)
      }
    } catch (err) {
      setError('Terjadi kesalahan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='flex flex-col md:flex-row h-screen w-screen bg-gradient-to-br from-gray-100 via-blue-50 to-gray-200'>
      {/* Left Side - Illustration */}
      <div className='hidden md:flex w-1/2 relative items-center justify-center overflow-hidden bg-gradient-to-br from-orange-500 to-red-600 text-white'>
        <div className="absolute inset-0 bg-[url('/20250904_211642_0000.png')] bg-cover bg-center opacity-30" />
        <div className='relative z-10 text-center px-10'>
          <h1 className='text-4xl font-bold mb-4'>Selamat Datang di {businesInfo.name}</h1>
          <p className='text-lg opacity-90'>{businesInfo.description}</p>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className='flex w-full md:w-1/2 items-center justify-center p-6 md:p-12'>
        <div className='backdrop-blur-md bg-white/70 border border-white/30 shadow-xl rounded w-full max-w-md p-8 transition-all duration-300'>
          {/* Logo */}
          <div className='flex flex-col items-center mb-6'>
            <Image src={businesInfo.logoPath ?? '/234.png'} alt='Logo Bisnis' width={64} height={64} className='rounded shadow-md' />
            <h2 className='text-2xl font-semibold mt-3 text-gray-800'>{businesInfo.name.charAt(0).toUpperCase() + businesInfo.name.slice(1).toLowerCase()}</h2>
          </div>

          {/* Error Message */}
          {error && <p className='text-red-500 text-center mb-4'>{error}</p>}
          {loading && <p className='text-center text-gray-500 mb-3'>Memuat...</p>}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <h3 className='text-xl font-medium text-gray-900 text-center'>{isSignup ? 'Buat Akun Baru' : 'Masuk ke Akun Anda'}</h3>

            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
                Email
              </label>
              <input
                id='email'
                type='email'
                value={data.email}
                onChange={(e) => setData((p) => ({ ...p, email: e.target.value }))}
                placeholder='nama@perusahaan.com'
                required
                className='w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              />
            </div>

            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>
                Kata Sandi
              </label>
              <input
                id='password'
                type='password'
                value={data.password}
                onChange={(e) => setData((p) => ({ ...p, password: e.target.value }))}
                placeholder='••••••••'
                required
                className='w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              />
            </div>

            {!isSignup && (
              <div className='flex justify-between items-center text-sm'>
                <label className='flex items-center gap-2 text-gray-700'>
                  <input type='checkbox' className='w-4 h-4 text-blue-600 rounded focus:ring-blue-400' />
                  Ingat saya
                </label>
                <a href='#' className='text-orange-600 hover:underline'>
                  Lupa sandi?
                </a>
              </div>
            )}

            <button type='submit' className='w-full py-2.5 bg-orange-500 hover:bg-blue-700 text-white rounded font-semibold shadow-md transition'>
              {isSignup ? 'Daftar Sekarang' : 'Masuk'}
            </button>

            <div className='text-center text-sm text-gray-600'>
              {isSignup ? (
                <>
                  Sudah punya akun?{' '}
                  <button type='button' onClick={() => setIsSignup(false)} className='text-orange-600 hover:underline'>
                    Masuk
                  </button>
                </>
              ) : (
                <>
                  Belum punya akun?{' '}
                  <button type='button' onClick={() => setIsSignup(true)} className='text-orange-600 hover:underline'>
                    Daftar
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

'use client'

import { useAuthStore } from '@/store/store'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { businesInfo } from '@/data'
import { alertSuccess, alertError } from '@/lib/alert'

export default function Home() {
  const router = useRouter()

  const [data, setData] = useState({ email: '', password: '' })
  const [isSignup, setIsSignup] = useState(false)

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

  return (
    <main className='p-4 w-screen h-screen justify-center items-center flex flex-col bg-gray-50'>
      {/* Logo & Nama Bisnis */}
      <div className='flex flex-col items-center mb-6'>
        <Image src={businesInfo.logoPath ?? '/234.png'} alt='Logo Bisnis' width={64} height={64} className='rounded-lg' />
        <h1 className='text-2xl font-semibold mt-2 text-gray-800'>{businesInfo.name.charAt(0).toUpperCase() + businesInfo.name.slice(1).toLowerCase()}</h1>
      </div>

      {error && <p className='text-red-500 mb-3'>{error}</p>}
      {loading && <p>Memuat...</p>}

      {isSignup ? (
        // Form Login
        <div className='w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8'>
          <form
            className='space-y-6'
            action='#'
            onSubmit={async (e) => {
              e.preventDefault()
              await signIn(data.email, data.password)
            }}
          >
            <h5 className='text-xl font-medium text-gray-900'>Masuk ke platform kami</h5>

            <div>
              <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900'>
                Email Anda
              </label>
              <input
                type='email'
                name='email'
                id='email'
                value={data.email}
                onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5'
                placeholder='nama@perusahaan.com'
                required
              />
            </div>

            <div>
              <label htmlFor='password' className='block mb-2 text-sm font-medium text-gray-900'>
                Kata Sandi
              </label>
              <input
                type='password'
                name='password'
                id='password'
                placeholder='••••••••'
                value={data.password}
                onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value }))}
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5'
                required
              />
            </div>

            <div className='flex items-start justify-between'>
              <label className='flex items-center text-sm font-medium text-gray-900'>
                <input id='remember' type='checkbox' className='w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-gray-300 me-2' />
                Ingat saya
              </label>
              <a href='#' className='text-sm text-blue-700 hover:underline'>
                Lupa kata sandi?
              </a>
            </div>

            <button
              type='submit'
              className='w-full text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
            >
              Masuk ke akun Anda
            </button>

            <div className='text-sm font-medium text-gray-500 text-center'>
              Belum punya akun?{' '}
              <button type='button' className='text-blue-700 hover:underline' onClick={() => setIsSignup(!isSignup)}>
                Daftar
              </button>
            </div>
          </form>
        </div>
      ) : (
        // Form Daftar
        <div className='w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8'>
          <form
            className='space-y-6'
            action='#'
            onSubmit={async (e) => {
              e.preventDefault()
              await signUp(data.email, data.password)
            }}
          >
            <h5 className='text-xl font-medium text-gray-900'>Daftar ke platform kami</h5>

            <div>
              <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900'>
                Email Anda
              </label>
              <input
                type='email'
                name='email'
                id='email'
                value={data.email}
                onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5'
                placeholder='nama@perusahaan.com'
                required
              />
            </div>

            <div>
              <label htmlFor='password' className='block mb-2 text-sm font-medium text-gray-900'>
                Kata Sandi
              </label>
              <input
                type='password'
                name='password'
                id='password'
                placeholder='••••••••'
                value={data.password}
                onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value }))}
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5'
                required
              />
            </div>

            <button
              type='submit'
              className='w-full text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
            >
              Daftar Sekarang
            </button>

            <div className='text-sm font-medium text-gray-500 text-center'>
              Sudah punya akun?{' '}
              <button type='button' className='text-blue-700 hover:underline' onClick={() => setIsSignup(!isSignup)}>
                Masuk
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  )
}

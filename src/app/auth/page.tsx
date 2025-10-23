'use client'

import { useAuthStore } from '@/store/store'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
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

  const signUp = async (email: string, password: string): Promise<void>  => {
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
    <main className='p-4 w-screen h-screen justify-center items-center flex flex-col'>
      {error && <p className='text-red-500'>{error}</p>}
      {loading && <p>Loading...</p>}

      {isSignup ? (
        <div className='w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8'>
          <form
            className='space-y-6'
            action='#'
            onSubmit={async (e) => {
              e.preventDefault()
              await signIn(data.email, data.password)
            }}
          >
            <h5 className='text-xl font-medium text-gray-900 '>Login to our platform</h5>
            <div>
              <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 '>
                Your email
              </label>
              <input
                type='email'
                name='email'
                id='email'
                value={data.email}
                onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5'
                placeholder='name@company.com'
                required
              />
            </div>
            <div>
              <label htmlFor='password' className='block mb-2 text-sm font-medium text-gray-900 '>
                Your password
              </label>
              <input
                type='password'
                name='password'
                id='password'
                placeholder='••••••••'
                value={data.password}
                onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value }))}
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5  '
                required
              />
            </div>
            <div className='flex items-start'>
              <div className='flex items-start'>
                <div className='flex items-center h-5'>
                  <input id='remember' type='checkbox' value='' className='w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-gray-300' />
                </div>
                <label htmlFor='remember' className='ms-2 text-sm font-medium text-gray-900 '>
                  Remember me
                </label>
              </div>
              <a href='#' className='ms-auto text-sm text-blue-700 hover:underline '>
                Lost Password?
              </a>
            </div>
            <button
              type='submit'
              className='w-full text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
            >
              Login to your account
            </button>
            <div className='text-sm font-medium text-gray-500'>
              Not registered?{' '}
              <button className='text-blue-700 hover:underline' onClick={() => setIsSignup(!isSignup)}>
                Create account
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className='w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8'>
          <form
            className='space-y-6'
            action='#'
            onSubmit={async (e) => {
              e.preventDefault()
              await signUp(data.email, data.password)
            }}
          >
            <h5 className='text-xl font-medium text-gray-900 '>Sign up to our platform</h5>
            <div>
              <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 '>
                Your email
              </label>
              <input
                type='email'
                name='email'
                id='email'
                value={data.email}
                onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5  '
                placeholder='name@company.com'
                required
              />
            </div>
            <div>
              <label htmlFor='password' className='block mb-2 text-sm font-medium text-gray-900 '>
                Your password
              </label>
              <input
                type='password'
                name='password'
                id='password'
                placeholder='••••••••'
                value={data.password}
                onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value }))}
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5  '
                required
              />
            </div>
            <button
              type='submit'
              className='w-full text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center '
            >
              Sign Up to your account
            </button>
            <div className='text-sm font-medium text-gray-500 '>
              registered?{' '}
              <button className='text-blue-700 hover:underline ' onClick={() => setIsSignup(!isSignup)}>
                Login
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  )
}

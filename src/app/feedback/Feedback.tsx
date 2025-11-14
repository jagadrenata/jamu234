'use client'

import { useState, useEffect, type FormEvent, ChangeEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { FiX } from 'react-icons/fi'
import Footer from '@/components/Footer'
import { alertSuccess, alertError } from '@/lib/alert' // pastikan path sesuai

interface FeedbackFormData {
  type: 'saran' | 'gangguan'
  name: string
  email: string
  phone: string
  message: string
}

const Feedback = () => {
  const searchParams = useSearchParams()
  const type = searchParams.get('type')

  const [formData, setFormData] = useState<FeedbackFormData>({
    type: 'saran',
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const [screenshotFile, setScreenshotFile] = useState<File | null>(null)
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const validTypes: FeedbackFormData['type'][] = ['saran', 'gangguan']
    if (type && validTypes.includes(type as FeedbackFormData['type'])) {
      setFormData((prev) => ({ ...prev, type: type as FeedbackFormData['type'] }))
    }
  }, [type])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.email) newErrors.email = 'Email wajib diisi'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Format email tidak valid'
    if (!formData.message) newErrors.message = 'Pesan wajib diisi'
    return newErrors
  }

  const handleScreenshotChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const maxSize = 3145728 // 3MB

    if (!file) return

    if (!allowedTypes.includes(file.type)) {
      alertError('Tipe file tidak didukung', 'Hanya JPG, PNG, WEBP, atau GIF.')
      e.target.value = ''
      return
    }

    if (file.size > maxSize) {
      alertError('Ukuran file terlalu besar', 'Maksimal 3 MB.')
      e.target.value = ''
      return
    }

    setScreenshotFile(file)
    setScreenshotPreview(URL.createObjectURL(file))
  }

  const handleRemoveScreenshot = () => {
    setScreenshotFile(null)
    setScreenshotPreview(null)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    let screenshot_url: string | null = null

    try {
      if (formData.type === 'gangguan' && screenshotFile) {
        const fileExt = screenshotFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage.from('feedback').upload(fileName, screenshotFile, {
          cacheControl: '3600',
          upsert: false,
        })

        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage.from('feedback').getPublicUrl(fileName)
        screenshot_url = publicUrlData.publicUrl
      }

      const { error } = await supabase.from('feedback').insert([
        {
          ...formData,
          screenshot_url,
        },
      ])

      if (error) throw error

      alertSuccess('Laporan berhasil dikirim!', 'Terima kasih atas masukan Anda 😊')
      setFormData({ type: 'saran', name: '', email: '', phone: '', message: '' })
      setScreenshotFile(null)
      setScreenshotPreview(null)
      setErrors({})
    } catch (error) {
      const err = error as Error
      alertError('Gagal mengirim', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <main className='flex-col flex items-center justify-center pb-12 px-4 sm:px-6 lg:px-8'>
        <div className='w-screen max-w-lg h-44 bg-[url("/20250904_211642_0000.png")] bg-cover bg-center'></div>
        <div className='max-w-lg w-full bg-white p-8 space-y-8 border border-gray-100'>
          {/* Header */}
          <div className='text-center space-y-2'>
            <h2 className='text-2xl sm:text-3xl font-extrabold text-orange-500'>Kritik, Saran & Laporan Gangguan</h2>
            <p className='text-gray-500 text-sm'>Kami siap menerima masukan maupun laporan kendala dari Anda.</p>
          </div>

          {/* Form */}
          <form className='space-y-5' onSubmit={handleSubmit}>
            {/* Jenis Pesan */}
            <div className='form-control'>
              <label htmlFor='type' className='label font-medium text-gray-700'>
                Jenis Pesan
              </label>
              <select
                id='type'
                name='type'
                value={formData.type}
                onChange={handleChange}
                className='select select-bordered w-full border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
              >
                <option value='saran'>Saran atau Masukan</option>
                <option value='gangguan'>Laporkan Gangguan atau Keluhan</option>
              </select>
            </div>

            {/* Nama */}
            <div className='form-control'>
              <label htmlFor='name' className='label font-medium text-gray-700'>
                Nama (Opsional)
              </label>
              <input
                id='name'
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='Nama Anda'
                className='input input-bordered w-full border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
              />
            </div>

            {/* Email */}
            <div className='form-control'>
              <label htmlFor='email' className='label font-medium text-gray-700'>
                Email
              </label>
              <input
                id='email'
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='Email Anda'
                required
                className={`input input-bordered w-full border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.email ? 'border-red-400' : ''}`}
              />
              {errors.email && <p className='text-sm text-red-500 mt-1'>{errors.email}</p>}
            </div>

            {/* No HP */}
            <div className='form-control'>
              <label htmlFor='phone' className='label font-medium text-gray-700'>
                No. HP (Opsional)
              </label>
              <input
                id='phone'
                type='tel'
                name='phone'
                value={formData.phone}
                onChange={handleChange}
                placeholder='Nomor HP Anda'
                className='input input-bordered w-full border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
              />
            </div>

            {/* Pesan */}
            <div className='form-control'>
              <label htmlFor='message' className='label font-medium text-gray-700'>
                Pesan
              </label>
              <textarea
                id='message'
                name='message'
                value={formData.message}
                onChange={handleChange}
                placeholder='Tuliskan masukan atau gangguan di sini'
                rows={4}
                required
                className={`textarea textarea-bordered w-full border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.message ? 'border-red-400' : ''}`}
              />
              {errors.message && <p className='text-sm text-red-500 mt-1'>{errors.message}</p>}
            </div>

            {/* Screenshot */}
            {formData.type === 'gangguan' && (
              <div className='form-control'>
                <label htmlFor='screenshot' className='label font-medium text-gray-700'>
                  Screenshot Gangguan (Opsional)
                </label>
                <input
                  id='screenshot'
                  type='file'
                  accept='image/jpeg, image/png, image/webp, image/gif'
                  onChange={handleScreenshotChange}
                  className='file-input file-input-bordered w-full border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                />
                <p className='text-xs text-gray-400 mt-1'>Format: JPG, PNG, WEBP, GIF — Maks. 3 MB</p>

                {screenshotPreview && (
                  <div className='mt-3 relative w-fit'>
                    <img src={screenshotPreview} alt='Pratinjau screenshot' className='rounded border border-gray-200 max-h-48 object-contain' />
                    <button type='button' onClick={handleRemoveScreenshot} className='absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl hover:bg-red-600 transition-all'>
                      <FiX />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tombol Submit */}
            <button
              type='submit'
              disabled={loading}
              className={`w-full py-3 rounded font-semibold text-white transition-all duration-200 ${
                loading ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 active:scale-[0.98]'
              }`}
            >
              {loading ? 'Mengirim...' : 'Kirim Pesan'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Feedback

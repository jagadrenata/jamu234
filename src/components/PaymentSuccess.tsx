import React from 'react'

interface PaymentSuccessProps {
  orderId?: string
  amount?: number | null
  onViewOrder?: () => void
  onContinue?: () => void
  onDownload?: () => void
}

export default function PaymentSuccess({ orderId = '-', amount = null, onViewOrder = () => {}, onContinue = () => {}, onDownload = () => {} }: PaymentSuccessProps) {
  return (
    <div className='fixed w-screen h-screen top-0 min-h-screen flex items-center justify-center bg-gray-50 p-6 z-[100]'>
      {/* Card */}
      <div className='relative w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden'>
        {/* Confetti layer (pure CSS) */}
        <div className='pointer-events-none absolute inset-0'>
          <Confetti />
        </div>

        <div className='relative z-10 p-6 sm:p-10'>
          <div className='flex flex-col sm:flex-row items-center gap-6'>
            <div className='flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-4 w-24 h-24'>
              <svg xmlns='http://www.w3.org/2000/svg' className='w-12 h-12 text-green-700' viewBox='0 0 24 24' fill='none'>
                <path d='M20 6L9 17l-5-5' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
            </div>

            <div className='flex-1 text-center sm:text-left'>
              <h1 className='text-2xl font-semibold text-gray-800'>Pembayaran Berhasil!</h1>
              <p className='mt-1 text-sm text-gray-500'>Terima kasih — pesananmu telah disimpan.</p>

              <div className='mt-4 inline-flex items-center rounded-md bg-green-50 border border-green-200 px-3 py-1 text-green-800 text-sm'>
                <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4 mr-2' viewBox='0 0 24 24' fill='none'>
                  <path d='M5 13l4 4L19 7' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
                <span className='font-medium'>Nomor Pesanan: </span>
                <span className='ml-2 font-mono'>{orderId}</span>
              </div>

              {amount !== null && (
                <div className='mt-3 text-sm text-gray-600'>
                  Total: <span className='font-medium'>Rp {formatRupiah(amount)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className='mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3'>
            <button
              onClick={onViewOrder}
              className='col-span-1 sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-lg border border-transparent bg-green-600 text-white px-4 py-2 font-medium shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300'
            >
              <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4' viewBox='0 0 24 24' fill='none'>
                <path d='M3 7h18M3 12h18M3 17h18' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
              Lihat Pesanan
            </button>

            <button
              onClick={onDownload}
              className='col-span-1 inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-gray-700 px-4 py-2 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200'
            >
              <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4' viewBox='0 0 24 24' fill='none'>
                <path d='M21 15v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M7 10l5 5 5-5' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M12 15V3' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
              Unduh Bukti
            </button>

            <button
              onClick={onContinue}
              className='col-span-1 sm:col-span-3 mt-2 inline-flex items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 bg-transparent text-gray-700 px-4 py-2 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 sm:mt-0'
            >
              Lanjutkan
            </button>
          </div>

          {/* Small note */}
          <div className='mt-6 text-xs text-gray-400'>Jika butuh bantuan, balas pesan ini atau hubungi layanan pelanggan kami. Transaksi diproses pada waktu server.</div>
        </div>
      </div>
    </div>
  )
}

// --- small helpers + components ---

function formatRupiah(number: number): string {
  try {
    return new Intl.NumberFormat('id-ID').format(number)
  } catch {
    return number.toString()
  }
}

function Confetti() {
  return (
    <div aria-hidden='true' className='absolute inset-0 overflow-hidden'>
      <div className='pointer-events-none absolute inset-0'>
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className={`confetti confetti-${i}`}
            style={
              {
                left: `${(i * 7) % 100}%`,
                top: `${(i * 11) % 50}%`,
              } as React.CSSProperties
            }
          />
        ))}

        <style>{`
          .confetti{position:absolute;display:block;width:10px;height:14px;border-radius:2px;opacity:0.95;transform:rotate(15deg);}
          .confetti::before{content:'';display:block;width:100%;height:100%;border-radius:2px;}
          .confetti-0::before{background:#34d399}
          .confetti-1::before{background:#60a5fa}
          .confetti-2::before{background:#f472b6}
          .confetti-3::before{background:#fbbf24}
          .confetti-4::before{background:#f87171}
          .confetti-5::before{background:#34d399}
          .confetti-6::before{background:#60a5fa}
          .confetti-7::before{background:#f472b6}
          .confetti-8::before{background:#fbbf24}
          .confetti-9::before{background:#f87171}
          .confetti-10::before{background:#34d399}
          .confetti-11::before{background:#60a5fa}
          .confetti-12::before{background:#f472b6}
          .confetti-13::before{background:#fbbf24}
          .confetti-14::before{background:#f87171}
          .confetti-15::before{background:#34d399}
          .confetti-16::before{background:#60a5fa}
          .confetti-17::before{background:#f472b6}

          @keyframes conf-drop { 0%{ transform: translateY(-10vh) rotate(0deg);} 100%{ transform: translateY(120vh) rotate(360deg);} }
          @keyframes conf-sway { 0%{ transform: translateX(0);} 50%{ transform: translateX(20px);} 100%{ transform: translateX(0);} }

          ${Array.from({ length: 18 })
            .map((_, i) => {
              const dur = 2 + (i % 5) * 0.6
              const delay = (i % 7) * 0.12
              return `.confetti-${i}{animation: conf-drop ${dur}s linear ${delay}s both, conf-sway ${1.2 + (i % 3) * 0.3}s ease-in-out ${delay}s infinite;}`
            })
            .join('\n')}
        `}</style>
      </div>
    </div>
  )
}

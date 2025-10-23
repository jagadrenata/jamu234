import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { order_id, total_price, name, email, phone } = body

    // Cek dulu apakah order_id sudah ada di database
    //  const { data: existing, error: checkError } = await supabase.from('anon_orders').select('midtrans_url, midtrans_token').eq('id', order_id).single()

    // if (checkError && checkError.code !== 'PGRST116') throw checkError

    // Jika sudah ada transaksi sebelumnya → kirim ulang link lama

    // Buat transaksi baru di Midtrans
    const midtransUrl = 'https://app.sandbox.midtrans.com/snap/v1/transactions'
    const serverKey = process.env.MIDTRANS_SERVER_KEY

    if (!serverKey) throw new Error('Server key not set')

    const response = await fetch(midtransUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(serverKey + ':').toString('base64'),
      },
      body: JSON.stringify({
        transaction_details: {
          order_id,
          gross_amount: total_price,
        },
        customer_details: {
          first_name: name,
          email,
          phone,
        },
        credit_card: {
          secure: true,
        },
        callbacks: {
          finish: `${process.env.NEXT_PUBLIC_SITE_URL}/anon/my-orders?id=${order_id}&name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}`,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) throw new Error(data.message || 'Midtrans API error')

    // Simpan ke database
    await supabase.from('anon_orders').insert([
      {
        id: order_id,
        midtrans_token: data.token,
        midtrans_url: data.redirect_url,
        name,
        email,
        phone,
        total_price,
      },
    ])

    // Balikin ke client
    return NextResponse.json({
      message: 'Transaction created successfully',
      redirect_url: data.redirect_url,
      token: data.token,
    })
  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json({ message: 'Payment failed' }, { status: 500 })
  }
}

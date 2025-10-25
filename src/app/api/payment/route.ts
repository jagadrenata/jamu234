import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { order_id, total_price, name, email, phone } = body

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

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // PENTING: pakai service role key
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('Webhook body:', body)

    const serverKey = process.env.MIDTRANS_SERVER_KEY || ''
    const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = body

    // Verifikasi signature
    const crypto = await import('crypto')
    const expectedSignature = crypto
      .createHash('sha512')
      .update(order_id + status_code + gross_amount + serverKey)
      .digest('hex')

    console.log('Signature check:', { signature_key, expectedSignature })

    if (signature_key !== expectedSignature) {
      console.warn('Invalid signature detected')
      return NextResponse.json({ message: 'Invalid signature' }, { status: 403 })
    }

    // Tentukan status baru
    let newStatus = 'pending'
    if (transaction_status === 'settlement' || (transaction_status === 'capture' && fraud_status === 'accept')) {
      newStatus = 'paid'
    } else if (['cancel', 'deny', 'expire'].includes(transaction_status)) {
      newStatus = 'failed'
    }

    console.log('Calculated newStatus:', newStatus)

    // Cek apakah row ada dulu
    const { data: rowBefore, error: selectBeforeError } = await supabase
      .from('anon_orders')
      .select('*')
      .eq('id', order_id)

    console.log('Row before update:', rowBefore, 'Select error before update:', selectBeforeError)

    if (!rowBefore || rowBefore.length === 0) {
      console.warn('No row found for order_id:', order_id)
    }

    // Update status
    const { data: updatedData, error: updateError } = await supabase
      .from('anon_orders')
      .update({ status: newStatus })
      .eq('id', order_id)
      .select('*') // ambil row setelah update

    if (updateError) console.error('Supabase update error:', updateError)
    console.log('Row after update:', updatedData)

    // Cek tipe data kolom status (optional, buat debug)
    if (updatedData && updatedData.length > 0) {
      const statusType = typeof updatedData[0].status
      console.log('Type of status column:', statusType)
    }

    return NextResponse.json(
      {
        message: 'Webhook processed',
        newStatus,
        updatedData,
        rowBefore,
      },
      { status: 200 },
    )
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ message: 'Internal error', error: err }, { status: 500 })
  }
}
// app/api/anon-order/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string)

export async function POST(req: Request) {
  try {
    const { id, contact } = await req.json()

    if (!id || !contact) {
      return NextResponse.json({ error: 'id dan nomor hp/email wajib diisi' }, { status: 400 })
    }

    // Cek order berdasarkan id dan email/phone
    const { data: order, error: orderError } = await supabase.from('anon_orders').select('*').or(`email.eq.${contact},phone.eq.${contact}`).eq('id', id).single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan atau data tidak cocok' }, { status: 404 })
    }

    // Ambil item dari anon_order_items
    const { data: items, error: itemError } = await supabase.from('anon_order_items').select('*').eq('order_id', order.id)

    if (itemError) throw itemError

    return NextResponse.json({
      order,
      items,
    })
  } catch (err: unknown) {
    console.error(err)
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 })
  }
}

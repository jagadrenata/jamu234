import { NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

// ---- Types ----
interface Address {
  desc?: string
  long?: number
  lang?: number
}

export interface AnonOrder {
  id: string
  total_price: number
  status: string
  name: string
  email?: string | null
  phone?: string | null
  address?: Address | null
  midtrans_url?: string | null
  midtrans_token?: string | null
  created_at?: string
}

export interface AnonOrderItem {
  order_id: string
  variant_id: number
  quantity: number
  price: number
}

// ---- Supabase Client ----
const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

// ---- POST /api/orders ----
// Body JSON:
// {
//   "name": string,
//   "email": string,
//   "phone"?: string,
//   "address"?: { desc?: string, long?: number, lang?: number },
//   "items": [{ variant_id: number, quantity: number, price: number }],
//   "total_price": number
// }

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { name, email, phone, address, items, total_price } = body

    if (!name || !email || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Nama, email, dan items wajib diisi.' },
        { status: 400 }
      )
    }

    const orderId = `anon-${uuidv4().slice(0, 8)}`

    // Insert ke anon_orders
    const { error: orderError } = await supabase.from('anon_orders').insert([
      {
        id: orderId,
        name,
        email,
        phone,
        total_price,
        status: 'pending',
        address: address || null,
      } satisfies AnonOrder,
    ])

    if (orderError) {
      console.error('Order insert error:', orderError)
      return NextResponse.json(
        { error: 'Gagal membuat pesanan.' },
        { status: 500 }
      )
    }

    // Insert ke anon_order_items
    const orderItems = items.map(
      (item: AnonOrderItem) => ({
        order_id: orderId,
        variant_id: item.variant_id,
        quantity: item.quantity,
        price: item.price,
      })
    )

    const { error: itemsError } = await supabase
      .from('anon_order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Items insert error:', itemsError)
      return NextResponse.json(
        { error: 'Gagal menyimpan item pesanan.' },
        { status: 500 }
      )
    }

    // Return respons ke client
    return NextResponse.json({
      success: true,
      order: {
        id: orderId,
        name,
        email,
        phone,
        total_price,
        status: 'pending',
        address,
      },
      items: orderItems,
    })
  } catch (err) {
    console.error('POST /api/orders error:', err)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server.' },
      { status: 500 }
    )
  }
}
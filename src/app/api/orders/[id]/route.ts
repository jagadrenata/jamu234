// src/app/api/orders/[id]/route.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

export interface Product {
  id: number
  name: string
  description?: string
  img?: string[]
}

export interface ProductVariant {
  id: number
  product_id: number
  name: string
  price: number
  quantity: number
  img?: string[]
  product?: Product
}

export interface AnonOrderItem {
  id: number
  order_id: string
  variant_id: number
  quantity: number
  price: number
  variant?: ProductVariant
}

export interface ApiOrderResponse {
  order: AnonOrder
  items: AnonOrderItem[]
}

// ---- Supabase Client ----
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ---- GET /api/orders/[id]?email=... atau ?phone=... ----
export async function GET(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const id = pathname.split('/').pop() // ambil [id] dari URL
  
  const email = searchParams.get('email')
  const phone = searchParams.get('phone')

  if (!id || (!email && !phone)) {
    return NextResponse.json(
      { error: 'id dan (email atau phone) wajib disertakan' },
      { status: 400 }
    )
  }

  const condition = email ? { email } : { phone }

  // Fetch order
  const { data: order, error: orderError } = await supabase
    .from('anon_orders')
    .select('*')
    .match({ id, ...condition })
    .single<AnonOrder>()

  if (orderError || !order) {
    return NextResponse.json(
      { error: 'Pesanan tidak ditemukan' },
      { status: 404 }
    )
  }

  // Fetch order items beserta variant & product (nested join)
  const { data: items, error: itemsError } = await supabase
    .from('anon_order_items')
    .select(`
      id,
      order_id,
      variant_id,
      quantity,
      price,
      product_variants (
        id,
        product_id,
        name,
        price,
        quantity,
        img,
        products (
          id,
          name,
          description,
          img
        )
      )
    `)
    .eq('order_id', id)
    .returns<AnonOrderItem[]>()

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 })
  }

  // Supabase otomatis memberi nama relasi berdasarkan foreign key:
  // product_variants → variants, products → product (cek di Supabase Table Editor)

  return NextResponse.json({ order, items: items ?? [] })
}
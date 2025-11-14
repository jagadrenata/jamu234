import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const pw = body.pw // ambil password dari body JSON

  const password = 'jamutidakselalupahit_terkadang403lebihmemahitkan'

  if (pw !== password) {
    return NextResponse.json({ error: 'Password salah!' }, { status: 401 })
  }

  return NextResponse.json({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  })
}
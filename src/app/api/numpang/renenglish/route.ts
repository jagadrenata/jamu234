import fetch from 'node-fetch'


// src/app/api/numpang/renenglish/route.ts
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const FUNCTION_URL = 'https://khbckwxvjvirlljhogda.functions.supabase.co/ai-function'
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoYmNrd3h2anZpcmxsamhvZ2RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMzU1NDYsImV4cCI6MjA2NjgxMTU0Nn0.MeDzBXzUfNv_8Pq90pQ2xj_K6Vvzjvod5Yhp-VBDQ0o`,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Failed to fetch' }), { status: 500 })
  }
}

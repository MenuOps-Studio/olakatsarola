import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req: Request) => {
  // 1. Διαχείριση κρυφών αιτημάτων (CORS / Preflight)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } })
  }

  // 2. Επαλήθευση από το Viva Wallet (GET request)
  if (req.method === 'GET') {
    const url = new URL(req.url)
    const token = url.searchParams.get('verificationToken')
    return new Response(
      JSON.stringify({ Key: token || "" }),
      { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, status: 200 }
    )
  }

  // 3. Επεξεργασία πραγματικής πληρωμής (POST)
  try {
    const text = await req.text()
    if (!text) return new Response("Empty", { status: 200 })

    const payload = JSON.parse(text)
    if (!payload.EventData) return new Response("No event data", { status: 200 })

    const merchantTrns = payload.EventData.MerchantTrns || payload.EventData.CustomerTrns || ""
    const match = merchantTrns.match(/#(\d+)/)
    
    if (match) {
      const orderId = parseInt(match[1])
      const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      const supabase = createClient(supabaseUrl, supabaseKey)

      await supabase.from('orders').update({ payment_status: 'PAID' }).eq('id', orderId)
    }
    
    return new Response("OK", { status: 200 })
  } catch (error) {
    return new Response("Error processed", { status: 200 })
  }
})
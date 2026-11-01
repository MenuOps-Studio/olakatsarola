// supabase/functions/create-viva-order/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { encode } from "https://deno.land/std@0.168.0/encoding/base64.ts"

// Ορίζουμε τα CORS headers ώστε το site μας (frontend) να μπορεί να καλέσει τη συνάρτηση
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Χειρισμός του preflight request από τον browser (OPTIONS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, customerEmail, customerName, orderNotes } = await req.json()

    // Διαβάζουμε τα μυστικά κλειδιά που βάλαμε στο Supabase Dashboard
    const merchantId = Deno.env.get('VIVA_MERCHANT_ID')
    const apiKey = Deno.env.get('VIVA_API_KEY')
    const sourceCode = Deno.env.get('VIVA_SOURCE_CODE')

    if (!merchantId || !apiKey || !sourceCode) {
      throw new Error("Missing Viva Wallet credentials in Supabase Secrets")
    }

    // Το Viva απαιτεί τα credentials σε Base64 μορφή (merchantId:apiKey)
    const credentials = encode(`${merchantId}:${apiKey}`)

    // Το ποσό στο Viva πρέπει να είναι σε cents (π.χ. 10.50 ευρώ = 1050)
    const amountInCents = Math.round(amount * 100)

    // Κλήση προς το API του Viva Wallet για δημιουργία Order
    // (Χρησιμοποιούμε το demo API προς το παρόν: demo.vivapayments.com)
    // ΟΤΑΝ ΤΟ ΚΑΝΕΙΣ LIVE: θα αλλάξεις το 'demo.vivapayments.com' σε 'www.vivapayments.com'
    const response = await fetch('https://demo.vivapayments.com/api/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInCents,
        customerTrns: orderNotes || `ΟΛΑ ΚΑΤΣΑΡΟΛΑ Παραγγελία από ${customerName}`,
        customer: {
          email: customerEmail || 'no-email@customer.com',
          fullName: customerName,
        },
        sourceCode: sourceCode,
        // Αν θέλεις, μπορείς να περάσεις και το URL επιστροφής όταν πετύχει/αποτύχει
        // urlSuccess: 'https://olakatsarola.gr/success',
        // urlFail: 'https://olakatsarola.gr/fail'
      }),
    })

    const data = await response.json()

    if (!response.ok) {
       console.error("Viva Wallet API Error:", data);
       throw new Error(`Viva API Error: ${data.message || 'Unknown error'}`)
    }

    // Το Viva επιστρέφει το OrderCode που χρειαζόμαστε!
    return new Response(
      JSON.stringify({ orderCode: data.OrderCode }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error: any) {
    console.error("Function Error:", error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export const Route = createFileRoute('/success')({
  component: SuccessPage,
})

function SuccessPage() {
  const [orderStatus, setOrderStatus] = useState<string>('Ελέγχεται...')

  useEffect(() => {
    // 1. Παίρνουμε το ID της παραγγελίας (πρέπει να το έχεις αποθηκεύσει στο localStorage πριν την πληρωμή)
    const orderId = localStorage.getItem('lastOrderId')
    
    if (!orderId) {
      setOrderStatus('Δεν βρέθηκε ενεργή παραγγελία.')
      return
    }

    // 2. Αρχική φόρτωση της κατάστασης (prep_status)
    const fetchStatus = async () => {
      const { data } = await supabase
        .from('orders')
        .select('prep_status')
        .eq('id', orderId)
        .single()
        
      if (data) updateUI(data.prep_status)
    }
    fetchStatus()

    // 3. Ζωντανή παρακολούθηση (Realtime Subscription)
    const subscription = supabase
      .channel('public:orders')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
        (payload) => {
          updateUI(payload.new.prep_status)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  // 4. Μετατροπή της τιμής της βάσης σε φιλικό ελληνικό κείμενο
  const updateUI = (status: string) => {
    if (status === 'WAITING') setOrderStatus('Λήφθηκε - Σε αναμονή')
    else if (status === 'PREPARING') setOrderStatus('Στην Κουζίνα - Ετοιμάζεται!')
    else if (status === 'COMPLETED') setOrderStatus('Έτοιμη για παραλαβή/αποστολή!')
    else if (status === 'CANCELLED') setOrderStatus('Ακυρώθηκε')
    else setOrderStatus(status)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-4xl font-bold text-green-600 mb-4">Η πληρωμή ολοκληρώθηκε!</h1>
      <p className="text-lg text-gray-600 mb-8">Η παραγγελία σας καταχωρήθηκε επιτυχώς.</p>
      
      <div className="my-6 p-8 bg-white border-2 border-orange-100 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">Live Κατασταση Παραγγελιας</h2>
        <p className="text-3xl font-black text-orange-600 animate-pulse">{orderStatus}</p>
      </div>

      <Link to="/" className="mt-8 px-8 py-3 bg-red-800 text-white rounded-md hover:bg-red-900 transition-colors font-medium">
        Επιστροφή στο Μενού
      </Link>
    </div>
  )
}
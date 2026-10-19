import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Banknote, CreditCard, Loader2, Minus, Plus, ShoppingBag, X, Clock, Flame, MapPin, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/menu";
import { supabase } from "@/lib/supabase";

type Step = "cart" | "checkout" | "redirect" | "tracking";

export function CartDrawer() {
  const { open, setOpen, lines, total, setQty, clear } = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState<"cash" | "card">("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States για το Live Tracking
  const [trackingId, setTrackingId] = useState<number | null>(null);
  const [orderStatus, setOrderStatus] = useState<string>("WAITING");

  const close = () => {
    setOpen(false);
    setTimeout(() => {
      if (step !== "tracking") setStep("cart");
    }, 300);
  };

  // --- REALTIME LISTENER ΓΙΑ ΤΟ TRACKING ---
  useEffect(() => {
    if (!trackingId) return;

    const channel = supabase
      .channel(`order-tracking-${trackingId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${trackingId}` },
        (payload) => {
          setOrderStatus(payload.new['prep_status']);
          
          if (payload.new['prep_status'] === "PREPARING") toast.success("Η παραγγελία σας μπήκε στην κουζίνα!");
          if (payload.new['prep_status'] === "READY") toast.success("Η παραγγελία ετοιμάστηκε και περιμένει τον διανομέα!");
          if (payload.new['prep_status'] === "COMPLETED") toast.success("Ο διανομέας παρέλαβε! Η παραγγελία είναι στον δρόμο!");
          if (payload.new['prep_status'] === "CANCELLED") toast.error("Η παραγγελία ακυρώθηκε από το κατάστημα.");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [trackingId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !phone.trim()) {
      toast.error("Συμπληρώστε όνομα, διεύθυνση και τηλέφωνο");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: restData, error: restError } = await supabase
        .from("restaurants")
        .select("id")
        .eq("slug", "ola-katsarola")
        .single();

      if (restError || !restData) throw new Error("Δεν βρέθηκε το εστιατόριο");

      const formattedItems = lines.map(line => ({
        id: line.itemId,
        name: line.name,
        price: line.price,
        quantity: line.qty,
        removedIngredients: line.removed,
        itemNote: "" 
      }));

      const { data: newOrder, error } = await supabase.from("orders").insert({
        restaurant_id: restData.id,
        order_type: "DELIVERY",
        customer_last_name: name,
        table_number: "Πακέτο",
        notes: `Τηλ: ${phone} | Διεύθυνση: ${address}`,
        items: formattedItems,
        total_amount: total,
        payment_method: payment === "card" ? "CARD" : "CASH",
        payment_status: payment === "card" ? "PENDING" : "UNPAID",
        prep_status: "WAITING",
        created_at: new Date().toISOString()
      }).select("id, prep_status").single();

      if (error) throw error;

      if (payment === "card") {
        setStep("redirect");
        await new Promise((r) => setTimeout(r, 2200));
      }
      
      setTrackingId(newOrder.id);
      setOrderStatus(newOrder.prep_status);
      
      clear();
      setStep("tracking");
    } catch (err) {
      console.error("Σφάλμα καταχώρησης:", err);
      toast.error("Υπήρξε πρόβλημα με την παραγγελία. Δοκιμάστε ξανά.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepStatus = (stepName: string) => {
    const order = ["WAITING", "PREPARING", "READY", "COMPLETED"];
    const currentIndex = order.indexOf(orderStatus);
    const stepIndex = order.indexOf(stepName);
    
    if (orderStatus === "CANCELLED") return "cancelled";
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "pending";
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-ink/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-soft"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
              <div className="flex items-center gap-2">
                {step === "checkout" && (
                  <button onClick={() => setStep("cart")} aria-label="Πίσω" className="-ml-2 flex h-10 w-10 items-center justify-center">
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                )}
                <h2 className="text-xl font-bold">
                  {step === "checkout" ? "Ολοκλήρωση" : step === "tracking" ? "Παρακολούθηση" : "ScanEat Καλάθι"}
                </h2>
              </div>
              <button onClick={close} aria-label="Κλείσιμο" className="flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-border transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {step === "cart" && (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  {lines.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                      <ShoppingBag className="mb-3 h-10 w-10" />
                      <p>Το καλάθι σας είναι άδειο</p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-border">
                      {lines.map((l) => (
                        <li key={l.key} className="flex gap-3 py-4">
                          <div className="flex-1">
                            <p className="font-semibold">{l.name}</p>
                            {l.removed.length > 0 && (
                              <p className="mt-1 text-xs text-primary">Χωρίς: {l.removed.join(", ")}</p>
                            )}
                            <p className="mt-1 text-sm text-muted-foreground">{formatPrice(l.price * l.qty)}</p>
                          </div>
                          <div className="flex h-10 items-center rounded-full border border-border">
                            <button aria-label="Μείωση" onClick={() => setQty(l.key, l.qty - 1)} className="flex h-10 w-9 items-center justify-center"><Minus className="h-4 w-4" /></button>
                            <span className="w-5 text-center text-sm font-semibold">{l.qty}</span>
                            <button aria-label="Αύξηση" onClick={() => setQty(l.key, l.qty + 1)} className="flex h-10 w-9 items-center justify-center"><Plus className="h-4 w-4" /></button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="border-t border-border p-5">
                  <div className="mb-4 flex justify-between text-lg font-bold">
                    <span>Σύνολο</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    disabled={lines.length === 0}
                    onClick={() => setStep("checkout")}
                    className="h-14 w-full rounded-full bg-primary font-semibold text-primary-foreground disabled:opacity-40"
                  >
                    Συνέχεια στην Παραγγελία
                  </motion.button>
                </div>
              </>
            )}

            {step === "checkout" && (
              <form onSubmit={submit} className="flex flex-1 flex-col">
                <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">Ονοματεπώνυμο</span>
                    <input required value={name} onChange={(e) => setName(e.target.value)} maxLength={100} className="h-12 w-full rounded-xl border border-input bg-card px-4 outline-none focus:ring-2 focus:ring-ring" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">Τηλέφωνο Επικοινωνίας</span>
                    <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} className="h-12 w-full rounded-xl border border-input bg-card px-4 outline-none focus:ring-2 focus:ring-ring" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">Διεύθυνση παράδοσης</span>
                    <input required value={address} onChange={(e) => setAddress(e.target.value)} maxLength={200} className="h-12 w-full rounded-xl border border-input bg-card px-4 outline-none focus:ring-2 focus:ring-ring" />
                  </label>
                  <div>
                    <span className="mb-2 block text-sm font-medium">Τρόπος πληρωμής</span>
                    <div className="grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1">
                      {([["cash", "Αντικαταβολή", Banknote], ["card", "Κάρτα", CreditCard]] as const).map(([v, label, Icon]) => (
                        <button
                          type="button"
                          key={v}
                          onClick={() => setPayment(v)}
                          className={`flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors ${payment === v ? "bg-ink text-ink-foreground shadow-sm" : "text-muted-foreground hover:bg-border/50"}`}
                        >
                          <Icon className="h-4 w-4" /> {label}
                        </button>
                      ))}
                    </div>
                    {payment === "card" && (
                      <p className="mt-2 text-xs text-muted-foreground">Θα μεταφερθείτε με ασφάλεια στο Viva Wallet Smart Checkout.</p>
                    )}
                  </div>
                </div>
                <div className="border-t border-border p-5">
                  <div className="mb-4 flex justify-between text-lg font-bold">
                    <span>Σύνολο</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <button disabled={isSubmitting} type="submit" className="flex h-14 w-full items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground disabled:opacity-70 transition-colors hover:bg-primary/90">
                    {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : (payment === "card" ? "Πληρωμή με Viva Wallet" : "Υποβολή Παραγγελίας")}
                  </button>
                </div>
              </form>
            )}

            {step === "redirect" && (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-lg font-semibold">Μεταφορά στο Viva Wallet Smart Checkout…</p>
                <p className="text-sm text-muted-foreground">Μην κλείσετε το παράθυρο.</p>
              </div>
            )}

            {step === "tracking" && (
              <div className="flex flex-1 flex-col bg-card px-6 py-8">
                <div className="text-center mb-10">
                  <p className="font-display text-2xl font-bold text-ink">Η Παραγγελία εστάλη!</p>
                  <p className="text-sm text-muted-foreground mt-2">Αριθμός παρακολούθησης: #{trackingId}</p>
                </div>

                {orderStatus === "CANCELLED" ? (
                  <div className="flex flex-col items-center justify-center p-6 bg-red-50 rounded-2xl border border-red-100 text-center">
                    <X className="h-12 w-12 text-red-500 mb-3" />
                    <h3 className="text-lg font-bold text-red-700">Η παραγγελία ακυρώθηκε</h3>
                    <p className="text-sm text-red-600 mt-2">Το κατάστημα αδυνατεί να εξυπηρετήσει την παραγγελία σας αυτή τη στιγμή.</p>
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-10 border-l-2 border-border ml-4">
                    {/* Βήμα 1: Λήφθηκε */}
                    <div className="relative">
                      <div className={`absolute -left-[35px] flex h-8 w-8 items-center justify-center rounded-full border-4 border-card ${getStepStatus("WAITING") === "completed" || getStepStatus("WAITING") === "active" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        <Clock className="h-4 w-4" />
                      </div>
                      <div className={getStepStatus("WAITING") === "active" ? "opacity-100" : "opacity-50"}>
                        <h4 className={`text-base font-bold ${getStepStatus("WAITING") === "active" ? "text-primary" : "text-ink"}`}>Λήφθηκε</h4>
                        <p className="text-sm text-muted-foreground">Το κατάστημα ελέγχει την παραγγελία.</p>
                      </div>
                    </div>

                    {/* Βήμα 2: Ετοιμάζεται */}
                    <div className="relative">
                      <div className={`absolute -left-[35px] flex h-8 w-8 items-center justify-center rounded-full border-4 border-card ${getStepStatus("PREPARING") === "completed" || getStepStatus("PREPARING") === "active" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        <Flame className="h-4 w-4" />
                      </div>
                      <div className={getStepStatus("PREPARING") === "active" ? "opacity-100" : "opacity-50"}>
                        <h4 className={`text-base font-bold ${getStepStatus("PREPARING") === "active" ? "text-primary" : "text-ink"}`}>Ετοιμάζεται</h4>
                        <p className="text-sm text-muted-foreground">Η κατσαρόλα πήρε φωτιά!</p>
                      </div>
                    </div>

                    {/* Βήμα 3: Έτοιμη */}
                    <div className="relative">
                      <div className={`absolute -left-[35px] flex h-8 w-8 items-center justify-center rounded-full border-4 border-card ${getStepStatus("READY") === "completed" || getStepStatus("READY") === "active" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        <ShoppingBag className="h-4 w-4" />
                      </div>
                      <div className={getStepStatus("READY") === "active" ? "opacity-100" : "opacity-50"}>
                        <h4 className={`text-base font-bold ${getStepStatus("READY") === "active" ? "text-primary" : "text-ink"}`}>Έτοιμη</h4>
                        <p className="text-sm text-muted-foreground">Περιμένει τον διανομέα να την παραλάβει.</p>
                      </div>
                    </div>

                    {/* Βήμα 4: Στον δρόμο (Completed στο Admin) */}
                    <div className="relative">
                      <div className={`absolute -left-[35px] flex h-8 w-8 items-center justify-center rounded-full border-4 border-card ${getStepStatus("COMPLETED") === "active" ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"}`}>
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div className={getStepStatus("COMPLETED") === "active" ? "opacity-100" : "opacity-50"}>
                        <h4 className={`text-base font-bold ${getStepStatus("COMPLETED") === "active" ? "text-emerald-600" : "text-ink"}`}>Στον δρόμο</h4>
                        <p className="text-sm text-muted-foreground">Έρχεται από στιγμή σε στιγμή!</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-8">
                  <button onClick={() => { setStep("cart"); setOpen(false); setTrackingId(null); }} className="h-12 w-full rounded-full bg-ink font-semibold text-ink-foreground hover:bg-primary transition-colors">
                    Κλείσιμο παραθύρου
                  </button>
                  <p className="text-center text-xs text-muted-foreground mt-3">Αφήστε ανοιχτό αυτό το παράθυρο για ζωντανή εξέλιξη.</p>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
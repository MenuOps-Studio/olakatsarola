import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Banknote, CreditCard, Loader2, Minus, Plus, ShoppingBag, X, Clock, Flame, MapPin, CheckCircle, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useCart, type CartLine } from "@/lib/cart";
import { formatPrice } from "@/lib/menu";
import { ItemModal } from "@/components/ItemModal";
import { supabase } from "@/lib/supabase";
import { Trash2 } from "lucide-react";

type Step = "cart" | "checkout" | "redirect" | "tracking";

export function CartDrawer() {
  const { open, setOpen, lines, total, setQty, clear } = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [floor, setFloor] = useState("");
  const [bell, setBell] = useState("");
  const [comments, setComments] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [payment, setPayment] = useState<"cash" | "card">("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingLine, setEditingLine] = useState<CartLine | null>(null);

  // States για το Live Tracking
  const [trackingId, setTrackingId] = useState<number | null>(null);
  const [orderStatus, setOrderStatus] = useState<string>("WAITING");

// --- LISTENER ΓΙΑ ΑΝΟΙΓΜΑ TRACKING ΑΠΟ ΤΟ LIVE TRACKER ---
  useEffect(() => {
    const handleOpenTracking = (e: any) => {
      setTrackingId(e.detail.orderId);
      setOrderStatus(e.detail.status);
      setStep("tracking"); // Πάμε στο βήμα παρακολούθησης
      setOpen(true);       // Ανοίγουμε το συρτάρι του καλαθιού
    };

    window.addEventListener("scaneat_open_tracking", handleOpenTracking);
    return () => window.removeEventListener("scaneat_open_tracking", handleOpenTracking);
  }, [setOpen]);

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
    
    // Αυστηροί έλεγχοι
    if (name.trim().length < 3) {
      toast.error("Το όνομα πρέπει να έχει τουλάχιστον 3 χαρακτήρες.");
      return;
    }
    if (!address.trim()) {
      toast.error("Παρακαλώ συμπληρώστε διεύθυνση.");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Το τηλέφωνο πρέπει να αποτελείται από ακριβώς 10 αριθμούς.");
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

      // Φτιάχνουμε το τελικό κείμενο για το πεδίο notes
      // Στα notes κρατάμε ΜΟΝΟ τον όροφο, το κουδούνι και το σχόλιο του πελάτη (αν υπάρχουν)
      const orderNotes = [
        floor && `Όροφος: ${floor}`,
        bell && `Κουδούνι: ${bell}`,
        comments && `${comments}`
      ].filter(Boolean).join(" | ");

      const { data: newOrder, error } = await supabase.from("orders").insert({
        restaurant_id: restData.id,
        order_type: "DELIVERY",
        customer_last_name: name,
        customer_phone: phone,       // <--- Προσθήκη τηλεφώνου στη βάση
        delivery_address: address,   // <--- Προσθήκη διεύθυνσης στη βάση
        table_number: "Πακέτο",
        notes: orderNotes,           // <--- Θα περιέχει πλέον μόνο τα επιπλέον στοιχεία/σχόλια
        items: formattedItems,
        total_amount: total,
        payment_method: payment === "card" ? "CARD" : "CASH",
        payment_status: payment === "card" ? "PENDING" : "UNPAID",
        prep_status: "WAITING",
        created_at: new Date().toISOString()
      }).select("id, prep_status").single();

      if (error) throw error;

      // Αποθηκεύουμε το ID της παραγγελίας
      localStorage.setItem('lastOrderId', newOrder.id.toString()); // Κρατάμε το παλιό για συμβατότητα με το success.tsx
      
      // ΝΕΑ ΛΟΓΙΚΗ ΓΙΑ MULTIPLE ORDERS
      const savedOrders = localStorage.getItem("scaneat_active_orders");
      let activeList = [];
      if (savedOrders) {
        try { activeList = JSON.parse(savedOrders); } catch (e) { activeList = []; }
      }
      activeList.push(newOrder.id);
      localStorage.setItem("scaneat_active_orders", JSON.stringify(activeList));
      
      // ΠΡΟΣΘΗΚΗ: Φωνάζουμε στο LiveTracker ότι μπήκε νέα παραγγελία!
      window.dispatchEvent(new Event("scaneat_new_order_added"));

      // --- ΣΥΝΔΕΣΗ ΜΕ VIVA WALLET ---
      if (payment === "card") {
        setStep("redirect");
        
        // 1. Κλήση της Edge Function για λήψη OrderCode
        const { data: vivaData, error: vivaError } = await supabase.functions.invoke('create-viva-order', {
          body: {
            amount: total,
            customerName: name,
            customerEmail: "",
            orderNotes: `Παραγγελία #${newOrder.id} - ${phone}`
          }
        });

        if (vivaError || !vivaData?.orderCode) {
          throw new Error("Αποτυχία δημιουργίας πληρωμής Viva Wallet.");
        }

        // 2. Ανακατεύθυνση στο ασφαλές περιβάλλον του Smart Checkout (Demo)
        window.location.href = `https://demo.vivapayments.com/web/checkout?ref=${vivaData.orderCode}`;
        return; // Σταματάμε την εκτέλεση, ο χρήστης φεύγει από το site
      }
      
      // Διαχείριση μετρητών (Αντικαταβολή)
      setTrackingId(newOrder.id);
      setOrderStatus(newOrder.prep_status);
      clear();
      setStep("tracking");
    } catch (err) {
      console.error("Σφάλμα καταχώρησης:", err);
      toast.error("Υπήρξε πρόβλημα με την παραγγελία. Δοκιμάστε ξανά.");
      setStep("cart");
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
    <>
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
              {/* Header Συρταριού */}
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
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

              {/* Βήμα 1: Καλάθι */}
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
                          <li key={l.key} className="flex items-center gap-3 py-4">
                            <button onClick={() => setEditingLine(l)} className="flex-1 text-left group rounded-xl p-2 -ml-2 transition-colors hover:bg-muted/50">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold group-hover:text-primary transition-colors">{l.name}</p>
                                <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              {l.removed.length > 0 && <p className="mt-1 text-xs text-primary">Χωρίς: {l.removed.join(", ")}</p>}
                              {l.note && <p className="mt-1 text-xs text-muted-foreground italic">"{l.note}"</p>}
                              <p className="mt-1 text-sm font-medium text-muted-foreground">{formatPrice(l.price * l.qty)}</p>
                            </button>
                            
                            <div className="flex shrink-0 items-center gap-2">
                              <div className="flex h-10 items-center rounded-full border border-border">
                                <button aria-label="Μείωση" onClick={() => setQty(l.key, l.qty - 1)} className="flex h-10 w-9 items-center justify-center"><Minus className="h-4 w-4" /></button>
                                <span className="w-5 text-center text-sm font-semibold">{l.qty}</span>
                                <button aria-label="Αύξηση" onClick={() => setQty(l.key, l.qty + 1)} className="flex h-10 w-9 items-center justify-center"><Plus className="h-4 w-4" /></button>
                              </div>
                              <button aria-label="Διαγραφή" onClick={() => setQty(l.key, 0)} className="flex h-10 w-10 items-center justify-center rounded-full text-destructive/80 transition-colors hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="shrink-0 border-t border-border p-5 bg-background">
                    <div className="mb-4 flex justify-between text-lg font-bold">
                      <span>Σύνολο</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      disabled={lines.length === 0}
                      onClick={() => setStep("checkout")}
                      className="flex h-14 w-full items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground disabled:opacity-40 transition-colors hover:bg-primary/90"
                    >
                      Συνέχεια στην Παραγγελία
                    </motion.button>
                  </div>
                </>
              )}

              {/* Βήμα 2: Ολοκλήρωση / Checkout (Με σωστό εσωτερικό scroll και σταθερό footer) */}
              {step === "checkout" && (
                <form onSubmit={submit} className="flex flex-1 flex-col overflow-hidden">
                  <div className="flex-1 space-y-4 overflow-y-auto px-5 py-6">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium">Ονοματεπώνυμο *</span>
                      <input required minLength={3} value={name} onChange={(e) => setName(e.target.value)} placeholder="π.χ. Γιώργος Παπαδόπουλος" className="h-12 w-full rounded-xl border border-input bg-card px-4 outline-none focus:ring-2 focus:ring-ring" />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium">Τηλέφωνο Επικοινωνίας *</span>
                      <input 
                        required 
                        type="tel" 
                        pattern="\d{10}" 
                        maxLength={10} 
                        value={phone} 
                        onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Το τηλέφωνο πρέπει να αποτελείται από ακριβώς 10 αριθμούς.")}
                        onChange={(e) => {
                          (e.target as HTMLInputElement).setCustomValidity(""); 
                          setPhone(e.target.value.replace(/\D/g, ''));
                        }} 
                        placeholder="π.χ. 6900000000" 
                        className="h-12 w-full rounded-xl border border-input bg-card px-4 outline-none focus:ring-2 focus:ring-ring" 
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium">Διεύθυνση παράδοσης *</span>
                      <input required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Οδός και αριθμός" className="h-12 w-full rounded-xl border border-input bg-card px-4 outline-none focus:ring-2 focus:ring-ring" />
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium">Όροφος</span>
                        <input value={floor} onChange={(e) => setFloor(e.target.value)} placeholder="π.χ. 2ος" className="h-12 w-full rounded-xl border border-input bg-card px-4 outline-none focus:ring-2 focus:ring-ring" />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium">Κουδούνι</span>
                        <input value={bell} onChange={(e) => setBell(e.target.value)} placeholder="π.χ. Παπαδόπουλος" className="h-12 w-full rounded-xl border border-input bg-card px-4 outline-none focus:ring-2 focus:ring-ring" />
                      </label>
                    </div>
                    <label className="block">
                      <span className="mb-2 flex justify-between text-sm font-medium">
                        <span>Σχόλια</span>
                        <span className="text-muted-foreground text-xs">{comments.length}/50</span>
                      </span>
                      <input value={comments} onChange={(e) => setComments(e.target.value)} maxLength={50} placeholder="Πρόσθετες οδηγίες (προαιρετικό)" className="h-12 w-full rounded-xl border border-input bg-card px-4 outline-none focus:ring-2 focus:ring-ring" />
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

                  <div className="shrink-0 border-t border-border p-5 bg-background shadow-lg">
                    <div className="mb-3 flex justify-between text-lg font-bold">
                      <span>Σύνολο</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    
                    <label className="mb-4 flex items-start gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        required
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-input text-primary focus:ring-primary" 
                      />
                      <span className="text-[11px] text-muted-foreground leading-snug">
                        Έχω διαβάσει και αποδέχομαι τους <a href="/terms" target="_blank" className="text-primary underline hover:text-primary/80">Όρους Χρήσης</a> και την <a href="/privacy" target="_blank" className="text-primary underline hover:text-primary/80">Πολιτική Απορρήτου</a>.
                      </span>
                    </label>

                    <button 
                      disabled={isSubmitting || !acceptedTerms} 
                      type="submit" 
                      className="flex h-12 w-full items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-primary/90"
                    >
                      {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : (payment === "card" ? "Πληρωμή με Viva Wallet" : "Υποβολή Παραγγελίας")}
                    </button>
                  </div>
                </form>
              )}

              {/* Βήμα 3: Redirect */}
              {step === "redirect" && (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="text-lg font-semibold">Μεταφορά στο Viva Wallet Smart Checkout…</p>
                  <p className="text-sm text-muted-foreground">Μην κλείσετε το παράθυρο.</p>
                </div>
              )}

              {/* Βήμα 4: Tracking */}
              {step === "tracking" && (
                <div className="flex flex-1 flex-col bg-card px-6 py-8 overflow-y-auto">
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
                      <div className="relative">
                        <div className={`absolute -left-[35px] flex h-8 w-8 items-center justify-center rounded-full border-4 border-card ${getStepStatus("WAITING") === "completed" || getStepStatus("WAITING") === "active" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}><Clock className="h-4 w-4" /></div>
                        <div className={getStepStatus("WAITING") === "active" ? "opacity-100" : "opacity-50"}><h4 className={`text-base font-bold ${getStepStatus("WAITING") === "active" ? "text-primary" : "text-ink"}`}>Λήφθηκε</h4><p className="text-sm text-muted-foreground">Το κατάστημα ελέγχει την παραγγελία.</p></div>
                      </div>
                      <div className="relative">
                        <div className={`absolute -left-[35px] flex h-8 w-8 items-center justify-center rounded-full border-4 border-card ${getStepStatus("PREPARING") === "completed" || getStepStatus("PREPARING") === "active" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}><Flame className="h-4 w-4" /></div>
                        <div className={getStepStatus("PREPARING") === "active" ? "opacity-100" : "opacity-50"}><h4 className={`text-base font-bold ${getStepStatus("PREPARING") === "active" ? "text-primary" : "text-ink"}`}>Ετοιμάζεται</h4><p className="text-sm text-muted-foreground">Η κατσαρόλα πήρε φωτιά!</p></div>
                      </div>
                      <div className="relative">
                        <div className={`absolute -left-[35px] flex h-8 w-8 items-center justify-center rounded-full border-4 border-card ${getStepStatus("READY") === "completed" || getStepStatus("READY") === "active" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}><ShoppingBag className="h-4 w-4" /></div>
                        <div className={getStepStatus("READY") === "active" ? "opacity-100" : "opacity-50"}><h4 className={`text-base font-bold ${getStepStatus("READY") === "active" ? "text-primary" : "text-ink"}`}>Έτοιμη</h4><p className="text-sm text-muted-foreground">Περιμένει τον διανομέα να την παραλάβει.</p></div>
                      </div>
                      <div className="relative">
                        <div className={`absolute -left-[35px] flex h-8 w-8 items-center justify-center rounded-full border-4 border-card ${getStepStatus("COMPLETED") === "active" ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"}`}><MapPin className="h-4 w-4" /></div>
                        <div className={getStepStatus("COMPLETED") === "active" ? "opacity-100" : "opacity-50"}><h4 className={`text-base font-bold ${getStepStatus("COMPLETED") === "active" ? "text-emerald-600" : "text-ink"}`}>Στον δρόμο</h4><p className="text-sm text-muted-foreground">Έρχεται από στιγμή σε στιγμή!</p></div>
                      </div>
                    </div>
                  )}

                  <div className="mt-auto pt-8">
                    <button onClick={() => { setStep("cart"); setOpen(false); setTrackingId(null); }} className="h-12 w-full rounded-full bg-ink font-semibold text-ink-foreground hover:bg-primary transition-colors">
                      Κλείσιμο παραθύρου
                    </button>
                  </div>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

    <ItemModal
      item={editingLine?.rawItem || null}
      editLine={editingLine}
      onClose={() => setEditingLine(null)}
    />
  </>
  );
}
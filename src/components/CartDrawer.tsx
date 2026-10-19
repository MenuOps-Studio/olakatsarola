import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Banknote, CreditCard, Loader2, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/menu";
import { supabase } from "@/lib/supabase";

type Step = "cart" | "checkout" | "redirect" | "done";

export function CartDrawer() {
  const { open, setOpen, lines, total, setQty, clear } = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<"cash" | "card">("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const close = () => {
    setOpen(false);
    setTimeout(() => step === "done" && setStep("cart"), 300);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) {
      toast.error("Συμπληρώστε όνομα και διεύθυνση");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Βρίσκουμε το σωστό ID του εστιατορίου
      const { data: restData, error: restError } = await supabase
        .from("restaurants")
        .select("id")
        .eq("slug", "ola-katsarola")
        .single();

      if (restError || !restData) throw new Error("Δεν βρέθηκε το εστιατόριο");

      // 2. Αποθήκευση της παραγγελίας με το σωστό ID
      const { error } = await supabase.from("orders").insert({
        restaurant_id: restData.id, // Εδώ μπαίνει το αυτόματο ID που βρήκαμε
        order_type: "delivery",
        customer_last_name: name,
        notes: `Διεύθυνση: ${address}`,
        items: lines,
        total_amount: total,
        payment_method: payment,
        payment_status: payment === "card" ? "pending" : "unpaid",
        prep_status: "pending"
      });

      if (error) throw error;

      if (payment === "card") {
        setStep("redirect");
        await new Promise((r) => setTimeout(r, 2200));
      }
      
      clear();
      setStep("done");
    } catch (err) {
      console.error("Σφάλμα καταχώρησης:", err);
      toast.error("Υπήρξε πρόβλημα με την παραγγελία. Δοκιμάστε ξανά.");
    } finally {
      setIsSubmitting(false);
    }
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
                  {step === "checkout" ? "Ολοκλήρωση" : "ScanEat Καλάθι"}
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
                  <button disabled={isSubmitting} type="submit" className="flex h-14 w-full items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground disabled:opacity-70">
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

            {step === "done" && (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <p className="font-display text-3xl font-bold">Ευχαριστούμε!</p>
                <p className="text-muted-foreground">Η παραγγελία σας καταχωρήθηκε και ετοιμάζεται στην κατσαρόλα.</p>
                <button onClick={() => { setStep("cart"); setOpen(false); }} className="mt-4 h-12 rounded-full bg-ink px-8 font-semibold text-ink-foreground hover:bg-primary transition-colors">
                  Κλείσιμο
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
import { AnimatePresence, motion } from "framer-motion";
import { Check, Minus, Plus, X, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCart, type CartLine } from "@/lib/cart";
import { formatPrice, type MenuItem } from "@/lib/menu";

export function ItemModal({ 
  item, 
  editLine, // ΝΕΟ: Η γραμμή προς επεξεργασία (αν υπάρχει)
  onClose 
}: { 
  item: MenuItem | null; 
  editLine?: CartLine | null;
  onClose: () => void; 
}) {
  const { add, updateLine } = useCart();
  const [removed, setRemoved] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");

  // Όταν ανοίγει το Modal, αν είναι για "Επεξεργασία" φορτώνει τις παλιές επιλογές
  useEffect(() => {
    if (editLine) {
      setRemoved(editLine.removed);
      setQty(editLine.qty);
      setNote(editLine.note || "");
    } else if (item) {
      setRemoved([]);
      setQty(1);
      setNote("");
    }
  }, [item, editLine]);

  const toggle = (ing: string) =>
    setRemoved((r) => (r.includes(ing) ? r.filter((x) => x !== ing) : [...r, ing]));

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/60 sm:items-center" // z-[60] για να είναι πάνω από το CartDrawer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-label={item.name}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-3xl bg-card p-6 shadow-soft sm:rounded-3xl max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold">{item.name}</h3>
                <p className="mt-1 font-semibold text-primary">{formatPrice(item.price)}</p>
              </div>
              <button onClick={onClose} aria-label="Κλείσιμο" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            {item.ingredients.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Υλικά · αποεπιλέξτε όσα δεν θέλετε
                </p>
                <ul className="space-y-2">
                  {item.ingredients.map((ing) => {
                    const on = !removed.includes(ing);
                    return (
                      <li key={ing}>
                        <button
                          onClick={() => toggle(ing)}
                          className="flex w-full items-center justify-between rounded-xl border border-border px-4 py-3 text-left transition-colors"
                        >
                          <span className={on ? "" : "text-muted-foreground line-through"}>{ing}</span>
                          <span className={`flex h-6 w-6 items-center justify-center rounded-md border ${on ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                            {on && <Check className="h-4 w-4" />}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* ΠΕΔΙΟ ΣΧΟΛΙΩΝ */}
            <div className="mt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" /> Ειδικές Οδηγίες (Προαιρετικό)
              </p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="π.χ. Χωρίς πολύ αλάτι, καλοψημένο..."
                className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary h-20"
              />
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-full border border-border">
                <button aria-label="Μείωση" onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-12 w-12 items-center justify-center"><Minus className="h-4 w-4" /></button>
                <span className="w-6 text-center font-semibold">{qty}</span>
                <button aria-label="Αύξηση" onClick={() => setQty((q) => q + 1)} className="flex h-12 w-12 items-center justify-center"><Plus className="h-4 w-4" /></button>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (editLine) {
                    updateLine(editLine.key, item, removed, qty, note);
                    toast.success("Οι αλλαγές αποθηκεύτηκαν");
                  } else {
                    add(item, removed, qty, note);
                    toast.success(`${item.name} προστέθηκε στο καλάθι`);
                  }
                  onClose();
                }}
                className="flex h-12 flex-1 items-center justify-between rounded-full bg-primary px-5 font-semibold text-primary-foreground"
              >
                <span>{editLine ? "Ενημέρωση" : "Προσθήκη"}</span>
                <span>{formatPrice(item.price * qty)}</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
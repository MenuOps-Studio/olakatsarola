import { AnimatePresence, motion } from "framer-motion";
import { Check, Minus, Plus, X, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCart, type CartLine } from "@/lib/cart";
import { formatPrice, type MenuItem } from "@/lib/menu";
import { supabase } from "@/lib/supabase";

// ΝΕΟ: Εισαγωγή του i18n
import { useI18n } from "@/lib/i18n"; 

export function ItemModal({ 
  item, 
  editLine,
  onClose 
}: { 
  item: (MenuItem & { raw?: any }) | null; 
  editLine?: CartLine | null;
  onClose: () => void; 
}) {
  const { add, updateLine } = useCart();
  const { t, getLocalizedField, lang } = useI18n(); // ΝΕΟ: Ο εγκέφαλος γλωσσών
  
  const [removed, setRemoved] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [ingredientStatuses, setIngredientStatuses] = useState<Record<string, string>>({});
  const [ingredientDataMap, setIngredientDataMap] = useState<Record<string, any>>({}); // ΝΕΟ: Κρατάει τα μεταφρασμένα υλικά

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

    if (item) {
      const fetchStatuses = async () => {
        const { data } = await supabase
          .from('ingredients')
          .select('*') // Φέρνουμε όλα τα πεδία (και τα name_en, name_bg)
          .eq('restaurant_id', 5);

        if (data) {
          const statuses: Record<string, string> = {};
          const ingDataMap: Record<string, any> = {};
          data.forEach(d => {
            statuses[d.name] = d.status;
            ingDataMap[d.name] = d;
          });
          setIngredientStatuses(statuses);
          setIngredientDataMap(ingDataMap);
        }
      };
      fetchStatuses();
    }
  }, [item, editLine]);

  const toggle = (ing: string) =>
    setRemoved((r) => (r.includes(ing) ? r.filter((x) => x !== ing) : [...r, ing]));

  // ΝΕΟ: Υπολογισμός μεταφρασμένου ονόματος πιάτου
  let displayName = "";
  if (item) {
    const baseName = item.raw ? (getLocalizedField(item.raw, 'name') || item.raw.name) : item.name.replace(" (Ατομικό)", "").replace(" (Μερίδα)", "");
    displayName = baseName;
    // Προσθέτουμε την ένδειξη μερίδας στη σωστή γλώσσα (αν υπάρχει)
    if (item.name.includes("(Ατομικό)")) displayName += lang === 'en' ? " (Individual)" : lang === 'bg' ? " (Единична)" : " (Ατομικό)";
    if (item.name.includes("(Μερίδα)")) displayName += lang === 'en' ? " (Portion)" : lang === 'bg' ? " (Порция)" : " (Μερίδα)";
  }

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/60 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-label={displayName}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-3xl bg-card p-6 shadow-soft sm:rounded-3xl max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold">{displayName}</h3>
                <p className="mt-1 font-semibold text-primary">{formatPrice(item.price)}</p>
              </div>
              <button onClick={onClose} aria-label="Κλείσιμο" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            {item.ingredients.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {t('ingredientsLabel')}
                </p>
                <ul className="space-y-2">
                  {item.ingredients.map((ing) => {
                    const status = ingredientStatuses[ing] || 'AVAILABLE';
                    const isUnavailable = status === 'UNAVAILABLE' || status === 'UNAVAILABLE_TODAY';
                    const on = !removed.includes(ing) && !isUnavailable;
                    
                    // ΝΕΟ: Εμφάνιση του υλικού στη σωστή γλώσσα (ΑΛΛΑ κρατάμε το ελληνικό 'ing' στο toggle!)
                    const displayIngName = ingredientDataMap[ing] ? (getLocalizedField(ingredientDataMap[ing], 'name') || ing) : ing;

                    return (
                      <li key={ing}>
                        <button
                          disabled={isUnavailable}
                          onClick={() => toggle(ing)}
                          className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
                            isUnavailable ? "border-destructive/30 bg-destructive/5 cursor-not-allowed" : "border-border"
                          }`}
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className={on ? "" : "text-muted-foreground line-through"}>{displayIngName}</span>
                            {isUnavailable && <span className="text-[10px] font-bold text-destructive uppercase tracking-wider">{t('soldOut')}</span>}
                          </div>
                          
                          {!isUnavailable ? (
                            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${on ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                              {on && <Check className="h-4 w-4" />}
                            </span>
                          ) : (
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-destructive/30 bg-destructive/10">
                              <X className="h-4 w-4 text-destructive" />
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="mt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" /> {t('specialInstructions')}
              </p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t('instructionsPlaceholder')}
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
                    const toastUpdated = lang === 'en' ? "Changes saved" : lang === 'bg' ? "Промените са запазени" : "Οι αλλαγές σου αποθηκεύτηκαν";
                    toast.success(toastUpdated);
                  } else {
                    add(item, removed, qty, note);
                    const toastAdded = lang === 'en' ? "added to cart" : lang === 'bg' ? "добавено в количката" : "προστέθηκε στο καλάθι";
                    toast.success(`${displayName} ${toastAdded}`);
                  }
                  onClose();
                }}
                className="flex h-12 flex-1 items-center justify-between rounded-full bg-primary px-5 font-semibold text-primary-foreground"
              >
                <span>{editLine ? t('update') : t('add')}</span>
                <span>{formatPrice(item.price * qty)}</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
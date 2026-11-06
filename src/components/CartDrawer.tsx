import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Banknote, CreditCard, Loader2, Minus, Plus, ShoppingBag, X, Clock, Flame, MapPin, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useCart, type CartLine } from "@/lib/cart";
import { formatPrice } from "@/lib/menu";
import { ItemModal } from "@/components/ItemModal";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";

type Step = "cart" | "checkout" | "redirect" | "tracking";

const drawerTranslations = {
  el: {
    cartHeader: "ScanEat Καλάθι", checkoutHeader: "Ολοκλήρωση", trackingHeader: "Παρακολούθηση", empty: "Το καλάθι σας είναι άδειο", without: "Χωρίς", total: "Σύνολο", continue: "Συνέχεια στην Παραγγελία",
    name: "Ονοματεπώνυμο *", namePh: "π.χ. Γιώργος Παπαδόπουλος", phone: "Τηλέφωνο Επικοινωνίας *", phonePh: "π.χ. 6900000000", address: "Διεύθυνση παράδοσης *", addressPh: "Οδός και αριθμός", floor: "Όροφος", floorPh: "π.χ. 2ος", bell: "Κουδούνι", bellPh: "π.χ. Παπαδόπουλος", comments: "Σχόλια", commentsPh: "Πρόσθετες οδηγίες (προαιρετικό)",
    payment: "Τρόπος πληρωμής", cash: "Αντικαταβολή", card: "Κάρτα", vivaInfo: "Θα μεταφερθείτε με ασφάλεια στο Viva Wallet Smart Checkout.", termsPre: "Έχω διαβάσει και αποδέχομαι τους", termsLink: "Όρους Χρήσης", and: "και την", privacyLink: "Πολιτική Απορρήτου",
    submitViva: "Πληρωμή με Viva Wallet", submitOrder: "Υποβολή Παραγγελίας", redirecting: "Μεταφορά στο Viva Wallet Smart Checkout…", dontClose: "Μην κλείσετε το παράθυρο.", orderSent: "Η Παραγγελία εστάλη!", trackNum: "Αριθμός παρακολούθησης",
    cancelTitle: "Η παραγγελία ακυρώθηκε", cancelDesc: "Το κατάστημα αδυνατεί να εξυπηρετήσει την παραγγελία σας αυτή τη στιγμή.", statusWaiting: "Λήφθηκε", statusWaitingDesc: "Το κατάστημα ελέγχει την παραγγελία.", statusPrep: "Ετοιμάζεται", statusPrepDesc: "Η κατσαρόλα πήρε φωτιά!", statusReady: "Έτοιμη", statusReadyDesc: "Περιμένει τον διανομέα να την παραλάβει.", statusComp: "Στον δρόμο", statusCompDesc: "Έρχεται από στιγμή σε στιγμή!", closeWindow: "Κλείσιμο παραθύρου", toastPrep: "Η παραγγελία σας μπήκε στην κουζίνα!", toastReady: "Η παραγγελία ετοιμάστηκε και περιμένει τον διανομέα!", toastComp: "Ο διανομέας παρέλαβε! Η παραγγελία είναι στον δρόμο!", toastCancel: "Η παραγγελία ακυρώθηκε από το κατάστημα.", errName: "Το όνομα πρέπει να έχει τουλάχιστον 3 χαρακτήρες.", errAddress: "Παρακαλώ συμπληρώστε διεύθυνση.", errPhone: "Το τηλέφωνο πρέπει να αποτελείται από ακριβώς 10 αριθμούς.", errGeneral: "Υπήρξε πρόβλημα με την παραγγελία. Δοκιμάστε ξανά."
  },
  en: {
    cartHeader: "ScanEat Cart", checkoutHeader: "Checkout", trackingHeader: "Order Tracking", empty: "Your cart is empty", without: "Without", total: "Total", continue: "Continue to Checkout",
    name: "Full Name *", namePh: "e.g. John Doe", phone: "Phone Number *", phonePh: "e.g. 6900000000", address: "Delivery Address *", addressPh: "Street and number", floor: "Floor", floorPh: "e.g. 2nd", bell: "Bell", bellPh: "e.g. Doe", comments: "Comments", commentsPh: "Additional instructions (optional)",
    payment: "Payment Method", cash: "Cash on Delivery", card: "Credit/Debit Card", vivaInfo: "You will be securely redirected to Viva Wallet Smart Checkout.", termsPre: "I have read and accept the", termsLink: "Terms of Use", and: "and the", privacyLink: "Privacy Policy",
    submitViva: "Pay with Viva Wallet", submitOrder: "Submit Order", redirecting: "Redirecting to Viva Wallet Smart Checkout…", dontClose: "Please do not close this window.", orderSent: "Order Sent!", trackNum: "Tracking number",
    cancelTitle: "Order Cancelled", cancelDesc: "The restaurant is unable to fulfill your order at this time.", statusWaiting: "Received", statusWaitingDesc: "The restaurant is reviewing your order.", statusPrep: "Preparing", statusPrepDesc: "Your meal is being cooked!", statusReady: "Ready", statusReadyDesc: "Waiting for the courier to pick it up.", statusComp: "On the Way", statusCompDesc: "Arriving shortly!", closeWindow: "Close window", toastPrep: "Your order is now in the kitchen!", toastReady: "Your order is ready and waiting for the courier!", toastComp: "The courier has picked up your order! It's on the way!", toastCancel: "Your order was cancelled by the restaurant.", errName: "Name must be at least 3 characters long.", errAddress: "Please provide a delivery address.", errPhone: "Phone must consist of exactly 10 digits.", errGeneral: "There was a problem with your order. Please try again."
  },
  bg: {
    cartHeader: "ScanEat Количка", checkoutHeader: "Завършване", trackingHeader: "Проследяване", empty: "Количката ви е празна", without: "Без", total: "Общо", continue: "Продължи към поръчка",
    name: "Име и Фамилия *", namePh: "напр. Иван Иванов", phone: "Телефон *", phonePh: "напр. 6900000000", address: "Адрес за доставка *", addressPh: "Улица и номер", floor: "Етаж", floorPh: "напр. 2-ри", bell: "Звънец", bellPh: "напр. Иванов", comments: "Коментари", commentsPh: "Допълнителни инструкции (по избор)",
    payment: "Начин на плащане", cash: "Наложен платеж", card: "Кредитна/Дебитна карта", vivaInfo: "Ще бъдете пренасочени сигурно към Viva Wallet Smart Checkout.", termsPre: "Прочетох и приемам", termsLink: "Условията за ползване", and: "и", privacyLink: "Политиката за поверителност",
    submitViva: "Плати с Viva Wallet", submitOrder: "Изпрати поръчка", redirecting: "Пренасочване към Viva Wallet Smart Checkout…", dontClose: "Моля, не затваряйте този прозорец.", orderSent: "Поръчката е изпратена!", trackNum: "Номер за проследяване",
    cancelTitle: "Поръчката е отменена", cancelDesc: "В момента ресторантът не може да изпълни вашата поръчка.", statusWaiting: "Получена", statusWaitingDesc: "Ресторантът преглежда вашата поръчка.", statusPrep: "Приготвя се", statusPrepDesc: "Ястието ви се готви!", statusReady: "Готова", statusReadyDesc: "Чака куриера да я вземе.", statusComp: "На път", statusCompDesc: "Пристига скоро!", closeWindow: "Затвори прозореца", toastPrep: "Поръчката ви е в кухнята!", toastReady: "Поръчката ви е готова и чака куриера!", toastComp: "Куриерът взе поръчката ви! Тя е на път!", toastCancel: "Поръчката ви беше отменена от ресторанта.", errName: "Името трябва да съдържа поне 3 знака.", errAddress: "Моля, въведете адрес за доставка.", errPhone: "Телефонът трябва да съдържа точно 10 цифри.", errGeneral: "Възникна проблем с поръчката ви. Моля, опитайте отново."
  }
};

export function CartDrawer() {
  const { open, setOpen, lines, total, setQty, clear } = useCart();
  const { lang, getLocalizedField } = useI18n(); 
  
  const t = (key: keyof typeof drawerTranslations.el) => drawerTranslations[lang][key] || drawerTranslations.el[key];

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
  const [trackingId, setTrackingId] = useState<number | null>(null);
  const [orderStatus, setOrderStatus] = useState<string>("WAITING");
  const [ingredientDataMap, setIngredientDataMap] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchIngs = async () => {
      const { data } = await supabase.from('ingredients').select('*').eq('restaurant_id', 5);
      if (data) {
        const ingMap: Record<string, any> = {};
        data.forEach(d => ingMap[d.name] = d);
        setIngredientDataMap(ingMap);
      }
    };
    fetchIngs();
  }, []);

  useEffect(() => {
    const handleOpenTracking = (e: any) => {
      setTrackingId(e.detail.orderId);
      setOrderStatus(e.detail.status);
      setStep("tracking");
      setOpen(true);
    };
    window.addEventListener("scaneat_open_tracking", handleOpenTracking);
    return () => window.removeEventListener("scaneat_open_tracking", handleOpenTracking);
  }, [setOpen]);

  const close = () => {
    setOpen(false);
    setTimeout(() => { if (step !== "tracking") setStep("cart"); }, 300);
  };

  useEffect(() => {
    if (!trackingId) return;
    const channel = supabase
      .channel(`order-tracking-${trackingId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${trackingId}` },
        (payload) => {
          setOrderStatus(payload.new['prep_status']);
          if (payload.new['prep_status'] === "PREPARING") toast.success(t('toastPrep'));
          if (payload.new['prep_status'] === "READY") toast.success(t('toastReady'));
          if (payload.new['prep_status'] === "COMPLETED") toast.success(t('toastComp'));
          if (payload.new['prep_status'] === "CANCELLED") toast.error(t('toastCancel'));
        }
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [trackingId, lang]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3) { toast.error(t('errName')); return; }
    if (!address.trim()) { toast.error(t('errAddress')); return; }
    if (!/^\d{10}$/.test(phone)) { toast.error(t('errPhone')); return; }
    setIsSubmitting(true);
    try {
      const { data: restData, error: restError } = await supabase.from("restaurants").select("id").eq("slug", "ola-katsarola").single();
      if (restError || !restData) throw new Error("Δεν βρέθηκε το εστιατόριο");

      const formattedItems = lines.map(line => ({
        id: line.itemId, name: line.name, price: line.price, quantity: line.qty,
        removedIngredients: line.removed, itemNote: line.note || "" 
      }));

      const orderNotes = [ floor && `Όροφος: ${floor}`, bell && `Κουδούνι: ${bell}`, comments && `${comments}` ].filter(Boolean).join(" | ");

      const { data: newOrder, error } = await supabase.from("orders").insert({
        restaurant_id: restData.id, order_type: "DELIVERY", customer_last_name: name, customer_phone: phone, customer_address: address, table_number: "Πακέτο",
        notes: orderNotes, items: formattedItems, total_amount: total,
        payment_method: payment === "card" ? "CARD" : "CASH", payment_status: payment === "card" ? "PENDING" : "UNPAID",
        prep_status: "WAITING", created_at: new Date().toISOString()
      }).select("id, prep_status").single();

      if (error) throw error;
      localStorage.setItem('lastOrderId', newOrder.id.toString());
      
      const savedOrders = localStorage.getItem("scaneat_active_orders");
      let activeList = [];
      if (savedOrders) { try { activeList = JSON.parse(savedOrders); } catch (e) { activeList = []; } }
      activeList.push(newOrder.id);
      localStorage.setItem("scaneat_active_orders", JSON.stringify(activeList));
      window.dispatchEvent(new Event("scaneat_new_order_added"));

      if (payment === "card") {
        setStep("redirect");
        const { data: vivaData, error: vivaError } = await supabase.functions.invoke('create-viva-order', {
          body: { amount: total, customerName: name, customerEmail: "", orderNotes: `Παραγγελία #${newOrder.id}\n${phone}` }
        });
        if (vivaError || !vivaData?.orderCode) throw new Error("Αποτυχία δημιουργίας πληρωμής Viva Wallet.");
        window.location.href = `https://demo.vivapayments.com/web/checkout?ref=${vivaData.orderCode}`;
        return; 
      }
      setTrackingId(newOrder.id);
      setOrderStatus(newOrder.prep_status);
      clear();
      setStep("tracking");
    } catch (err) {
      console.error("Σφάλμα καταχώρησης:", err);
      toast.error(t('errGeneral'));
      setStep("cart");
    } finally { setIsSubmitting(false); }
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
            <motion.div className="fixed inset-0 z-50 bg-ink/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} />
            <motion.aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-soft" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}>
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
                <div className="flex items-center gap-2">
                  {step === "checkout" && <button onClick={() => setStep("cart")} aria-label="Πίσω" className="-ml-2 flex h-10 w-10 items-center justify-center"><ArrowLeft className="h-5 w-5" /></button>}
                  <h2 className="text-xl font-bold">{step === "checkout" ? t('checkoutHeader') : step === "tracking" ? t('trackingHeader') : t('cartHeader')}</h2>
                </div>
                <button onClick={close} aria-label="Κλείσιμο" className="flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-border transition-colors"><X className="h-5 w-5" /></button>
              </div>

              {step === "cart" && (
                <>
                  <div className="flex-1 overflow-y-auto px-5 py-4">
                    {lines.length === 0 ? (
                      <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                        <ShoppingBag className="mb-3 h-10 w-10" />
                        <p>{t('empty')}</p>
                      </div>
                    ) : (
                      <ul className="divide-y divide-border">
                        {lines.map((l) => {
                          let displayItemName = "";
                          const sourceData = (l.rawItem || l) as any;

                          if (lang === 'en') displayItemName = sourceData.name_en || sourceData.raw?.name_en || l.name;
                          else if (lang === 'bg') displayItemName = sourceData.name_bg || sourceData.raw?.name_bg || l.name;
                          else displayItemName = sourceData.name_el || sourceData.raw?.name || l.name;

                          displayItemName = displayItemName.replace(" (Ατομικό)", "").replace(" (Μερίδα)", "").replace(" (Portion)", "").replace(" (Individual)", "").replace(" (Единична)", "").replace(" (Порция)", "");

                          if (l.name.includes("(Ατομικό)") || l.name.includes("Единична")) displayItemName += lang === 'en' ? " (Individual)" : lang === 'bg' ? " (Единична)" : " (Ατομικό)";
                          else if (l.name.includes("(Μερίδα)") || l.name.includes("Порция")) displayItemName += lang === 'en' ? " (Portion)" : lang === 'bg' ? " (Порция)" : " (Μερίδα)";

                          const translatedRemoved = l.removed.map(ing => {
                            const ingObj = ingredientDataMap[ing];
                            if (!ingObj) return ing;
                            if (lang === 'en') return ingObj.name_en || ingObj.name;
                            if (lang === 'bg') return ingObj.name_bg || ingObj.name;
                            return ingObj.name;
                          });

                          return (
                            <li key={l.key} className="flex items-center gap-3 py-4">
                              <button onClick={() => setEditingLine(l)} className="flex-1 text-left group rounded-xl p-2 -ml-2 transition-colors hover:bg-muted/50">
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold group-hover:text-primary transition-colors">{displayItemName}</p>
                                  <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                {l.removed.length > 0 && <p className="mt-1 text-xs text-primary">{t('without')}: {translatedRemoved.join(", ")}</p>}
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
                          );
                        })}
                      </ul>
                    )}
                  </div>
                  <div className="shrink-0 border-t border-border p-5 bg-background">
                    <div className="mb-4 flex justify-between text-lg font-bold"><span>{t('total')}</span><span>{formatPrice(total)}</span></div>
                    <motion.button whileTap={{ scale: 0.97 }} disabled={lines.length === 0} onClick={() => setStep("checkout")} className="flex h-14 w-full items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground disabled:opacity-40 transition-colors hover:bg-primary/90">
                      {t('continue')}
                    </motion.button>
                  </div>
                </>
              )}

              {step === "checkout" && (
                <form onSubmit={submit} className="flex flex-1 flex-col overflow-hidden">
                  <div className="flex-1 space-y-4 overflow-y-auto px-5 py-6">
                    <label className="block"><span className="mb-2 block text-sm font-medium">{t('name')}</span><input required minLength={3} value={name} onChange={(e) => setName(e.target.value)} placeholder={t('namePh')} className="h-12 w-full rounded-xl border border-input bg-card px-4 outline-none focus:ring-2 focus:ring-ring" /></label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium">{t('phone')}</span>
                      <input required type="tel" pattern="\d{10}" maxLength={10} value={phone} onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity(t('errPhone'))} onChange={(e) => { (e.target as HTMLInputElement).setCustomValidity(""); setPhone(e.target.value.replace(/\D/g, '')); }} placeholder={t('phonePh')} className="h-12 w-full rounded-xl border border-input bg-card px-4 outline-none focus:ring-2 focus:ring-ring" />
                    </label>
                    <label className="block"><span className="mb-2 block text-sm font-medium">{t('address')}</span><input required value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t('addressPh')} className="h-12 w-full rounded-xl border border-input bg-card px-4 outline-none focus:ring-2 focus:ring-ring" /></label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="block"><span className="mb-2 block text-sm font-medium">{t('floor')}</span><input value={floor} onChange={(e) => setFloor(e.target.value)} placeholder={t('floorPh')} className="h-12 w-full rounded-xl border border-input bg-card px-4 outline-none focus:ring-2 focus:ring-ring" /></label>
                      <label className="block"><span className="mb-2 block text-sm font-medium">{t('bell')}</span><input value={bell} onChange={(e) => setBell(e.target.value)} placeholder={t('bellPh')} className="h-12 w-full rounded-xl border border-input bg-card px-4 outline-none focus:ring-2 focus:ring-ring" /></label>
                    </div>
                    <label className="block">
                      <span className="mb-2 flex justify-between text-sm font-medium"><span>{t('comments')}</span><span className="text-muted-foreground text-xs">{comments.length}/50</span></span>
                      <input value={comments} onChange={(e) => setComments(e.target.value)} maxLength={50} placeholder={t('commentsPh')} className="h-12 w-full rounded-xl border border-input bg-card px-4 outline-none focus:ring-2 focus:ring-ring" />
                    </label>
                    <div>
                      <span className="mb-2 block text-sm font-medium">{t('payment')}</span>
                      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1">
                        {([["cash", t('cash'), Banknote], ["card", t('card'), CreditCard]] as const).map(([v, label, Icon]) => (
                          <button type="button" key={v} onClick={() => setPayment(v)} className={`flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors ${payment === v ? "bg-ink text-ink-foreground shadow-sm" : "text-muted-foreground hover:bg-border/50"}`}><Icon className="h-4 w-4" /> {label}</button>
                        ))}
                      </div>
                      {payment === "card" && <p className="mt-2 text-xs text-muted-foreground">{t('vivaInfo')}</p>}
                    </div>
                  </div>
                  <div className="shrink-0 border-t border-border p-5 bg-background shadow-lg">
                    <div className="mb-3 flex justify-between text-lg font-bold"><span>{t('total')}</span><span>{formatPrice(total)}</span></div>
                    <label className="mb-4 flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" required checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-input text-primary focus:ring-primary" />
                      <span className="text-[11px] text-muted-foreground leading-snug">
                        {t('termsPre')} <a href="/terms" target="_blank" className="text-primary underline hover:text-primary/80">{t('termsLink')}</a> {t('and')} <a href="/privacy" target="_blank" className="text-primary underline hover:text-primary/80">{t('privacyLink')}</a>.
                      </span>
                    </label>
                    <button disabled={isSubmitting || !acceptedTerms} type="submit" className="flex h-12 w-full items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-primary/90">
                      {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : (payment === "card" ? t('submitViva') : t('submitOrder'))}
                    </button>
                  </div>
                </form>
              )}

              {step === "redirect" && (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="text-lg font-semibold">{t('redirecting')}</p>
                  <p className="text-sm text-muted-foreground">{t('dontClose')}</p>
                </div>
              )}

              {step === "tracking" && (
                <div className="flex flex-1 flex-col bg-card px-6 py-8 overflow-y-auto">
                  <div className="text-center mb-10">
                    <p className="font-display text-2xl font-bold text-ink">{t('orderSent')}</p>
                    <p className="text-sm text-muted-foreground mt-2">{t('trackNum')}: #{trackingId}</p>
                  </div>
                  {orderStatus === "CANCELLED" ? (
                    <div className="flex flex-col items-center justify-center p-6 bg-red-50 rounded-2xl border border-red-100 text-center">
                      <X className="h-12 w-12 text-red-500 mb-3" />
                      <h3 className="text-lg font-bold text-red-700">{t('cancelTitle')}</h3>
                      <p className="text-sm text-red-600 mt-2">{t('cancelDesc')}</p>
                    </div>
                  ) : (
                    <div className="relative pl-6 space-y-10 border-l-2 border-border ml-4">
                      <div className="relative">
                        <div className={`absolute -left-[35px] flex h-8 w-8 items-center justify-center rounded-full border-4 border-card ${getStepStatus("WAITING") === "completed" || getStepStatus("WAITING") === "active" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}><Clock className="h-4 w-4" /></div>
                        <div className={getStepStatus("WAITING") === "active" ? "opacity-100" : "opacity-50"}><h4 className={`text-base font-bold ${getStepStatus("WAITING") === "active" ? "text-primary" : "text-ink"}`}>{t('statusWaiting')}</h4><p className="text-sm text-muted-foreground">{t('statusWaitingDesc')}</p></div>
                      </div>
                      <div className="relative">
                        <div className={`absolute -left-[35px] flex h-8 w-8 items-center justify-center rounded-full border-4 border-card ${getStepStatus("PREPARING") === "completed" || getStepStatus("PREPARING") === "active" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}><Flame className="h-4 w-4" /></div>
                        <div className={getStepStatus("PREPARING") === "active" ? "opacity-100" : "opacity-50"}><h4 className={`text-base font-bold ${getStepStatus("PREPARING") === "active" ? "text-primary" : "text-ink"}`}>{t('statusPrep')}</h4><p className="text-sm text-muted-foreground">{t('statusPrepDesc')}</p></div>
                      </div>
                      <div className="relative">
                        <div className={`absolute -left-[35px] flex h-8 w-8 items-center justify-center rounded-full border-4 border-card ${getStepStatus("READY") === "completed" || getStepStatus("READY") === "active" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}><ShoppingBag className="h-4 w-4" /></div>
                        <div className={getStepStatus("READY") === "active" ? "opacity-100" : "opacity-50"}><h4 className={`text-base font-bold ${getStepStatus("READY") === "active" ? "text-primary" : "text-ink"}`}>{t('statusReady')}</h4><p className="text-sm text-muted-foreground">{t('statusReadyDesc')}</p></div>
                      </div>
                      <div className="relative">
                        <div className={`absolute -left-[35px] flex h-8 w-8 items-center justify-center rounded-full border-4 border-card ${getStepStatus("COMPLETED") === "active" ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"}`}><MapPin className="h-4 w-4" /></div>
                        <div className={getStepStatus("COMPLETED") === "active" ? "opacity-100" : "opacity-50"}><h4 className={`text-base font-bold ${getStepStatus("COMPLETED") === "active" ? "text-emerald-600" : "text-ink"}`}>{t('statusComp')}</h4><p className="text-sm text-muted-foreground">{t('statusCompDesc')}</p></div>
                      </div>
                    </div>
                  )}
                  <div className="mt-auto pt-8">
                    <button onClick={() => { setStep("cart"); setOpen(false); setTrackingId(null); }} className="h-12 w-full rounded-full bg-ink font-semibold text-ink-foreground hover:bg-primary transition-colors">{t('closeWindow')}</button>
                  </div>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <ItemModal item={editingLine?.rawItem || null} editLine={editingLine} onClose={() => setEditingLine(null)} />
    </>
  );
} 
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, Loader2, ChefHat, CheckCircle2, ChevronUp, ChevronDown, Activity } from "lucide-react";
import { useCart } from "@/lib/cart";


type OrderStatus = "WAITING" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";

interface TrackedOrder {
  id: number;
  status: OrderStatus;
}

export function LiveTracker() {
  const [orders, setOrders] = useState<TrackedOrder[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { open: isCartOpen } = useCart();
  const containerRef = useRef<HTMLDivElement>(null);  // ΠΡΟΣΘΗΚΗ: Δημιουργία του ref για το container

  // ΠΡΟΣΘΗΚΗ: Listener για κλικ εκτός του component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    let channel: any;

    const loadActiveOrders = async () => {
      const savedOrdersString = localStorage.getItem("scaneat_active_orders");
      let activeIds: number[] = [];
      if (savedOrdersString) {
        try {
          activeIds = JSON.parse(savedOrdersString);
        } catch (e) {
          activeIds = [];
        }
      }

      if (activeIds.length === 0) {
        setOrders([]);
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select("id, prep_status")
        .in("id", activeIds);

      if (error) {
        console.error("Σφάλμα φόρτωσης στο LiveTracker:", error);
        return;
      }

      if (data) {
        const pending = data
          .filter((o) => o.prep_status !== "CANCELLED" && o.prep_status !== "COMPLETED")
          .map((o) => ({ id: o.id, status: o.prep_status as OrderStatus }));
        
        setOrders(pending);
        localStorage.setItem("scaneat_active_orders", JSON.stringify(pending.map(o => o.id)));
      }

      // Κλείσιμο του παλιού καναλιού αν υπάρχει
      if (channel) {
        await supabase.removeChannel(channel);
      }

      // Δημιουργία ΜΟΝΑΔΙΚΟΥ καναλιού για να μην χτυπάει το σφάλμα του subscribe
      const uniqueChannelName = `tracking_${Date.now()}`;
      
      channel = supabase
        .channel(uniqueChannelName)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'orders' },
          (payload) => {
            const updatedOrder = payload.new;
            setOrders((prev) => {
              const newStatus = updatedOrder.prep_status as OrderStatus;
              
              if (newStatus === "COMPLETED" || newStatus === "CANCELLED") {
                const updatedList = prev.filter(o => o.id !== updatedOrder.id);
                localStorage.setItem("scaneat_active_orders", JSON.stringify(updatedList.map(o => o.id)));
                return updatedList;
              }

              return prev.map(o => 
                o.id === updatedOrder.id 
                  ? { ...o, status: newStatus } 
                  : o
              );
            });
          }
        )
        .subscribe();
    };

    // 1. Τρέχει όταν ανοίγει η σελίδα
    loadActiveOrders();

    // 2. Τρέχει ΟΤΑΝ ακούσει το σήμα από το CartDrawer
    const handleNewOrder = () => {
      loadActiveOrders();
    };
    window.addEventListener("scaneat_new_order_added", handleNewOrder);

    return () => {
      window.removeEventListener("scaneat_new_order_added", handleNewOrder);
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const getStatusDisplay = (status: OrderStatus) => {
    switch (status) {
      case "WAITING": return { text: "Αναμονή επιβεβαίωσης", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" };
      case "PREPARING": return { text: "Ετοιμάζεται", icon: ChefHat, color: "text-blue-500", bg: "bg-blue-500/10" };
      case "READY": return { text: "Έτοιμη για διανομή", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" };
      case "COMPLETED": return { text: "Στον δρόμο", icon: MapPin, color: "text-green-600", bg: "bg-green-600/10" };
      default: return { text: "Άγνωστο", icon: Loader2, color: "text-muted-foreground", bg: "bg-muted" };
    }
  };

  if (orders.length === 0 || isCartOpen) return null;

  return (
    <div ref={containerRef} className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-80 overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
          >
            <div className="bg-muted px-4 py-3 border-b border-border flex justify-between items-center">
              <h3 className="font-bold text-sm">Οι Παραγγελίες μου</h3>
              <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                {orders.length} Ενεργές
              </span>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {orders.map((order) => {
                const display = getStatusDisplay(order.status);
                const Icon = display.icon;
                return (
                  <div 
                    key={order.id} 
                    onClick={() => {
                      // Στέλνουμε σήμα στο CartDrawer να ανοίξει αυτή την παραγγελία
                      window.dispatchEvent(new CustomEvent("scaneat_open_tracking", { 
                        detail: { orderId: order.id, status: order.status } 
                      }));
                      setIsOpen(false); // Κλείνουμε το μικρό popup
                    }}
                    className="mb-2 p-3 rounded-xl border border-border/50 bg-background flex items-center gap-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <div className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${display.bg} ${display.color}`}>
                       <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Παραγγελία #{order.id}</p>
                      <p className={`text-sm font-bold ${display.color}`}>{display.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 items-center gap-3 rounded-full bg-ink px-6 font-bold text-ink-foreground shadow-lg transition-transform hover:scale-105"
      >
        <Activity className="h-5 w-5 animate-pulse text-primary" />
        <span>Παρακολούθηση</span>
        <div className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
          {orders.length}
        </div>
        {isOpen ? <ChevronDown className="h-5 w-5 ml-1" /> : <ChevronUp className="h-5 w-5 ml-1" />}
      </button>
    </div>
  );
}
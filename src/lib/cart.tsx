import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { MenuItem } from "./menu";

export type CartLine = {
  key: string;
  itemId: string;
  name: string;
  price: number;
  removed: string[];
  qty: number;
  note: string;
  rawItem: MenuItem;
};

// Οι 2 ζώνες διανομής
export type DeliveryZone = "inner" | "outer";
export const DELIVERY_FEES = {
  inner: 0.70,
  outer: 1.20,
};

type CartCtx = {
  lines: CartLine[];
  count: number;
  itemsTotal: number; // Σύνολο ΜΟΝΟ των φαγητών
  total: number;      // Σύνολο + Delivery Fee
  open: boolean;
  setOpen: (v: boolean) => void;
  deliveryZone: DeliveryZone;
  setDeliveryZone: (zone: DeliveryZone) => void;
  add: (item: MenuItem, removed: string[], qty: number, note?: string) => void;
  updateLine: (oldKey: string, item: MenuItem, removed: string[], qty: number, note: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const STORAGE = "olakatsarola-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>("inner"); // Προεπιλογή: Εντός

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE, JSON.stringify(lines));
  }, [lines, loaded]);

  const value = useMemo<CartCtx>(() => {
    const itemsTotal = lines.reduce((s, l) => s + l.qty * l.price, 0);
    // Το τελικό total είναι το σύνολο των πιάτων συν το κόστος της επιλεγμένης ζώνης 
    // (ΜΟΝΟ αν το καλάθι δεν είναι άδειο)
    const total = itemsTotal > 0 ? itemsTotal + DELIVERY_FEES[deliveryZone] : 0;

    return {
      lines,
      open,
      setOpen,
      deliveryZone,
      setDeliveryZone,
      count: lines.reduce((s, l) => s + l.qty, 0),
      itemsTotal,
      total,
      
      add: (item, removed, qty, note = "") => {
        const key = `${item.id}|${[...removed].sort().join(",")}|${note.trim()}`;
        setLines((prev) => {
          const existing = prev.find((l) => l.key === key);
          if (existing) return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
          return [...prev, { key, itemId: item.id, name: item.name, price: item.price, removed, qty, note, rawItem: item }];
        });
      },

      updateLine: (oldKey, item, removed, qty, note) => {
        const newKey = `${item.id}|${[...removed].sort().join(",")}|${note.trim()}`;
        setLines((prev) => 
          prev.map((l) => 
            l.key === oldKey 
              ? { key: newKey, itemId: item.id, name: item.name, price: item.price, removed, qty, note, rawItem: item } 
              : l
          )
        );
      },

      setQty: (key, qty) =>
        setLines((prev) => (qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty } : l)))),
      
      clear: () => setLines([]),
    };
  }, [lines, open, deliveryZone]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
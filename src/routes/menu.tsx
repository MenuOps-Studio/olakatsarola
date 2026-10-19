import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ItemModal } from "@/components/ItemModal";
import { CAT_IMAGES, formatPrice, type MenuItem, type Category } from "@/lib/menu";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Μενού · ΟΛΑ ΚΑΤΣΑΡΟΛΑ" },
      { name: "description", content: "Δείτε το μενού μας και παραγγείλετε online μαγειρευτά, σαλάτες, θαλασσινά και ποτά." },
      { property: "og:title", content: "Μενού · ΟΛΑ ΚΑΤΣΑΡΟΛΑ" },
      { property: "og:description", content: "Online παραγγελία μέσω ScanEat από το ελληνικό μαγειρείο μας." },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const [active, setActive] = useState("");
  const pillsRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
    async function fetchMenu() {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*, restaurants!inner(slug)')
        .eq('restaurants.slug', 'ola-katsarola')
        .order('sort_order', { ascending: true, nullsFirst: false });

      if (error) {
        console.error("Σφάλμα φόρτωσης μενού:", error);
        setLoading(false);
        return;
      }

      const grouped = data.reduce((acc: Category[], item: any) => {
        if (item.status === 'HIDDEN') return acc;

        let catObj = acc.find(c => c.name === item.category);
        
        if (!catObj) {
          catObj = { 
            id: (item.category || "").toLowerCase().replace(/[^a-z0-eu]/g, '-'), 
            name: item.category || "Άλλο", 
            image: CAT_IMAGES[item.category] || CAT_IMAGES["Ορεκτικά"] || "", 
            items: [] 
          };
          acc.push(catObj);
        }
        
        let ings: string[] = [];
        try { ings = typeof item.ingredients === 'string' ? JSON.parse(item.ingredients) : (item.ingredients || []); } catch(e) {}

        const isUnavailable = item.status === 'UNAVAILABLE_TODAY' || item.status === 'UNAVAILABLE';

        catObj!.items.push({
          id: item.id.toString(),
          name: item.name,
          description: item.description_el || "",
          price: Number(item.price),
          price_individual: item.price_individual ? Number(item.price_individual) : null,
          ingredients: ings,
          status: item.status,
          sort_order: item.sort_order
        });
        return acc;
      }, []);

      const catOrder = ["Σαλάτες", "Ορεκτικά", "Σούπες", "Ζυμαρικά", "Risotto", "Χοιρινό", "Μοσχάρι", "Κοτόπουλο", "Αρνί - Κουνέλι", "Όλα με Κιμά", "Χωρίς Κρέας", "Όσπρια", "Ψάρια - Θαλασσινά", "Αναψυκτικά", "Μπύρες / Ποτά"];
      grouped.sort((a, b) => {
        let idxA = catOrder.indexOf(a.name);
        let idxB = catOrder.indexOf(b.name);
        return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
      });

      setCategories(grouped);
      if (grouped.length > 0 && grouped[0] && active === "") setActive(grouped[0].id);
      setLoading(false);
    }
    
    // Τραβάμε τα δεδομένα την πρώτη φορά
    fetchMenu();

    // Ανοίγουμε το κανάλι επικοινωνίας για Realtime αλλαγές
    const channel = supabase
      .channel('menu-updates')
      .on(
        'postgres_changes',
        {
          event: '*', // Ακούει για UPDATE, INSERT και DELETE
          schema: 'public',
          table: 'menu_items'
        },
        (payload) => {
          console.log('Realtime Update Received:', payload);
          fetchMenu(); // Ξανατρέχει η συνάρτηση αθόρυβα στο παρασκήνιο
        }
      )
      .subscribe();

    // Κλείνουμε το κανάλι όταν ο χρήστης φύγει από τη σελίδα
    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // Το `active` αφαιρέθηκε από τα dependencies για να μην κάνει περιττά ρέντερ

  useEffect(() => {
    if (categories.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-140px 0px -60% 0px" },
    );
    categories.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [categories]);

  useEffect(() => {
    pillsRef.current?.querySelector(`[data-cat="${active}"]`)?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [active]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 130, behavior: "smooth" });
  };

  if (loading) {
    return <div className="grid min-h-[60vh] place-items-center"><div className="text-xl font-bold text-primary animate-pulse">Φόρτωση Καταλόγου...</div></div>;
  }

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 pt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">ScanEat Menu</p>
        <h1 className="mt-2 text-4xl font-bold md:text-5xl">Το μενού μας</h1>
      </div>

      <div className="glass sticky top-16 z-30 mt-6 border-y border-border/60">
        <div ref={pillsRef} className="no-scrollbar mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3">
          {categories.map((c) => (
            <button
              key={c.id}
              data-cat={c.id}
              onClick={() => go(c.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${active === c.id ? "bg-ink text-ink-foreground" : "bg-card text-foreground"}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-10">
        {categories.map((c) => (
          <section key={c.id} id={c.id}>
            <div className="relative overflow-hidden rounded-2xl">
              <img src={c.image} alt={c.name} loading="lazy" width={1200} height={608} className="h-36 w-full object-cover md:h-48" />
              <div className="hero-overlay absolute inset-0" />
              <div className="absolute bottom-0 left-0 p-5">
                <h2 className="text-2xl font-bold text-ink-foreground md:text-3xl">{c.name}</h2>
                {c.note && <p className="mt-1 text-sm text-ink-foreground/80">{c.note}</p>}
              </div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {c.items.map((item) => {
                // Έλεγχος Διαθεσιμότητας
                    const isUnavailable = 
                      item.status === 'UNAVAILABLE_TODAY' || 
                      item.status === 'UNAVAILABLE' || 
                      item.status === 'HIDDEN'; // Πρόσθεσε εδώ τα statuses που χρησιμοποιεί το Admin Panel σου
                return (
                  <article key={item.id} className={`flex flex-col justify-between rounded-2xl border border-border bg-card p-5 ${isUnavailable ? 'opacity-60 grayscale-[50%]' : ''}`}>
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-bold">{item.name}</h3>
                        {isUnavailable && (
                          <span className="shrink-0 rounded-full bg-destructive/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-destructive">
                            Εξαντληθηκε
                          </span>
                        )}
                      </div>
                      {item.description && <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>}
                    </div>
                    
                    <div className="mt-5 flex flex-col gap-2">
                      {item.price_individual && (
                        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                          <span className="font-semibold text-sm">Ατομικό: {formatPrice(item.price_individual)}</span>
                          <motion.button
                            whileTap={!isUnavailable ? { scale: 0.92 } : {}}
                            disabled={isUnavailable}
                            onClick={() => !isUnavailable && setSelected({ ...item, price: item.price_individual!, name: item.name + " (Ατομικό)" })}
                            className="flex h-8 items-center gap-1 rounded-full bg-ink px-3 text-xs font-semibold text-ink-foreground hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-3 w-3" /> Προσθήκη
                          </motion.button>
                        </div>
                      )}
                      
                      <div className={`flex items-center justify-between ${item.price_individual ? 'rounded-lg bg-muted/50 px-3 py-2' : ''}`}>
                        <span className={`font-semibold ${item.price_individual ? 'text-sm' : 'text-lg'}`}>
                          {item.price_individual ? "Μερίδα:" : ""} {formatPrice(item.price)}
                        </span>
                        <motion.button
                          whileTap={!isUnavailable ? { scale: 0.92 } : {}}
                          disabled={isUnavailable}
                          onClick={() => !isUnavailable && setSelected({ ...item, name: item.name + (item.price_individual ? " (Μερίδα)" : "") })}
                          className={`flex items-center gap-1 rounded-full bg-primary text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${item.price_individual ? 'h-8 px-3 text-xs' : 'h-11 px-5 text-sm'}`}
                        >
                          <Plus className={item.price_individual ? "h-3 w-3" : "h-4 w-4"} /> Προσθήκη
                        </motion.button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <ItemModal item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
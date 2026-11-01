import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Plus, CookingPot } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ItemModal } from "@/components/ItemModal";
import { CAT_IMAGES, formatPrice, type MenuItem, type Category } from "@/lib/menu";
import { supabase } from "@/lib/supabase";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Κατάλογος & Online Παραγγελία | Όλα Κατσαρόλα Σέρρες" },
      { name: "description", content: "Ανακαλύψτε το μενού του Όλα Κατσαρόλα στις Σέρρες. Λαχταριστά μαγειρευτά, ψητά, θαλασσινά και ορεκτικά. Κάντε την online παραγγελία σας εύκολα και γρήγορα!" },
    ],
  }),
  component: MenuPage,
});

// Βοηθητική συνάρτηση για ΑΚΡΙΒΕΣ scroll
const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (!element) return;
  const headerOffset = 140; 
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth"
  });
};

function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const [active, setActive] = useState("");
  
  const pillsRef = useRef<HTMLDivElement>(null);
  const isClickScrolling = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hashHandled = useRef(false); // Κλειδώνει το αρχικό scroll από το URL

  // ΠΡΟΣΘΗΚΗ ΕΔΩ: Τραβάμε τα είδη που υπάρχουν στο καλάθι
  const { lines } = useCart();

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
            id: (item.category || "Άλλο").replace(/[\s/-]+/g, '-'),
            name: item.category || "Άλλο", 
            images: CAT_IMAGES[item.category] || ["https://placehold.co/1200x600/111/fff?text=No+Image"],
            items: [] 
          };
          acc.push(catObj);
        }
        
        let ings: string[] = [];
        try { ings = typeof item.ingredients === 'string' ? JSON.parse(item.ingredients) : (item.ingredients || []); } catch(e) {}

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
      setLoading(false);
    }
    
    fetchMenu();

    const channel = supabase.channel('menu-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, () => fetchMenu())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // ΛΥΣΗ ΓΙΑ ΤΟ HASH (Redirect από το Menu Preview): 
  // Εκτελείται ΜΟΝΟ όταν έχουν γεμίσει οι κατηγορίες (categories.length > 0)
  useEffect(() => {
    if (categories.length > 0 && !hashHandled.current) {
      if (!active) setActive(categories[0].id); // Ορισμός πρώτου active αν δεν υπάρχει hash

      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace('#', '');
        // Δίνουμε 100ms χρόνο στον Browser να κάνει render τα divs πριν προσπαθήσει να τα βρει
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) {
            isClickScrolling.current = true;
            setActive(id);
            scrollToSection(id);
            setTimeout(() => { isClickScrolling.current = false; }, 1000);
          }
        }, 100);
      }
      hashHandled.current = true; // Το κλειδώνουμε για να μην ξανατρέξει
    }
  }, [categories]);

  // Observer για το Scroll Tracking
  useEffect(() => {
    if (categories.length === 0) return;
    const visibleSections = new Set<string>();

    const obs = new IntersectionObserver((entries) => {
      if (isClickScrolling.current) return;
      
      entries.forEach((e) => {
        if (e.isIntersecting) visibleSections.add(e.target.id);
        else visibleSections.delete(e.target.id);
      });

      if (visibleSections.size > 0) {
        const firstVisible = categories.find(c => visibleSections.has(c.id));
        if (firstVisible && active !== firstVisible.id) {
          setActive(firstVisible.id);
        }
      }
    }, { rootMargin: "-150px 0px -50% 0px", threshold: 0.1 }); 
    
    categories.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) obs.observe(el);
    });
    
    return () => obs.disconnect();
  }, [categories, active]);

  // ΛΥΣΗ ΓΙΑ ΤΟ NAV BAR BUG:
  // Δεν κάνει scroll ασταμάτητα. Ελέγχει αν το κουμπί βγήκε εκτός οθόνης και ΜΟΝΟ τότε το φέρνει στο κέντρο.
  useEffect(() => {
    const container = pillsRef.current;
    const activePill = container?.querySelector(`[data-cat="${active}"]`) as HTMLElement;

    if (container && activePill) {
      const containerRect = container.getBoundingClientRect();
      const pillRect = activePill.getBoundingClientRect();

      const isOutOfView = pillRect.left < containerRect.left || pillRect.right > containerRect.right;

      if (isOutOfView) {
        activePill.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
      }
    }
  }, [active]);

  // Όταν ο χρήστης πατάει μια κατηγορία
  const go = (id: string) => {
    // Αν πατήσει γρήγορα 2-3 φορές, μηδενίζουμε το παλιό timeout για να μην μπερδευτεί το Observer
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    
    isClickScrolling.current = true;
    setActive(id);
    scrollToSection(id);
    
    // Αναγκάζουμε το pill να κεντράρει άμεσα στο κλικ
    pillsRef.current?.querySelector(`[data-cat="${id}"]`)?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });

    scrollTimeoutRef.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 1000); 
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

      <div className="glass sticky top-16 z-30 mt-6 border-y border-border/60 shadow-sm">
        <div ref={pillsRef} className="no-scrollbar mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3">
          {categories.map((c) => (
            <button
              key={c.id}
              data-cat={c.id}
              onClick={() => go(c.id)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all shadow-sm ${active === c.id ? "bg-ink text-ink-foreground scale-105" : "bg-card text-foreground hover:bg-muted"}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-10">
        {categories.map((c) => (
          <section key={c.id} id={c.id} className="scroll-mt-32">
            <div className="relative overflow-hidden rounded-2xl">
              <CategoryCarousel images={c.images} categoryName={c.name} />
              <div className="hero-overlay absolute inset-0 z-10" />
              <div className="absolute bottom-0 left-0 p-5 z-20">
                <h2 className="text-2xl font-bold text-ink-foreground md:text-3xl">{c.name}</h2>
              </div>
            </div>    
            
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {c.items.map((item) => {
                const isUnavailable = item.status === 'UNAVAILABLE_TODAY' || item.status === 'UNAVAILABLE' || item.status === 'HIDDEN';
                
                // ΝΕΟ: Υπολογισμός ποσότητας του συγκεκριμένου πιάτου στο καλάθι
                const itemQty = lines.filter((l) => l.itemId === item.id).reduce((sum, l) => sum + l.qty, 0);
                const hasItem = itemQty > 0;

                return (
                  <article 
                    key={item.id} 
                    // ΝΕΟ: Δυναμικό class για το μπορντό περίγραμμα (border-primary και ring)
                    className={`flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                      isUnavailable ? 'opacity-60 grayscale-[50%] border-border bg-card' : 
                      hasItem ? 'border-primary ring-1 ring-primary shadow-sm bg-primary/5' : 'border-border bg-card'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        
                        {/* ΝΕΟ: Τίτλος & Δυναμικές Κατσαρόλες */}
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold">{item.name}</h3>
                          {hasItem && (
                            <div className="flex items-center gap-0.5 text-primary">
                              {itemQty <= 5 ? (
                                Array.from({ length: itemQty }).map((_, i) => <CookingPot key={i} className="h-4 w-4" />)
                              ) : (
                                <span className="flex items-center gap-1 text-sm font-bold">
                                  {itemQty} <CookingPot className="h-4 w-4" />
                                </span>
                              )}
                            </div>
                          )}
                        </div>

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
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ItemModal } from "@/components/ItemModal";
import { categories, formatPrice, type MenuItem } from "@/lib/menu";

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
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const [active, setActive] = useState(categories[0]?.id ?? "");
  const pillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-140px 0px -60% 0px" },
    );
    categories.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    pillsRef.current?.querySelector(`[data-cat="${active}"]`)?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [active]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 130, behavior: "smooth" });
  };

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
              {c.items.map((item) => (
                <motion.article
                  key={item.id}
                  whileHover={{ y: -3 }}
                  className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5"
                >
                  <div>
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    {item.ingredients.length > 0 && (
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.ingredients.join(", ")}</p>
                    )}
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-lg font-semibold">{formatPrice(item.price)}</span>
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      onClick={() => setSelected(item)}
                      className="flex h-11 items-center gap-1 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
                    >
                      <Plus className="h-4 w-4" /> Προσθήκη
                    </motion.button>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <ItemModal item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

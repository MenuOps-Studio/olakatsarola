import { motion } from "framer-motion";
import { ArrowRight, UtensilsCrossed } from "lucide-react";
import { Link } from "@tanstack/react-router";

// Οι κατηγορίες χωρίς την ανάγκη για slug/hash
const CATEGORIES = [
  {
    title: "Ζυμαρικά",
    desc: "Αυθεντικές συνταγές ζυμαρικών με πλούσιες σάλτσες και ολόφρεσκα υλικά, μαγειρεμένα al dente.",
    price: "από 5.50€",
    img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Θαλασσινά",
    desc: "Φρέσκα θαλασσινά, μαγειρεμένα με μεράκι, που φέρνουν το άρωμα και τη φρεσκάδα της θάλασσας στο πιάτο σας.",
    price: "από 7.00€",
    img: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Risotto",
    desc: "Άψογα χυλωμένο ριζότο με εκλεκτά μανιτάρια, λαχανικά ή θαλασσινά, τέλεια δεμένο με παρμεζάνα.",
    price: "από 6.50€",
    img: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80&w=800",
  }
];

export function MenuPreview() {
  return (
    <section className="relative w-full overflow-hidden bg-ink pt-10 pb-16 md:pt-16 md:pb-32">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        
        {/* Επικεφαλίδα και Κουμπί Καταλόγου */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <UtensilsCrossed className="h-6 w-6 text-primary" />
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Το Μενού μας</span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              Εκλεκτές γεύσεις <br className="hidden md:block" /> για κάθε προτίμηση.
            </h2>
          </div>
          
          <Link
            to="/menu"
            className="group flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-bold text-ink transition-all hover:bg-primary hover:text-primary-foreground shadow-lg"
          >
            Δείτε όλο τον κατάλογο
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grid με τις 3 βασικές κατηγορίες */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {CATEGORIES.map((cat, index) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-white/5 backdrop-blur-sm shadow-xl ring-1 ring-white/10 transition-all hover:bg-white/10 hover:ring-white/20"
            >
              {/* Αφαιρέθηκε το hash={cat.slug} - Τώρα πάει πάντα απλά στο /menu */}
              <Link to="/menu" className="flex h-full w-full flex-col">
                <div className="relative h-64 w-full overflow-hidden shrink-0">
                  <img 
                    src={cat.img} 
                    alt={cat.title} 
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                  
                  {/* Ταμπελάκι τιμής */}
                  <div className="absolute bottom-5 left-5 rounded-full bg-white/95 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-ink shadow-lg">
                    {cat.price}
                  </div>
                </div>
                
                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-white">{cat.title}</h3>
                    <ArrowRight className="h-5 w-5 text-white/50 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <p className="text-sm leading-relaxed text-white/70">{cat.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
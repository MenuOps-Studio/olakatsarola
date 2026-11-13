import { motion } from "framer-motion";
import { ArrowRight, UtensilsCrossed } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

// Εισαγωγή των τοπικών φωτογραφιών από τον φάκελο src/assets/menu
import imgPasta from "@/assets/menu/image00025.jpeg";
import imgSeafood from "@/assets/menu/image00299.jpeg";
import imgRisotto from "@/assets/menu/image00042.jpeg";

export function MenuPreview() {
  const { lang } = useI18n();

  // Λεξικό για τα σταθερά κείμενα της ενότητας
  const t = {
    el: {
      subtitle: "Το Μενού μας",
      title: "Εκλεκτές γεύσεις",
      titleBr: "για κάθε προτίμηση.",
      btn: "Δείτε όλο τον κατάλογο"
    },
    en: {
      subtitle: "Our Menu",
      title: "Exquisite flavors",
      titleBr: "for every preference.",
      btn: "View full menu"
    },
    bg: {
      subtitle: "Нашето Меню",
      title: "Изискани вкусове",
      titleBr: "за всяко предпочитание.",
      btn: "Вижте цялото меню"
    }
  }[lang] || {
    subtitle: "Το Μενού μας",
    title: "Εκλεκτές γεύσεις",
    titleBr: "για κάθε προτίμηση.",
    btn: "Δείτε όλο τον κατάλογο"
  };

  // Οι κατηγορίες με υποστήριξη 3 γλωσσών
  const CATEGORIES = [
    {
      title: { el: "Ζυμαρικά", en: "Pasta", bg: "Паста" },
      desc: { 
        el: "Αυθεντικές συνταγές ζυμαρικών με πλούσιες σάλτσες και ολόφρεσκα υλικά, μαγειρεμένα al dente.",
        en: "Authentic pasta recipes with rich sauces and fresh ingredients, cooked al dente.",
        bg: "Автентични рецепти за паста с богати сосове и пресни съставки, приготвени al dente."
      },
      price: { el: "από 5.50€", en: "from 5.50€", bg: "от 5.50€" },
      img: imgPasta,
    },
    {
      title: { el: "Θαλασσινά", en: "Seafood", bg: "Морски дарове" },
      desc: {
        el: "Φρέσκα θαλασσινά, μαγειρεμένα με μεράκι, που φέρνουν το άρωμα και τη φρεσκάδα της θάλασσας στο πιάτο σας.",
        en: "Fresh seafood, cooked with passion, bringing the aroma and freshness of the sea to your plate.",
        bg: "Пресни морски дарове, приготвени със страст, носещи аромата и свежестта на морето във вашата чиния."
      },
      price: { el: "από 7.00€", en: "from 7.00€", bg: "от 7.00€" },
      img: imgSeafood,
    },
    {
      title: { el: "Risotto", en: "Risotto", bg: "Ризото" },
      desc: {
        el: "Άψογα χυλωμένο ριζότο με εκλεκτά μανιτάρια, λαχανικά ή θαλασσινά, τέλεια δεμένο με παρμεζάνα.",
        en: "Perfectly creamy risotto with premium mushrooms, vegetables or seafood, perfectly bound with parmesan.",
        bg: "Перфектно кремообразно ризото с първокласни гъби, зеленчуци или морски дарове, перфектно свързано с пармезан."
      },
      price: { el: "από 6.50€", en: "from 6.50€", bg: "от 6.50€" },
      img: imgRisotto,
    }
  ];

  return (
    <section className="relative w-full overflow-hidden bg-ink pt-10 pb-16 md:pt-16 md:pb-32">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        
        {/* Επικεφαλίδα και Κουμπί Καταλόγου */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <UtensilsCrossed className="h-6 w-6 text-primary" />
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">{t.subtitle}</span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              {t.title} <br className="hidden md:block" /> {t.titleBr}
            </h2>
          </div>
          
          <Link
            to="/menu"
            className="group flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-bold text-ink transition-all hover:bg-primary hover:text-primary-foreground shadow-lg"
          >
            {t.btn}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grid με τις 3 βασικές κατηγορίες */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {CATEGORIES.map((cat, index) => {
            // Επιλογή σωστής γλώσσας (αν δεν βρει το lang, γυρνάει στα Ελληνικά 'el')
            const currentTitle = cat.title[lang as keyof typeof cat.title] || cat.title.el;
            const currentDesc = cat.desc[lang as keyof typeof cat.desc] || cat.desc.el;
            const currentPrice = cat.price[lang as keyof typeof cat.price] || cat.price.el;

            return (
              <motion.div
                key={index} // Χρήση index αντί για title για ασφάλεια στα keys
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-white/5 backdrop-blur-sm shadow-xl ring-1 ring-white/10 transition-all hover:bg-white/10 hover:ring-white/20"
              >
                <Link to="/menu" className="flex h-full w-full flex-col">
                  <div className="relative h-64 w-full overflow-hidden shrink-0">
                    <img 
                      src={cat.img} 
                      alt={currentTitle} 
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                    
                    {/* Ταμπελάκι τιμής */}
                    <div className="absolute bottom-5 left-5 rounded-full bg-white/95 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-ink shadow-lg">
                      {currentPrice}
                    </div>
                  </div>
                  
                  <div className="flex flex-1 flex-col p-6 md:p-8">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-bold text-white">{currentTitle}</h3>
                      <ArrowRight className="h-5 w-5 text-white/50 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                    <p className="text-sm leading-relaxed text-white/70">{currentDesc}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
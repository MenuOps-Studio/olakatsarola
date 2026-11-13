import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/lib/cart";
import logo from "@/assets/logo.png";
import { useI18n } from "@/lib/i18n"; 

export function SiteHeader() {
  const { count, setOpen } = useCart();
  const [mobile, setMobile] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const { lang, setLang } = useI18n(); 

  const t = {
    el: { home: "Αρχική", menu: "Μενού", gallery: "Γκαλερί", contact: "Επικοινωνία" },
    en: { home: "Home", menu: "Menu", gallery: "Gallery", contact: "Contact" },
    bg: { home: "Начало", menu: "Меню", gallery: "Галерия", contact: "Контакти" }
  }[lang] || { home: "Αρχική", menu: "Μενού", gallery: "Γκαλερί", contact: "Επικοινωνία" };

  const links = [
    { to: "/", label: t.home, title: "Αρχική Σελίδα Όλα Κατσαρόλα" },
    { to: "/menu", label: t.menu, title: "Κατάλογος & Delivery Μενού" },
    { to: "/gallery", label: t.gallery, title: "Φωτογραφίες Εστιατορίου" },
    { to: "/contact", label: t.contact, title: "Στοιχεία Επικοινωνίας & Τοποθεσία" },
  ] as const;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (mobile && headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setMobile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [mobile]);

  return (
    <header ref={headerRef} className="glass sticky top-0 z-40 border-b border-border/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        
        <Link 
          to="/" 
          title="Όλα Κατσαρόλα Αρχική"
          aria-label="Μετάβαση στην αρχική σελίδα του εστιατορίου Όλα Κατσαρόλα"
          className="flex items-center"
        >
          <img src={logo} alt="Όλα Κατσαρόλα Λογότυπο" className="h-20 w-auto object-contain" />
        </Link>
        
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link 
              key={l.to} 
              to={l.to} 
              activeOptions={{ exact: true }} 
              title={l.title}
              aria-label={l.title}
              className="text-sm font-bold text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex items-center gap-1.5 rounded-full border border-border/50 bg-background/50 px-1.5 py-1 backdrop-blur-md">
            <button aria-label="Ελληνικά" title="Αλλαγή γλώσσας σε Ελληνικά" onClick={() => setLang('el')} className={`flex h-6 w-6 items-center justify-center rounded-full overflow-hidden transition-all ${lang === 'el' ? 'ring-2 ring-primary scale-110' : 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100'}`}>
              <img src="https://flagcdn.com/gr.svg" alt="Greek Flag" className="h-full w-full object-cover" />
            </button>
            <button aria-label="English" title="Switch language to English" onClick={() => setLang('en')} className={`flex h-6 w-6 items-center justify-center rounded-full overflow-hidden transition-all ${lang === 'en' ? 'ring-2 ring-primary scale-110' : 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100'}`}>
              <img src="https://flagcdn.com/gb.svg" alt="British Flag" className="h-full w-full object-cover" />
            </button>
            <button aria-label="Български" title="Превключване на езика на Български" onClick={() => setLang('bg')} className={`flex h-6 w-6 items-center justify-center rounded-full overflow-hidden transition-all ${lang === 'bg' ? 'ring-2 ring-primary scale-110' : 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100'}`}>
              <img src="https://flagcdn.com/bg.svg" alt="Bulgarian Flag" className="h-full w-full object-cover" />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <motion.button 
              whileTap={{ scale: 0.92 }} 
              onClick={() => setOpen(true)} 
              title="Άνοιγμα Καλαθιού"
              aria-label={`Άνοιγμα Καλαθιού (${count} αντικείμενα)`}
              className="relative flex h-11 w-11 items-center justify-center rounded-full bg-ink text-ink-foreground hover:bg-primary transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground border-2 border-cream">
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            <button 
              className="flex h-11 w-11 items-center justify-center md:hidden" 
              onClick={() => setMobile((v) => !v)}
              aria-label="Μενού πλοήγησης"
            >
              {mobile ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {mobile && (
          <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-border/60 md:hidden bg-background">
            <div className="flex flex-col px-4 py-3">
              {links.map((l) => (
                <Link 
                  key={l.to} 
                  to={l.to} 
                  activeOptions={{ exact: true }} 
                  onClick={() => setMobile(false)} 
                  title={l.title}
                  aria-label={l.title}
                  className="py-3 font-display text-2xl font-bold data-[status=active]:text-primary"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
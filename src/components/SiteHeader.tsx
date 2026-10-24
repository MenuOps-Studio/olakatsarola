import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/lib/cart";
import logo from "@/assets/logo.png";

const links = [
  { to: "/", label: "Αρχική" },
  //{ to: "/menu", label: "Μενού" },
 // { to: "/contact", label: "Επικοινωνία" },
] as const;

export function SiteHeader() {
  const { count, setOpen } = useCart();
  const [mobile, setMobile] = useState(false);
  
  // Αναφορά (ref) για να ξέρουμε ποια είναι η περιοχή του Header
  const headerRef = useRef<HTMLElement>(null);

  // Κλείσιμο του μενού όταν γίνεται κλικ έξω από το Header
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (mobile && headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setMobile(false);
      }
    };

    // Ακούμε για κλικ (ποντίκι) και αγγίγματα (κινητό)
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
        {/* Λογότυπο */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Όλα Κατσαρόλα" className="h-20 w-auto object-contain" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              className="text-sm font-bold text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setOpen(true)}
            aria-label="ScanEat καλάθι"
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-ink text-ink-foreground hover:bg-primary transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground border-2 border-cream"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          <button
            className="flex h-11 w-11 items-center justify-center md:hidden"
            aria-label="Μενού πλοήγησης"
            onClick={() => setMobile((v) => !v)}
          >
            {mobile ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobile && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/60 md:hidden bg-background"
          >
            <div className="flex flex-col px-4 py-3">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  activeOptions={{ exact: true }}
                  onClick={() => setMobile(false)}
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
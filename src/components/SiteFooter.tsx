import { Link } from "@tanstack/react-router";
import { Facebook, Instagram } from "lucide-react";
import logo from "@/assets/logo.png";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { lang } = useI18n();

  const t = {
    el: {
      desc1: "Παραδοσιακό Μαγειρείο Σερρών", desc2: "Εθνικής Αντίστασης 33, Σέρρες 621 22", desc3: "Τηλ: 2321 054111",
      nav: "Πλοήγηση", home: "Αρχική", menu: "Μενού", gallery: "Γκαλερί", contact: "Επικοινωνία", follow: "Ακολουθήστε μας"
    },
    en: {
      desc1: "Traditional Eatery in Serres", desc2: "Ethnikis Antistasis 33, Serres 621 22", desc3: "Tel: +30 2321 054111",
      nav: "Navigation", home: "Home", menu: "Menu", gallery: "Gallery", contact: "Contact", follow: "Follow us"
    },
    bg: {
      desc1: "Традиционен Ресторант в Серес", desc2: "Етникис Антистасис 33, Серес 621 22", desc3: "Тел: +30 2321 054111",
      nav: "Навигация", home: "Начало", menu: "Меню", gallery: "Галерия", contact: "Контакти", follow: "Следвайте ни"
    }
  }[lang] || {
    desc1: "Παραδοσιακό Μαγειρείο Σερρών", desc2: "Εθνικής Αντίστασης 33, Σέρρες 621 22", desc3: "Τηλ: 2321 054111",
    nav: "Πλοήγηση", home: "Αρχική", menu: "Μενού", gallery: "Γκαλερί", contact: "Επικοινωνία", follow: "Ακολουθήστε μας"
  };

  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <img src={logo} alt="Όλα Κατσαρόλα Λογότυπο" className="h-24 w-auto opacity-90 brightness-0 invert" />
          <p className="mt-4 max-w-xs text-sm opacity-80">
            {t.desc1}<br/>{t.desc2}<br/>{t.desc3}
          </p>
        </div>
        <nav className="flex flex-col gap-2 text-sm">
          <p className="mb-1 text-xs uppercase tracking-widest opacity-50 font-bold">{t.nav}</p>
          <Link to="/" title="Αρχική Σελίδα" aria-label="Μετάβαση στην Αρχική Σελίδα" className="opacity-80 hover:opacity-100 hover:text-primary transition-colors">{t.home}</Link> 
          <Link to="/menu" title="Δείτε το Μενού μας" aria-label="Μετάβαση στο Μενού" className="opacity-80 hover:opacity-100 hover:text-primary transition-colors">{t.menu}</Link>
          <Link to="/gallery" title="Φωτογραφίες Εστιατορίου" aria-label="Μετάβαση στην Γκαλερί" className="opacity-80 hover:opacity-100 hover:text-primary transition-colors">{t.gallery}</Link>
          <Link to="/contact" title="Στοιχεία Επικοινωνίας" aria-label="Μετάβαση στην Επικοινωνία" className="opacity-80 hover:opacity-100 hover:text-primary transition-colors">{t.contact}</Link>
        </nav>
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest opacity-50 font-bold">{t.follow}</p>
          <div className="flex gap-3">
            <a 
              href="https://www.facebook.com/olakatsarola2019?locale=el_GR" 
              target="_blank" 
              rel="noreferrer" 
              title="Επισκεφθείτε τη σελίδα μας στο Facebook"
              aria-label="Facebook Σελίδα Όλα Κατσαρόλα"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-foreground/20 transition-colors hover:bg-primary hover:border-primary"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a 
              href="https://www.instagram.com/ola_katsarola/" 
              target="_blank" 
              rel="noreferrer" 
              title="Επισκεφθείτε τη σελίδα μας στο Instagram"
              aria-label="Instagram Σελίδα Όλα Κατσαρόλα"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-foreground/20 transition-colors hover:bg-primary hover:border-primary"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-ink-foreground/10 py-5 text-center text-xs opacity-60">
        © {new Date().getFullYear()} ΟΛΑ ΚΑΤΣΑΡΟΛΑ · Powered by ScanEat | WebDiiz
      </div>
    </footer>
  );
}
import { Link } from "@tanstack/react-router";
import { Facebook, Instagram } from "lucide-react";
import logo from "@/assets/logo.png";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { lang } = useI18n();

  const t = {
    el: {
      desc1: "Το μαγειρείο των Σερρών", desc2: "Εθνικής Αντίστασης 33, Σέρρες 621 22", desc3: "Τηλ: 2321 054111",
      nav: "Πλοήγηση", home: "Αρχική", menu: "Μενού", contact: "Επικοινωνία", follow: "Ακολουθήστε μας"
    },
    en: {
      desc1: "The traditional eatery of Serres", desc2: "Ethnikis Antistasis 33, Serres 621 22", desc3: "Tel: +30 2321 054111",
      nav: "Navigation", home: "Home", menu: "Menu", contact: "Contact", follow: "Follow us"
    },
    bg: {
      desc1: "Традиционната закусвалня на Серес", desc2: "Етникис Антистасис 33, Серес 621 22", desc3: "Тел: +30 2321 054111",
      nav: "Навигация", home: "Начало", menu: "Меню", contact: "Контакти", follow: "Следвайте ни"
    }
  }[lang] || {
    desc1: "Το μαγειρείο των Σερρών", desc2: "Εθνικής Αντίστασης 33, Σέρρες 621 22", desc3: "Τηλ: 2321 054111",
    nav: "Πλοήγηση", home: "Αρχική", menu: "Μενού", contact: "Επικοινωνία", follow: "Ακολουθήστε μας"
  };

  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <img src={logo} alt="Όλα Κατσαρόλα" className="h-25 w-auto opacity-90 brightness-0 invert" />
          <p className="mt-4 max-w-xs text-sm opacity-80">
            {t.desc1}<br/>{t.desc2}<br/>{t.desc3}
          </p>
        </div>
        <nav className="flex flex-col gap-2 text-sm">
          <p className="mb-1 text-xs uppercase tracking-widest opacity-50 font-bold">{t.nav}</p>
          <Link to="/" className="opacity-80 hover:opacity-100 hover:text-primary transition-colors">{t.home}</Link> 
          <Link to="/menu" className="opacity-80 hover:opacity-100 hover:text-primary transition-colors">{t.menu}</Link>
          <Link to="/contact" className="opacity-80 hover:opacity-100 hover:text-primary transition-colors">{t.contact}</Link>
        </nav>
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest opacity-50 font-bold">{t.follow}</p>
          <div className="flex gap-3">
            <a href="https://www.facebook.com/olakatsarola2019?locale=el_GR" target="_blank" rel="noreferrer" className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-foreground/20 transition-colors hover:bg-primary hover:border-primary">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://www.instagram.com/ola_katsarola/" target="_blank" rel="noreferrer" className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-foreground/20 transition-colors hover:bg-primary hover:border-primary">
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
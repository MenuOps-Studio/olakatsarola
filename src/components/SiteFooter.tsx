import { Link } from "@tanstack/react-router";
import { Facebook, Instagram } from "lucide-react";
import logo from "@/assets/logo.png";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          {/* Αφαιρέθηκε το brightness-0 και προστέθηκε το mix-blend-screen */}
          <img src={logo} alt="Όλα Κατσαρόλα" className="h-16 w-auto opacity-90 brightness-0 invert" />
          <p className="mt-4 max-w-xs text-sm opacity-80">
            Ελληνικό μαγειρείο<br/>
            Εθνικής Αντίστασης 33, Σέρρες 621 22<br/>
            Τηλ: 2321 054111
          </p>
        </div>
        <nav className="flex flex-col gap-2 text-sm">
          <p className="mb-1 text-xs uppercase tracking-widest opacity-50 font-bold">Πλοήγηση</p>
          <Link to="/" className="opacity-80 hover:opacity-100 hover:text-primary transition-colors">Αρχική</Link>
          <Link to="/menu" className="opacity-80 hover:opacity-100 hover:text-primary transition-colors">Μενού</Link>
          <Link to="/contact" className="opacity-80 hover:opacity-100 hover:text-primary transition-colors">Επικοινωνία</Link>
        </nav>
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest opacity-50 font-bold">Ακολουθήστε μας</p>
          <div className="flex gap-3">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-foreground/20 transition-colors hover:bg-primary hover:border-primary">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-foreground/20 transition-colors hover:bg-primary hover:border-primary">
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
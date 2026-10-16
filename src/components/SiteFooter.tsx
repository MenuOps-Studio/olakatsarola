import { Link } from "@tanstack/react-router";
import { Facebook, Instagram } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-bold">
            ΟΛΑ <span className="text-primary">ΚΑΤΣΑΡΟΛΑ</span>
          </p>
          <p className="mt-3 max-w-xs text-sm opacity-70">Ελληνικό μαγειρείο · Εθνικής Αντίστασης 33, Σέρρες</p>
        </div>
        <nav className="flex flex-col gap-2 text-sm">
          <p className="mb-1 text-xs uppercase tracking-widest opacity-50">Πλοήγηση</p>
          <Link to="/" className="opacity-80 hover:opacity-100">Αρχική</Link>
          <Link to="/menu" className="opacity-80 hover:opacity-100">Μενού</Link>
          <Link to="/contact" className="opacity-80 hover:opacity-100">Επικοινωνία</Link>
        </nav>
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest opacity-50">Ακολουθήστε μας</p>
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

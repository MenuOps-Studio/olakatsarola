import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts, type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider, useCart } from "@/lib/cart";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CartDrawer } from "@/components/CartDrawer";
import { Toaster } from "@/components/ui/sonner";
import { LiveTracker } from "@/components/LiveTracker";
import { I18nProvider, useI18n } from "@/lib/i18n"; 

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Η σελίδα δεν βρέθηκε</h2>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90">
            Επιστροφή στην Αρχική
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Κάτι πήγε στραβά</h1>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90">
            Δοκιμή ξανά
          </button>
        </div>
      </div>
    </div>
  );
}

function RootShell({ children }: { children: ReactNode }) {
  // To Απόλυτο Local SEO Schema (JSON-LD)
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Όλα Κατσαρόλα | Μαγειρευτά στις Σέρρες",
    "image": "https://olakatsarola.gr/og-image.jpg", 
    "description": "Το καλύτερο μαγειρείο στις Σέρρες. Παραδοσιακά Ελληνικά μαγειρευτά, ψητά και φρέσκα θαλασσινά, διαθέσιμα για dine-in, πακέτο και online παραγγελία (delivery).",
    "@id": "https://olakatsarola.gr",
    "url": "https://olakatsarola.gr",
    "telephone": "+30 2321 054111",
    "priceRange": "€€",
    "servesCuisine": ["Ελληνική Κουζίνα", "Μαγειρευτά", "Μεσογειακή"],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Εθνικής Αντίστασης 33",
      "addressLocality": "Σέρρες",
      "postalCode": "621 22",
      "addressCountry": "GR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 41.085,
      "longitude": 23.548
    },
    "openingHoursSpecification": [
      { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], "opens": "11:00", "closes": "17:00" }
    ],
    "sameAs": [
      "https://www.facebook.com/olakatsarola2019?locale=el_GR",
      "https://www.instagram.com/ola_katsarola/"
    ],
    "hasMenu": {
      "@type": "Menu",
      "url": "https://olakatsarola.gr/menu"
    }
  };

  return (
    <html lang="el">
      <head>
        <HeadContent />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  const cart = useCart() as any; 
  const isCartOpen = cart.open || cart.isOpen; 

  return (
    <AnimatePresence>
      {!isCartOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-4 left-4 z-[90] flex gap-1 rounded-[1.25rem] border border-border/50 bg-background/90 p-1.5 shadow-lg backdrop-blur-md sm:bottom-6 sm:left-6"
        >
          <button 
            aria-label="Ελληνικά" 
            onClick={() => setLang('el')} 
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${lang === 'el' ? 'bg-primary shadow-sm scale-110' : 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100 hover:bg-muted'}`}
          >
            <img src="https://flagcdn.com/gr.svg" alt="GR" className="h-5 w-5 rounded-[2px] object-cover" />
          </button>
          <button 
            aria-label="English" 
            onClick={() => setLang('en')} 
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${lang === 'en' ? 'bg-primary shadow-sm scale-110' : 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100 hover:bg-muted'}`}
          >
            <img src="https://flagcdn.com/gb.svg" alt="GB" className="h-5 w-5 rounded-[2px] object-cover" />
          </button>
          <button 
            aria-label="Български" 
            onClick={() => setLang('bg')} 
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${lang === 'bg' ? 'bg-primary shadow-sm scale-110' : 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100 hover:bg-muted'}`}
          >
            <img src="https://flagcdn.com/bg.svg" alt="BG" className="h-5 w-5 rounded-[2px] object-cover" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1"><Outlet /></main>
            <SiteFooter />
          </div>
          <CartDrawer />
          <LiveTracker />
          <Toaster position="top-center" />
        </CartProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" }, 
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0" },
      { title: "Όλα Κατσαρόλα | Μαγειρευτό Φαγητό Delivery Σέρρες" },
      { name: "description", content: "Παραδοσιακό Ελληνικό μαγειρείο στις Σέρρες. Απολαύστε σπιτικά μαγειρευτά, ολόφρεσκα θαλασσινά και ψητά στο χώρο μας, take-away ή με delivery." },
      { name: "keywords", content: "μαγειρευτα σερρες, φαγητο σερρες, εστιατοριο σερρες, delivery φαγητου σερρες, ολα κατσαρολα, σουπες σερρες, ola katsarola serres" },
      // Open Graph για Social Media (Facebook, Viber)
      { property: "og:title", content: "Όλα Κατσαρόλα | Μαγειρευτό Φαγητό Delivery Σέρρες" },
      { property: "og:description", content: "Παραδοσιακό Ελληνικό μαγειρείο στις Σέρρες. Απολαύστε σπιτικά μαγειρευτά με delivery στην πόρτα σας." },
      { property: "og:type", content: "restaurant" },
      { property: "og:url", content: "https://olakatsarola.gr" },
      // To og:image το προσθέτεις αργότερα αν θες.
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" }, { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Commissioner:wght@400;500;600;700&family=Noto+Serif+Display:wght@500;700&display=swap" },
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: "https://olakatsarola.gr" }
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});
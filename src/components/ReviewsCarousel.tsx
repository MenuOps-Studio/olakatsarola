import { motion } from "framer-motion";
import { Star } from "lucide-react";

// Βάλε εδώ τις κορυφαίες πραγματικές κριτικές από το Google Maps σας
const REVIEWS = [
  { id: 1, name: "Panos S.", text: "Τέλεια μαγειρευτά, πολύ ωραίος χώρος και ευχάριστο προσωπικό." },
  { id: 2, name: "Eleni Bitziou", text: "Παραγγέλνουμε πολύ συχνά! Μεγάλες μερίδες, πεντανόστιμο φαγητό!👌" },
  { id: 3, name: "Giannis Savvas", text: "Ένα από τα καλύτερα εστιατόρια της πόλης των Σερρών με πεντανόστιμα μαγειρευτά φαγητά και όχι μόνο με φιλικό περιβάλλον και άψογη εξυπηρέτηση απ'ολο τό προσωπικό και πάντα με το χαμόγελο" },
  { id: 4, name: "ΣΤΕΛΛΑ ΤΣΟΥΤΣΑ", text: "Εξαιρετική ποιότητα τρομερές γεύσεις!! Ο μουσακάς vegeterian είναι ότι πιο νόστιμο έχουμε φάει!!! Όλα καταπληκτικά" },
  { id: 5, name: "Sofia Ververi", text: "Πολύ πολύ νόστιμο φαγητό (ειδικά τα ρεβίθια με μελιτζάνες), εξυπηρετικό το προσωπικό και καθαρός χώρος." },
  { id: 6, name: "Θεόδωρος Κούτλας", text: "Πάρα πολύ νόστιμο φαγητό , μεγάλη ποικιλία , εξυπηρέτηση άψογη και πολύ καλές τιμές !" },
];

export function ReviewsCarousel() {
  // Διπλασιάζουμε τον πίνακα για να πετύχουμε το εφέ του ατέρμονου loop (infinite scroll)
  const duplicatedReviews = [...REVIEWS, ...REVIEWS];

  return (
    <section className="py-16 md:py-24 overflow-hidden bg-background">
      <div className="mx-auto max-w-6xl px-4 text-center mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Google Reviews</p>
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">Τι λένε για εμάς</h2>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Ντεγκραντέ σκιές δεξιά-αριστερά για πιο ομαλό σβήσιμο */}
        <div className="absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />

        <motion.div
          className="flex w-max gap-6 px-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            ease: "linear",
            duration: 35, // Όσο μεγαλύτερο, τόσο πιο αργό το animation
            repeat: Infinity,
          }}
        >
          {duplicatedReviews.map((review, idx) => (
            <div
              key={`${review.id}-${idx}`}
              className="flex flex-col w-[320px] md:w-[400px] shrink-0 rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex text-primary mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-foreground/90 font-medium leading-relaxed mb-6">
                "{review.text}"
              </p>
              {/* Το mt-auto σπρώχνει το όνομα στο τέρμα κάτω μέρος της κάρτας */}
              <p className="mt-auto text-sm font-bold text-muted-foreground uppercase">
                — {review.name}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
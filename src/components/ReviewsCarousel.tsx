import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const GOOGLE_REVIEW_LINK = "https://www.google.com/search?sca_esv=1d561ae65d03ae5d&sxsrf=AKL5yDig17DP-RoNvPN6g5iv3O6CFF9d_g:1794531425512&q=%CE%BF%CE%BB%CE%B1+%CE%BA%CE%B1%CF%84%CF%83%CE%B1%CF%81%CE%BF%CE%BB%CE%B1&si=AE1YtOqiKPb2pdLXAi8quZ9vbH4aVq_aX8-3H9iFBLpRNK95c8WmFWxcTgtE3w8fpCeM_apdls4j8TLH88Gy8xV4FcbyZtPW7BoiO4V_XWXFaZryWz9LDm0%3D&uds=AE2AFgYS-PrrP9togVIC8vPs1lwpkY4rv3tOpNBvxKhP0HKOOyi6r899UI3WtzIA7Weyt3WQFG8_RI9r2FGWnQg6GaZY7qXgMT04L2LdmhGqbBIII6N-_ni_Pt1-tnV2piRWHXkNwIie&sa=X&sqi=2&ved=2ahUKEwihqZ_B3oOYAxVA9LsIHdFEO40Q3PALegQINhAE&biw=1536&bih=695&dpr=1.25";

export function ReviewsCarousel() {
  const { lang } = useI18n();

  // Απλό και καθαρό CTA
  const t = {
    el: { subtitle: "Google Reviews", title: "Τι λένε για εμάς", ctaMsg: "Τι λέτε εσείς για εμάς;", ctaBtn: "Αξιολόγηση στο Google" },
    en: { subtitle: "Google Reviews", title: "What people say about us", ctaMsg: "What do you say about us?", ctaBtn: "Review us on Google" },
    bg: { subtitle: "Google Reviews", title: "Какво казват за нас", ctaMsg: "Какво ще кажете за нас?", ctaBtn: "Оценете ни в Google" }
  }[lang] || { subtitle: "Google Reviews", title: "Τι λένε για εμάς", ctaMsg: "Τι λέτε εσείς για εμάς;", ctaBtn: "Αξιολόγηση στο Google" };

  const REVIEWS = [
    { 
      id: 1, 
      name: "Panos S.", 
      text: {
        el: "Τέλεια μαγειρευτά, πολύ ωραίος χώρος και ευχάριστο προσωπικό.",
        en: "Perfect cooked meals, very nice space and pleasant staff.",
        bg: "Перфектно сготвени ястия, много хубаво пространство и приятен персонал."
      }
    },
    { 
      id: 2, 
      name: "Eleni Bitziou", 
      text: {
        el: "Παραγγέλνουμε πολύ συχνά! Μεγάλες μερίδες, πεντανόστιμο φαγητό!👌",
        en: "We order very often! Large portions, delicious food!👌",
        bg: "Поръчваме много често! Големи порции, много вкусна храна!👌"
      }
    },
    { 
      id: 3, 
      name: "Giannis Savvas", 
      text: {
        el: "Ένα από τα καλύτερα εστιατόρια της πόλης των Σερρών με πεντανόστιμα μαγειρευτά φαγητά και όχι μόνο με φιλικό περιβάλλον και άψογη εξυπηρέτηση απ'ολο τό προσωπικό και πάντα με το χαμόγελο",
        en: "One of the best restaurants in the city of Serres with delicious cooked food and not only, with a friendly environment and flawless service from all the staff and always with a smile.",
        bg: "Един от най-добрите ресторанти в град Серес с вкусна готвена храна и не само, с приятелска среда и безупречно обслужване от целия персонал и винаги с усмивка."
      }
    },
    { 
      id: 4, 
      name: "ΣΤΕΛΛΑ ΤΣΟΥΤΣΑ", 
      text: {
        el: "Εξαιρετική ποιότητα τρομερές γεύσεις!! Ο μουσακάς vegeterian είναι ότι πιο νόστιμο έχουμε φάει!!! Όλα καταπληκτικά",
        en: "Excellent quality, awesome flavors!! The vegetarian moussaka is the most delicious thing we have ever eaten!!! Everything is amazing.",
        bg: "Отлично качество, страхотни вкусове!! Вегетарианската мусака е най-вкусното нещо, което някога сме яли!!! Всичко е невероятно."
      }
    },
    { 
      id: 5, 
      name: "Sofia Ververi", 
      text: {
        el: "Πολύ πολύ νόστιμο φαγητό (ειδικά τα ρεβίθια με μελιτζάνες), εξυπηρετικό το προσωπικό και καθαρός χώρος.",
        en: "Very very tasty food (especially the chickpeas with eggplants), helpful staff and clean space.",
        bg: "Много много вкусна храна (особено нахута с патладжани), отзивчив персонал и чисто пространство."
      }
    },
    { 
      id: 6, 
      name: "Θεόδωρος Κούτλας", 
      text: {
        el: "Πάρα πολύ νόστιμο φαγητό , μεγάλη ποικιλία , εξυπηρέτηση άψογη και πολύ καλές τιμές !",
        en: "Very delicious food, great variety, flawless service and very good prices!",
        bg: "Много вкусна храна, голямо разнообразие, безупречно обслужване и много добри цени!"
      }
    },
  ];

  const duplicatedReviews = [...REVIEWS, ...REVIEWS];

  return (
    <section className="py-16 md:py-24 overflow-hidden bg-background">
      <div className="mx-auto max-w-6xl px-4 text-center mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{t.subtitle}</p>
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">{t.title}</h2>
        
        <div className="mt-5 flex flex-col items-center justify-center gap-3">
          <p className="text-sm font-medium text-muted-foreground">{t.ctaMsg}</p>
          <a 
            href={GOOGLE_REVIEW_LINK} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-bold text-white shadow-soft transition-transform hover:scale-105"
          >
            {t.ctaBtn}
          </a>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />

        <motion.div
          className="flex w-max gap-6 px-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 35, repeat: Infinity }}
        >
          {duplicatedReviews.map((review, idx) => {
            const currentText = review.text[lang as keyof typeof review.text] || review.text.el;
            return (
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
                  "{currentText}"
                </p>
                <p className="mt-auto text-sm font-bold text-muted-foreground uppercase">
                  — {review.name}
                </p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
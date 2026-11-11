import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatedGallery } from "@/components/AnimatedGallery";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { MenuPreview } from "@/components/MenuPreview";
import { ReviewsCarousel } from "@/components/ReviewsCarousel";
import { useI18n } from "@/lib/i18n"; 

function Home() {
  const { lang } = useI18n();

  const t = {
    el: {
      heroSub: "Το μαγειρείο των Σερρών",
      heroTitle: "Ελληνική κουζίνα με πλούσιες γεύσεις και μενού που προσαρμόζονται στις προσωπικές σας προτιμήσεις.",
      btn: "Παραγγείλετε Τώρα",
      histSub: "Η ιστορία μας",
      histTitle: "Μαγειρεμένο αργά, όπως παλιά.",
      histDesc: "Στην κατσαρόλα μας σιγοβράζουν συνταγές που περνούν από γενιά σε γενιά. Διαλέγουμε κάθε πρωί φρέσκα υλικά από τοπικούς παραγωγούς, ελαιόλαδο, μυρωδικά και κρέατα της περιοχής."
    },
    en: {
      heroSub: "The traditional eatery of Serres",
      heroTitle: "Greek cuisine with rich flavors and menus tailored to your personal preferences.",
      btn: "Order Now",
      histSub: "Our history",
      histTitle: "Slow-cooked, just like the old days.",
      histDesc: "In our pot simmer recipes passed down from generation to generation. Every morning we select fresh ingredients from local producers, olive oil, herbs, and local meats."
    },
    bg: {
      heroSub: "Традиционната закусвалня на Серес",
      heroTitle: "Гръцка кухня с богати вкусове и менюта, съобразени с вашите лични предпочитания.",
      btn: "Поръчай сега",
      histSub: "Нашата история",
      histTitle: "Готвено бавно, както в миналото.",
      histDesc: "В нашата тенджера къкрят рецепти, предавани от поколение на поколение. Всяка сутрин избираме пресни съставки от местни производители, зехтин, билки и местни меса."
    }
  }[lang] || {
    heroSub: "Το μαγειρείο των Σερρών",
    heroTitle: "Ελληνική κουζίνα με πλούσιες γεύσεις και μενού.",
    btn: "Παραγγείλετε Τώρα",
    histSub: "Η ιστορία μας",
    histTitle: "Μαγειρεμένο αργά, όπως παλιά.",
    histDesc: "Στην κατσαρόλα μας σιγοβράζουν συνταγές που περνούν από γενιά σε γενιά."
  };

  const fade = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.6 },
  };

  return (
    <>
      <section className="relative isolate flex min-h-[88vh] items-end overflow-hidden">
        <img src={hero} alt="Παραδοσιακά ελληνικά φαγητά σε πήλινα σκεύη" width={1600} height={1008} className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="hero-overlay absolute inset-0 -z-10" />
        <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-32 md:pb-24">
          <motion.p {...fade} className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-ink-foreground/80">
            {t.heroSub}
          </motion.p>
          <motion.h1 {...fade} className="max-w-3xl text-4xl font-bold leading-[1.1] text-ink-foreground md:text-6xl">
            {t.heroTitle}
          </motion.h1>
          <motion.div {...fade} className="mt-8">
            <Link to="/menu">
              <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-flex h-14 items-center gap-2 rounded-full bg-primary px-8 font-semibold text-primary-foreground shadow-soft">
                {t.btn} <ArrowRight className="h-5 w-5" />
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-2 md:items-center md:py-28">
        <motion.div {...fade}>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{t.histSub}</p>
          <h2 className="mt-4 text-3xl font-bold md:text-5xl">{t.histTitle}</h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {t.histDesc}
          </p>
        </motion.div>
        <AnimatedGallery />
      </section>
      <MenuPreview />
      <ReviewsCarousel />
    </>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Όλα Κατσαρόλα | Το Καλύτερο Μαγειρευτό Φαγητό στις Σέρρες" },
      { name: "description", content: "Καθημερινά φρέσκα μαγειρευτά, ψητά της ώρας και δροσερές σαλάτες." },
    ],
  }),
  component: Home,
});
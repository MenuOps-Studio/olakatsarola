import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatedGallery } from "@/components/AnimatedGallery";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MenuPreview } from "@/components/MenuPreview";
import { ReviewsCarousel } from "@/components/ReviewsCarousel";
import { useI18n } from "@/lib/i18n"; 

import heroDesktop from "@/assets/home/background/mageireuto-fagito-serres-ola-katsarola.webp"; 
import heroMobile from "@/assets/home/background/mageireuta-fagita-serres-ola-katsarola.webp";
import historyImg from "@/assets/home/history/paradosiako-estiatorio-serres.webp";

function Home() {
  const { lang } = useI18n();

  const t = {
    el: {
      heroSub: "ΠΑΡΑΔΟΣΙΑΚΟ ΜΑΓΕΙΡΕΙΟ ΣΤΙΣ ΣΕΡΡΕΣ",
      heroTitle: "Σπιτικό φαγητό και Ελληνική κουζίνα με πλούσιες γεύσεις. Λαχταριστά μαγειρευτά, φρέσκα θαλασσινά και ψητά, έτοιμα για online παραγγελία και delivery στην πόρτα σας.",
      btn: "Παραγγείλετε Τώρα",
      histSub: "ΣΠΙΤΙΚΟ ΦΑΓΗΤΟ ΣΤΙΣ ΣΕΡΡΕΣ",
      histTitle: "Μαγειρεμένο αργά, όπως παλιά.",
      histDesc: "Στο μαγειρείο Όλα Κατσαρόλα, σιγοβράζουν συνταγές που περνούν από γενιά σε γενιά. Κάθε πρωί διαλέγουμε φρέσκα υλικά από τοπικούς παραγωγούς των Σερρών, αγνό ελαιόλαδο, μυρωδικά και διαλεχτά κρέατα, προσφέροντας ποιοτικό, σπιτικό φαγητό για το καθημερινό σας τραπέζι."
    },
    en: {
      heroSub: "TRADITIONAL EATERY IN SERRES",
      heroTitle: "Homemade food and Greek cuisine with rich flavors. Delicious cooked meals, fresh seafood, and grilled dishes, ready for online ordering and delivery to your door.",
      btn: "Order Now",
      histSub: "HOMEMADE FOOD IN SERRES",
      histTitle: "Slow-cooked, just like the old days.",
      histDesc: "At Ola Katsarola eatery, recipes passed down from generation to generation simmer slowly. Every morning we select fresh ingredients from local producers in Serres, pure olive oil, herbs, and choice meats, offering quality, homemade food for your daily table."
    },
    bg: {
      heroSub: "ТРАДИЦИОНЕН РЕСТОРАНТ В СЕРЕС",
      heroTitle: "Домашна храна и гръцка кухня с богати вкусове. Вкусни готвени ястия, пресни морски дарове и печени ястия, готови за онлайн поръчка и доставка до вашата врата.",
      btn: "Поръчай сега",
      histSub: "ДОМАШНА ХРАНА В СЕРЕС",
      histTitle: "Готвено бавно, както в миналото.",
      histDesc: "В ресторант Ola Katsarola къкрят рецепти, предавани от поколение на поколение. Всяка сутрин избираме пресни съставки от местни производители в Серес, чист зехтин, билки и подбрани меса, предлагайки качествена, домашна храна за вашата ежедневна трапеза."
    }
  }[lang] || {
    heroSub: "ΠΑΡΑΔΟΣΙΑΚΟ ΜΑΓΕΙΡΕΙΟ ΣΤΙΣ ΣΕΡΡΕΣ",
    heroTitle: "Σπιτικό φαγητό και Ελληνική κουζίνα με πλούσιες γεύσεις. Λαχταριστά μαγειρευτά, φρέσκα θαλασσινά και ψητά, έτοιμα για online παραγγελία και delivery στην πόρτα σας.",
    btn: "Παραγγείλετε Τώρα",
    histSub: "ΣΠΙΤΙΚΟ ΦΑΓΗΤΟ ΣΤΙΣ ΣΕΡΡΕΣ",
    histTitle: "Μαγειρεμένο αργά, όπως παλιά.",
    histDesc: "Στο μαγειρείο Όλα Κατσαρόλα, σιγοβράζουν συνταγές που περνούν από γενιά σε γενιά. Κάθε πρωί διαλέγουμε φρέσκα υλικά από τοπικούς παραγωγούς των Σερρών, αγνό ελαιόλαδο, μυρωδικά και διαλεχτά κρέατα, προσφέροντας ποιοτικό, σπιτικό φαγητό για το καθημερινό σας τραπέζι."
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
        <img src={heroDesktop} alt="Παραδοσιακά ελληνικά μαγειρευτά φαγητά στις Σέρρες" width={1600} height={1008} className="absolute inset-0 -z-10 h-full w-full object-cover hidden md:block" />
        <img src={heroMobile} alt="Παραδοσιακά ελληνικά μαγειρευτά φαγητά στις Σέρρες" width={800} height={1200} className="absolute inset-0 -z-10 h-full w-full object-cover md:hidden" />
        <div className="hero-overlay absolute inset-0 -z-10" />
        <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-32 md:pb-24">
          <motion.p {...fade} className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-ink-foreground/80">
            {t.heroSub}
          </motion.p>
          <motion.h1 {...fade} className="max-w-4xl text-3xl font-bold leading-[1.2] text-ink-foreground md:text-5xl lg:text-6xl">
            {t.heroTitle}
          </motion.h1>
          <motion.div {...fade} className="mt-8">
            <Link 
              to="/menu"
              title="Δείτε το μενού και παραγγείλτε online"
              aria-label="Μενού delivery φαγητού"
            >
              <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-flex h-14 items-center gap-2 rounded-full bg-primary px-8 font-semibold text-primary-foreground shadow-soft">
                {t.btn} <ArrowRight className="h-5 w-5" />
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-16 px-4 py-20 md:grid-cols-2 md:items-center md:py-28">
        <motion.div {...fade} className="flex flex-col md:pr-12 lg:pr-20 md:border-r border-border/40">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{t.histSub}</p>
          <h2 className="mt-4 mb-8 text-3xl font-bold md:text-5xl">{t.histTitle}</h2>
          
          <img 
            src={historyImg} 
            alt="Η ιστορία του μαγειρείου Όλα Κατσαρόλα στις Σέρρες" 
            className="mb-8 h-64 w-full md:h-80 rounded-[2rem] object-cover shadow-xl border border-border/50" 
          />
          
          <p className="text-lg leading-relaxed text-muted-foreground">
            {t.histDesc}
          </p>
        </motion.div>

        <div className="w-full overflow-hidden md:pl-8 lg:pl-12">
          <AnimatedGallery />
        </div>
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
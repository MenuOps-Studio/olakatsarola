import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import hero from "@/assets/hero.jpg";
import about1 from "@/assets/about-1.jpg";
import about2 from "@/assets/about-2.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Όλα Κατσαρόλα | Το Καλύτερο Μαγειρευτό Φαγητό στις Σέρρες" },
      { name: "description", content: "Καθημερινά φρέσκα μαγειρευτά, ψητά της ώρας και δροσερές σαλάτες. Παραγγείλετε online ή ελάτε Εθνικής Αντίστασης 33, Σέρρες." },
      { name: "keywords", content: "εστιατόριο σέρρες, μαγειρευτά σέρρες, φαγητό πακέτο, delivery σέρρες, όλα κατσαρόλα, ελληνική κουζίνα" },
      { property: "og:title", content: "Όλα Κατσαρόλα | Ελληνικό Μαγειρείο στις Σέρρες" },
      { property: "og:description", content: "Καθημερινά φρέσκα μαγειρευτά. Παραγγείλετε online τώρα." },
    ],
  }),
  component: Home,
});

const reviews = [
  { name: "Μαρία Κ.", text: "Σαν το φαγητό της γιαγιάς! Το παστίτσιο ήταν απίστευτο και έφτασε ζεστό." },
  { name: "Γιώργος Π.", text: "Το αρνάκι στο φούρνο λιώνει στο στόμα. Τίμιες μερίδες, άψογη εξυπηρέτηση." },
  { name: "Ελένη Δ.", text: "Μου άρεσε που μπορώ να αφαιρέσω υλικά. Φρέσκα, καθαρά, νόστιμα." },
];

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

function Home() {
  return (
    <>
      <section className="relative isolate flex min-h-[88vh] items-end overflow-hidden">
        <img src={hero} alt="Παραδοσιακά ελληνικά φαγητά σε πήλινα σκεύη" width={1600} height={1008} className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="hero-overlay absolute inset-0 -z-10" />
        <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-32 md:pb-24">
          <motion.p {...fade} className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-ink-foreground/80">
            Ελληνικό Μαγειρείο · Σέρρες
          </motion.p>
          <motion.h1 {...fade} className="max-w-3xl text-4xl font-bold leading-[1.1] text-ink-foreground md:text-6xl">
            Ελληνική κουζίνα με πλούσιες γεύσεις και μενού που προσαρμόζονται στις προσωπικές σας προτιμήσεις.
          </motion.h1>
          <motion.div {...fade} className="mt-8">
            <Link to="/menu">
              <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-flex h-14 items-center gap-2 rounded-full bg-primary px-8 font-semibold text-primary-foreground shadow-soft">
                Παραγγείλετε Τώρα <ArrowRight className="h-5 w-5" />
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-2 md:items-center md:py-28">
        <motion.div {...fade}>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Η ιστορία μας</p>
          <h2 className="mt-4 text-3xl font-bold md:text-5xl">Μαγειρεμένο αργά, όπως παλιά.</h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Στην κατσαρόλα μας σιγοβράζουν συνταγές που περνούν από γενιά σε γενιά. Διαλέγουμε κάθε πρωί
            φρέσκα υλικά από τοπικούς παραγωγούς, ελαιόλαδο, μυρωδικά και κρέατα της περιοχής — χωρίς
            συντομεύσεις, μόνο με μεράκι.
          </p>
        </motion.div>
        <div className="grid grid-cols-2 gap-4">
          <motion.img {...fade} src={about1} alt="Μαγείρισσα ανακατεύει κατσαρόλα" loading="lazy" width={912} height={1104} className="aspect-[4/5] w-full rounded-2xl object-cover shadow-soft" />
          <motion.img {...fade} src={about2} alt="Φρέσκα ελληνικά υλικά" loading="lazy" width={912} height={1104} className="mt-10 aspect-[4/5] w-full rounded-2xl object-cover shadow-soft" />
        </div>
      </section>

      <section className="bg-secondary py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold md:text-5xl">Τι λένε για εμάς</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {reviews.map((r, i) => (
              <motion.figure key={r.name} {...fade} transition={{ duration: 0.6, delay: i * 0.1 }} className="rounded-2xl bg-card p-6 shadow-soft">
                <div className="flex gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, s) => <Star key={s} className="h-4 w-4 fill-current" />)}
                </div>
                <blockquote className="mt-4 leading-relaxed">“{r.text}”</blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-muted-foreground">— {r.name}</figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

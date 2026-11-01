import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [{ title: "Πολιτική Απορρήτου | Όλα Κατσαρόλα" }],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Επιστροφή στην αρχική
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-12 flex items-center gap-4 border-b border-border pb-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-ink md:text-4xl">Πολιτική Απορρήτου</h1>
              <p className="mt-2 text-muted-foreground">Τελευταία ενημέρωση: Οκτώβριος 2026</p>
            </div>
          </div>

          <div className="space-y-8 text-ink/80 leading-relaxed">
            <section>
              <h2 className="mb-4 text-xl font-bold text-ink">1. Εισαγωγή</h2>
              <p>Το εστιατόριο "Όλα Κατσαρόλα" (Εθνικής Αντίστασης 33, Σέρρες), μέσω της πλατφόρμας ScanEat, σέβεται την ιδιωτικότητά σας. Η παρούσα πολιτική εξηγεί πώς συλλέγουμε, χρησιμοποιούμε και προστατεύουμε τα προσωπικά σας δεδομένα κατά την παραγγελία σας.</p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold text-ink">2. Δεδομένα που Συλλέγουμε</h2>
              <p>Για την εκτέλεση της παραγγελίας σας, συλλέγουμε αυστηρά τα απαραίτητα στοιχεία:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
                <li>Ονοματεπώνυμο</li>
                <li>Τηλέφωνο επικοινωνίας</li>
                <li>Διεύθυνση παράδοσης (οδός, αριθμός, όροφος, κουδούνι)</li>
                <li>Ιστορικό παραγγελιών στο κατάστημά μας</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold text-ink">3. Σκοπός και Χρήση Δεδομένων</h2>
              <p>Τα δεδομένα σας χρησιμοποιούνται αποκλειστικά για:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
                <li>Την προετοιμασία και παράδοση της παραγγελίας σας από τους διανομείς μας.</li>
                <li>Την επικοινωνία μαζί σας σε περίπτωση προβλήματος ή διευκρίνισης (π.χ. έλλειψη προϊόντος).</li>
                <li>Την επεξεργασία της πληρωμής σας (εφόσον επιλέξετε κάρτα, η συναλλαγή γίνεται στο ασφαλές περιβάλλον της Viva Wallet και εμείς δεν αποθηκεύουμε στοιχεία κάρτας).</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold text-ink">4. Τοπική Αποθήκευση (Local Storage) & Cookies</h2>
              <p>Η ιστοσελίδα μας χρησιμοποιεί την τοπική μνήμη της συσκευής σας (Local Storage) αποκλειστικά για την αποθήκευση του ενεργού καλαθιού σας και των αριθμών των ενεργών παραγγελιών σας, ώστε να μπορείτε να παρακολουθείτε ζωντανά την εξέλιξή τους. Πρόκειται για τεχνικά απαραίτητα δεδομένα για τη λειτουργία του συστήματος παραγγελιών ScanEat και δεν χρησιμοποιούνται για διαφημιστικούς σκοπούς (tracking).</p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold text-ink">5. Διατήρηση και Διαγραφή</h2>
              <p>Τα φορολογικά στοιχεία των παραγγελιών διατηρούνται για το χρονικό διάστημα που ορίζει η ισχύουσα φορολογική νομοθεσία. Μπορείτε ανά πάσα στιγμή να ζητήσετε τη διαγραφή των στοιχείων επικοινωνίας σας καλώντας μας στο 2321054111.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [{ title: "Όροι Χρήσης | Όλα Κατσαρόλα" }],
  }),
  component: TermsAndConditions,
});

function TermsAndConditions() {
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
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-ink md:text-4xl">Όροι Χρήσης</h1>
              <p className="mt-2 text-muted-foreground">Τελευταία ενημέρωση: Οκτώβριος 2026</p>
            </div>
          </div>

          <div className="space-y-8 text-ink/80 leading-relaxed">
            <section>
              <h2 className="mb-4 text-xl font-bold text-ink">1. Γενικά</h2>
              <p>Ο παρών ιστότοπος αποτελεί το ηλεκτρονικό κατάστημα παραγγελιών του εστιατορίου "Όλα Κατσαρόλα", που εδρεύει στην Εθνικής Αντίστασης 33 στις Σέρρες. Η χρήση της ιστοσελίδας και η υποβολή παραγγελιών προϋποθέτει την αποδοχή των παρόντων όρων.</p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold text-ink">2. Υποβολή & Εκτέλεση Παραγγελίας</h2>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
                <li>Το κατάστημα δεσμεύεται για την ποιότητα και την ασφαλή μεταφορά των προϊόντων.</li>
                <li>Οι αναγραφόμενες τιμές στον κατάλογο περιλαμβάνουν ΦΠΑ και όλες τις νόμιμες κρατήσεις.</li>
                <li>Το κατάστημα διατηρεί το δικαίωμα να απορρίψει ή να ακυρώσει παραγγελία σε περίπτωση έλλειψης προϊόντων, ενημερώνοντας άμεσα τον πελάτη.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold text-ink">3. Ακυρώσεις & Επιστροφές</h2>
              <p>Λόγω της φύσης των προϊόντων (φρέσκα, ευπαθή τρόφιμα), ισχύουν τα εξής:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
                <li>Ακύρωση παραγγελίας γίνεται δεκτή <strong>μόνο εντός 5 λεπτών</strong> από την υποβολή της και αποκλειστικά με τηλεφωνική επικοινωνία στο 2321054111.</li>
                <li>Επιστροφές προϊόντων δεν γίνονται δεκτές μετά την παραλαβή, εκτός εάν υπάρξει αποδεδειγμένο λάθος στην εκτέλεση της παραγγελίας από πλευράς του καταστήματος. Σε τέτοια περίπτωση, γίνεται άμεση αντικατάσταση.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold text-ink">4. Τρόποι Πληρωμής</h2>
              <p>Οι χρήστες μπορούν να εξοφλήσουν την παραγγελία τους με τους εξής τρόπους:</p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
                <li><strong>Μετρητά:</strong> Πληρωμή στον διανομέα κατά την παράδοση.</li>
                <li><strong>Πιστωτική/Χρεωστική Κάρτα:</strong> Ηλεκτρονική πληρωμή με απόλυτη ασφάλεια μέσω του συστήματος Viva Wallet Smart Checkout. Το κατάστημα δεν έρχεται ποτέ σε επαφή με τα στοιχεία της κάρτας σας.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold text-ink">5. Διαθεσιμότητα Υπηρεσίας</h2>
              <p>Η υπηρεσία delivery λειτουργεί σύμφωνα με το ωράριο καταστήματος. Το σύστημα ScanEat ενδέχεται να τεθεί προσωρινά εκτός λειτουργίας για λόγους συντήρησης, χωρίς προειδοποίηση.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";
import { useI18n } from "@/lib/i18n"; 

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [{ title: "Όροι Χρήσης | Όλα Κατσαρόλα" }],
  }),
  component: TermsAndConditions,
});

function TermsAndConditions() {
  const { lang } = useI18n();

  return (
    <div className="min-h-screen bg-background py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> 
          {lang === 'en' ? "Back to home" : lang === 'bg' ? "Обратно към началото" : "Επιστροφή στην αρχική"}
        </Link>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-12 flex items-center gap-4 border-b border-border pb-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-ink md:text-4xl">
                {lang === 'en' ? "Terms of Use" : lang === 'bg' ? "Условия за ползване" : "Όροι Χρήσης"}
              </h1>
              <p className="mt-2 text-muted-foreground">
                {lang === 'en' ? "Last updated: October 2026" : lang === 'bg' ? "Последна актуализация: Октомври 2026" : "Τελευταία ενημέρωση: Οκτώβριος 2026"}
              </p>
            </div>
          </div>

          <div className="space-y-8 text-ink/80 leading-relaxed">
            {lang === 'en' && (
              <>
                <section>
                  <h2 className="mb-4 text-xl font-bold text-ink">1. General</h2>
                  <p>This website is the online ordering platform for the "Ola Katsarola" restaurant, located at 33 Ethnikis Antistasis, Serres. By using this website and placing orders, you accept these terms.</p>
                </section>
                <section>
                  <h2 className="mb-4 text-xl font-bold text-ink">2. Order Submission & Execution</h2>
                  <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
                    <li>The restaurant is committed to the quality and safe transport of products.</li>
                    <li>Prices listed in the menu include VAT and all legal taxes.</li>
                    <li>The restaurant reserves the right to reject or cancel an order in case of product shortage, notifying the customer immediately.</li>
                  </ul>
                </section>
                <section>
                  <h2 className="mb-4 text-xl font-bold text-ink">3. Cancellations & Returns</h2>
                  <p>Due to the nature of the products (fresh, perishable food), the following apply:</p>
                  <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
                    <li>Order cancellation is accepted <strong>only within 5 minutes</strong> of submission, exclusively by calling +30 2321054111.</li>
                    <li>Product returns are not accepted after delivery, unless there is a proven mistake in the execution of the order by the restaurant. In such cases, an immediate replacement is provided.</li>
                  </ul>
                </section>
                <section>
                  <h2 className="mb-4 text-xl font-bold text-ink">4. Payment Methods</h2>
                  <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
                    <li><strong>Cash:</strong> Payment to the courier upon delivery.</li>
                    <li><strong>Credit/Debit Card:</strong> Secure online payment via Viva Wallet Smart Checkout. The restaurant never has access to your card details.</li>
                  </ul>
                </section>
              </>
            )}

            {lang === 'bg' && (
              <>
                <section>
                  <h2 className="mb-4 text-xl font-bold text-ink">1. Общи положения</h2>
                  <p>Този уебсайт е платформата за онлайн поръчки на ресторант "Ола Кацарола", разположен на ул. Етникис Антистасис 33, Серес. С използването на този уебсайт и правенето на поръчки, вие приемате тези условия.</p>
                </section>
                <section>
                  <h2 className="mb-4 text-xl font-bold text-ink">2. Подаване и изпълнение на поръчка</h2>
                  <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
                    <li>Ресторантът се ангажира с качеството и безопасното транспортиране на продуктите.</li>
                    <li>Цените, посочени в менюто, включват ДДС и всички законови данъци.</li>
                    <li>Ресторантът си запазва правото да отхвърли или анулира поръчка в случай на недостиг на продукти, като незабавно уведоми клиента.</li>
                  </ul>
                </section>
                <section>
                  <h2 className="mb-4 text-xl font-bold text-ink">3. Анулирания и връщания</h2>
                  <p>Поради естеството на продуктите (пресни, бързо развалящи се храни), важи следното:</p>
                  <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
                    <li>Анулиране на поръчка се приема <strong>само в рамките на 5 минути</strong> от подаването ѝ, изключително чрез обаждане на +30 2321054111.</li>
                    <li>Връщане на продукти не се приема след доставка, освен ако няма доказана грешка при изпълнението на поръчката от страна на ресторанта. В такива случаи се осигурява незабавна замяна.</li>
                  </ul>
                </section>
                <section>
                  <h2 className="mb-4 text-xl font-bold text-ink">4. Начини на плащане</h2>
                  <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
                    <li><strong>В брой:</strong> Плащане на куриера при доставка.</li>
                    <li><strong>Кредитна/Дебитна карта:</strong> Сигурно онлайн плащане чрез Viva Wallet Smart Checkout. Ресторантът никога няма достъп до данните на вашата карта.</li>
                  </ul>
                </section>
              </>
            )}

            {lang === 'el' && (
              <>
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
                  <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
                    <li><strong>Μετρητά:</strong> Πληρωμή στον διανομέα κατά την παράδοση.</li>
                    <li><strong>Πιστωτική/Χρεωστική Κάρτα:</strong> Ηλεκτρονική πληρωμή με απόλυτη ασφάλεια μέσω του συστήματος Viva Wallet Smart Checkout. Το κατάστημα δεν έρχεται ποτέ σε επαφή με τα στοιχεία της κάρτας σας.</li>
                  </ul>
                </section>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
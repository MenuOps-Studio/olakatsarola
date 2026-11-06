import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n"; 

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [{ title: "Πολιτική Απορρήτου | Όλα Κατσαρόλα" }],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
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
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-ink md:text-4xl">
                {lang === 'en' ? "Privacy Policy" : lang === 'bg' ? "Политика за поверителност" : "Πολιτική Απορρήτου"}
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
                  <h2 className="mb-4 text-xl font-bold text-ink">1. Introduction</h2>
                  <p>The "Ola Katsarola" restaurant (33 Ethnikis Antistasis, Serres), through the ScanEat platform, respects your privacy. This policy explains how we collect, use, and protect your personal data during your order.</p>
                </section>
                <section>
                  <h2 className="mb-4 text-xl font-bold text-ink">2. Data we Collect</h2>
                  <p>To execute your order, we collect strictly the necessary details:</p>
                  <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
                    <li>Full Name</li>
                    <li>Contact Phone</li>
                    <li>Delivery Address (street, number, floor, bell)</li>
                    <li>Order history at our store</li>
                  </ul>
                </section>
                <section>
                  <h2 className="mb-4 text-xl font-bold text-ink">3. Purpose and Data Use</h2>
                  <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
                    <li>Preparation and delivery of your order by our couriers.</li>
                    <li>Communication with you in case of a problem or clarification (e.g., product shortage).</li>
                    <li>Processing your payment (if you choose a card, the transaction is done in the secure environment of Viva Wallet, and we do not store card details).</li>
                  </ul>
                </section>
                <section>
                  <h2 className="mb-4 text-xl font-bold text-ink">4. Local Storage & Cookies</h2>
                  <p>Our website uses your device's local memory (Local Storage) exclusively to store your active cart and active order numbers, so you can track them live. These are technically necessary data for the ScanEat ordering system and are not used for advertising purposes (tracking).</p>
                </section>
              </>
            )}

            {lang === 'bg' && (
              <>
                <section>
                  <h2 className="mb-4 text-xl font-bold text-ink">1. Въведение</h2>
                  <p>Ресторант "Ола Кацарола" (ул. Етникис Антистасис 33, Серес), чрез платформата ScanEat, уважава вашата поверителност. Тази политика обяснява как събираме, използваме и защитаваме вашите лични данни по време на вашата поръчка.</p>
                </section>
                <section>
                  <h2 className="mb-4 text-xl font-bold text-ink">2. Данни, които събираме</h2>
                  <p>За да изпълним вашата поръчка, ние събираме строго необходимите данни:</p>
                  <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
                    <li>Име и фамилия</li>
                    <li>Телефон за връзка</li>
                    <li>Адрес за доставка (улица, номер, етаж, звънец)</li>
                    <li>История на поръчките в нашия магазин</li>
                  </ul>
                </section>
                <section>
                  <h2 className="mb-4 text-xl font-bold text-ink">3. Цел и използване на данните</h2>
                  <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
                    <li>Приготвяне и доставка на вашата поръчка от нашите куриери.</li>
                    <li>Комуникация с вас в случай на проблем или уточнение (напр. недостиг на продукт).</li>
                    <li>Обработка на вашето плащане (ако изберете карта, транзакцията се извършва в сигурната среда на Viva Wallet и ние не съхраняваме данни за картата).</li>
                  </ul>
                </section>
                <section>
                  <h2 className="mb-4 text-xl font-bold text-ink">4. Локално съхранение и бисквитки</h2>
                  <p>Нашият уебсайт използва локалната памет на вашето устройство (Local Storage) изключително за съхранение на вашата активна количка и номера на активни поръчки, за да можете да ги проследявате на живо. Това са технически необходими данни за системата за поръчки ScanEat и не се използват за рекламни цели (проследяване).</p>
                </section>
              </>
            )}

            {lang === 'el' && (
              <>
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
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { XCircle, ShoppingBag, Phone, ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/payment-failed")({
  head: () => ({
    meta: [
      { title: "Αποτυχία Πληρωμής | Όλα Κατσαρόλα" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PaymentFailedPage,
});

function PaymentFailedPage() {
  const { lang } = useI18n();
  const { setOpen } = useCart();

  const t = {
    el: {
      title: "Η πληρωμή δεν ολοκληρώθηκε",
      desc: "Παρουσιάστηκε κάποιο πρόβλημα κατά τη συναλλαγή με το Viva Wallet ή η πληρωμή ακυρώθηκε. Δεν έχει γίνει καμία χρέωση στην κάρτα σας.",
      hint: "Μπορείτε να δοκιμάσετε ξανά από το καλάθι σας ή να επιλέξετε πληρωμή με αντικαταβολή.",
      retryBtn: "Επιστροφή στο Καλάθι",
      menuBtn: "Πίσω στο Μενού",
      helpText: "Χρειάζεστε βοήθεια; Καλέστε μας στο",
    },
    en: {
      title: "Payment Failed",
      desc: "There was a problem processing your Viva Wallet transaction, or the payment was cancelled. Your card has not been charged.",
      hint: "You can try again from your cart or choose Cash on Delivery.",
      retryBtn: "Return to Cart",
      menuBtn: "Back to Menu",
      helpText: "Need help? Call us at",
    },
    bg: {
      title: "Плащането не беше завършено",
      desc: "Възникна проблем при транзакцията с Viva Wallet или плащането беше отменено. Картата ви не е таксувана.",
      hint: "Можете да опитате отново от количката си или да изберете наложен платеж.",
      retryBtn: "Обратно към количката",
      menuBtn: "Обратно към менюто",
      helpText: "Нуждаете се от помощ? Обадете ни се на",
    },
  }[lang] || {
    title: "Η πληρωμή δεν ολοκληρώθηκε",
    desc: "Παρουσιάστηκε κάποιο πρόβλημα κατά τη συναλλαγή με το Viva Wallet ή η πληρωμή ακυρώθηκε. Δεν έχει γίνει καμία χρέωση στην κάρτα σας.",
    hint: "Μπορείτε να δοκιμάσετε ξανά από το καλάθι σας ή να επιλέξετε πληρωμή με αντικαταβολή.",
    retryBtn: "Επιστροφή στο Καλάθι",
    menuBtn: "Πίσω στο Μενού",
    helpText: "Χρειάζεστε βοήθεια; Καλέστε μας στο",
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-background px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-sm md:p-10"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <XCircle className="h-9 w-9" />
        </div>

        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          {t.title}
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
          {t.desc}
        </p>

        <p className="mt-3 text-xs font-medium text-muted-foreground/80">
          {t.hint}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setOpen(true)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <ShoppingBag className="h-4 w-4" />
            {t.retryBtn}
          </motion.button>

          <Link
            to="/menu"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.menuBtn}
          </Link>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-xs text-muted-foreground">
          {t.helpText}{" "}
          <a
            href="tel:+302321054111"
            className="inline-flex items-center gap-1 font-bold text-foreground transition-colors hover:text-primary"
          >
            <Phone className="h-3.5 w-3.5" />
            2321 054111
          </a>
        </div>
      </motion.div>
    </div>
  );
}
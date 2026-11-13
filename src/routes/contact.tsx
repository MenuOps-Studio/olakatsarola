import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, Phone } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Επικοινωνία · ΟΛΑ ΚΑΤΣΑΡΟΛΑ" },
      { name: "description", content: "Εθνικής Αντίστασης 33, Σέρρες. Τηλ. 2321054111. Ωράριο Δευτέρα–Σάββατο 11:00 π.μ. – 5:00 μ.μ." },
      { property: "og:title", content: "Επικοινωνία · ΟΛΑ ΚΑΤΣΑΡΟΛΑ" },
      { property: "og:description", content: "Βρείτε μας στις Σέρρες — τηλέφωνα, διεύθυνση και ωράριο." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { lang } = useI18n();

  // Λεξικό για τα κείμενα της Επικοινωνίας
  const t = {
    el: {
      subtitle: "Επικοινωνία",
      title: "Ελάτε να μας βρείτε",
      phones: "Τηλέφωνα",
      addressTitle: "Διεύθυνση",
      addressText: "Εθνικής Αντίστασης 33, Σέρρες 621 22",
      hoursTitle: "Ωράριο",
      closed: "Κλειστά",
      time: "11:00 π.μ. - 5:00 μ.μ.",
      days: ["Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο", "Κυριακή"]
    },
    en: {
      subtitle: "Contact",
      title: "Come find us",
      phones: "Phone",
      addressTitle: "Address",
      addressText: "33 Ethnikis Antistasis, Serres 621 22",
      hoursTitle: "Working Hours",
      closed: "Closed",
      time: "11:00 AM - 5:00 PM",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    },
    bg: {
      subtitle: "Контакти",
      title: "Елате да ни намерите",
      phones: "Телефон",
      addressTitle: "Адрес",
      addressText: "Етникис Антистасис 33, Серес 621 22",
      hoursTitle: "Работно време",
      closed: "Затворено",
      time: "11:00 - 17:00",
      days: ["Понеделник", "Вторник", "Сряда", "Четвъртък", "Петък", "Събота", "Неделя"]
    }
  }[lang] || {
    subtitle: "Επικοινωνία",
    title: "Ελάτε να μας βρείτε",
    phones: "Τηλέφωνα",
    addressTitle: "Διεύθυνση",
    addressText: "Εθνικής Αντίστασης 33, Σέρρες 621 22",
    hoursTitle: "Ωράριο",
    closed: "Κλειστά",
    time: "11:00 π.μ. - 5:00 μ.μ.",
    days: ["Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο", "Κυριακή"]
  };

  // Δυναμικός πίνακας ωραρίου βάσει της επιλεγμένης γλώσσας
  const hours = [
    [t.days[0], t.time],
    [t.days[1], t.time],
    [t.days[2], t.time],
    [t.days[3], t.time],
    [t.days[4], t.time],
    [t.days[5], t.time],
    [t.days[6], t.closed],
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{t.subtitle}</p>
      <h1 className="mt-2 text-4xl font-bold md:text-5xl text-ink">{t.title}</h1>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">{t.phones}</h2>
            </div>
            <div className="mt-4 flex flex-col gap-2 text-lg font-medium">
              <a href="tel:2321054111" className="hover:text-primary transition-colors">2321 054111</a>
            </div>
          </div>
          
          <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">{t.addressTitle}</h2>
            </div>
            <p className="mt-4 text-lg font-medium">{t.addressText}</p>
          </div>
          
          <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">{t.hoursTitle}</h2>
            </div>
            <dl className="mt-4 divide-y divide-border">
              {hours.map(([d, h]) => (
                <div key={d} className="flex justify-between py-3">
                  <dt className="font-semibold">{d}</dt>
                  <dd className={`font-medium ${h === t.closed ? "text-primary" : "text-muted-foreground"}`}>{h}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="min-h-[360px] overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
          <iframe
            title="Χάρτης ΟΛΑ ΚΑΤΣΑΡΟΛΑ"
            src="https://maps.google.com/maps?q=ΟΛΑ%20ΚΑΤΣΑΡΟΛΑ%20Σέρρες,%20Εθνικής%20Αντίστασης%2033&t=&z=16&ie=UTF8&iwloc=&output=embed"
            className="h-full min-h-[360px] w-full"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, Phone } from "lucide-react";

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

const hours = [
  ["Δευτέρα", "11:00 π.μ. - 5:00 μ.μ."],
  ["Τρίτη", "11:00 π.μ. - 5:00 μ.μ."],
  ["Τετάρτη", "11:00 π.μ. - 5:00 μ.μ."],
  ["Πέμπτη", "11:00 π.μ. - 5:00 μ.μ."],
  ["Παρασκευή", "11:00 π.μ. - 5:00 μ.μ."],
  ["Σάββατο", "11:00 π.μ. - 5:00 μ.μ."],
  ["Κυριακή", "Κλειστά"],
];

function Contact() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Επικοινωνία</p>
      <h1 className="mt-2 text-4xl font-bold md:text-5xl text-ink">Ελάτε να μας βρείτε</h1>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3"><Phone className="h-5 w-5 text-primary" /><h2 className="text-xl font-bold">Τηλέφωνα</h2></div>
            <div className="mt-4 flex flex-col gap-2 text-lg font-medium">
              <a href="tel:2321054111" className="hover:text-primary transition-colors">2321 054111</a>
            </div>
          </div>
          <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-primary" /><h2 className="text-xl font-bold">Διεύθυνση</h2></div>
            <p className="mt-4 text-lg font-medium">Εθνικής Αντίστασης 33, Σέρρες 621 22</p>
          </div>
          <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3"><Clock className="h-5 w-5 text-primary" /><h2 className="text-xl font-bold">Ωράριο</h2></div>
            <dl className="mt-4 divide-y divide-border">
              {hours.map(([d, h]) => (
                <div key={d} className="flex justify-between py-3">
                  <dt className="font-semibold">{d}</dt>
                  <dd className={`font-medium ${h === "Κλειστά" ? "text-primary" : "text-muted-foreground"}`}>{h}</dd>
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
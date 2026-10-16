import salad from "@/assets/cat-salad.jpg";
import meat from "@/assets/cat-meat.jpg";
import soup from "@/assets/cat-soup.jpg";
import sea from "@/assets/cat-sea.jpg";
import drinks from "@/assets/cat-drinks.jpg";
import hero from "@/assets/hero.jpg";
import about2 from "@/assets/about-2.jpg";

export type MenuItem = { id: string; name: string; ingredients: string[]; price: number };
export type Category = { id: string; name: string; note?: string; image: string; items: MenuItem[] };

const SIDE = "Σερβίρονται με ρύζι ή πατάτες φούρνου ή πουρέ πατάτας";

export const categories: Category[] = [
  { id: "salates", name: "Σαλάτες", image: salad, items: [
    { id: "roka", name: "Ρόκα Μαρούλι", ingredients: ["Σταφίδες", "Αμύγδαλο", "Ντοματίνια", "Παρμεζάνα", "Dressing Βαλσάμικο"], price: 6.5 } ] },
  { id: "orektika", name: "Ορεκτικά", image: about2, items: [
    { id: "manitaria", name: "Τηγανιά Μανιταριών", ingredients: ["Φρέσκο Κρεμμυδάκι", "Λευκό κρασί", "Φρέσκο λεμόνι"], price: 7 } ] },
  { id: "xoirino", name: "Χοιρινό", note: SIDE, image: meat, items: [
    { id: "xoirino-laxano", name: "Χοιρινό με λάχανο", ingredients: [], price: 9.5 } ] },
  { id: "mosxari", name: "Μοσχάρι", note: SIDE, image: hero, items: [
    { id: "sykoti", name: "Μοσχαρίσιο Συκώτι", ingredients: ["Καραμελωμένα κρεμμύδια", "Καπνιστό Κρασί Σάμου", "Βαλσάμικο"], price: 12 } ] },
  { id: "kotopoulo", name: "Κοτόπουλο", note: SIDE, image: meat, items: [
    { id: "tigania", name: "Ανάμεικτη Τηγανιά Κοτόπουλο", ingredients: ["Καραμανλίδικο Λουκάνικο", "Σάλτσα Ψητού"], price: 9.5 } ] },
  { id: "arni", name: "Αρνί - Κουνέλι", image: meat, items: [
    { id: "arnaki", name: "Αρνάκι στο Φούρνο", ingredients: ["Μουστάρδα", "Δενδρολίβανο"], price: 16 } ] },
  { id: "kimas", name: "Όλα με Κιμά", image: hero, items: [
    { id: "pastitsio", name: "Παστίτσιο", ingredients: [], price: 8 } ] },
  { id: "xoris-kreas", name: "Χωρίς Κρέας", image: about2, items: [
    { id: "prasoryzo", name: "Πρασόρυζο Δημητριακών", ingredients: ["Φρέσκια Ντομάτα", "Καπνιστή Πάπρικα"], price: 6 } ] },
  { id: "ospria", name: "Όσπρια", image: soup, items: [
    { id: "fakes", name: "Φακές", ingredients: [], price: 6 } ] },
  { id: "psaria", name: "Ψάρια - Θαλασσινά", image: sea, items: [
    { id: "garides-saganaki", name: "Γαρίδες Σαγανάκι", ingredients: ["Φρέσκια σάλτσα ντομάτας", "Λαχανικά", "Μυρωδικά", "Φέτα"], price: 13 } ] },
  { id: "soupes", name: "Σούπες", image: soup, items: [
    { id: "kolokytha", name: "Σούπα Βελουτέ Κολοκύθας", ingredients: ["Ginger", "Κολοκυθόσπορο"], price: 8 } ] },
  { id: "zymarika", name: "Ζυμαρικά", image: sea, items: [
    { id: "linguine", name: "Λιγκουίνι με Γαρίδες", ingredients: ["Σάλτσα ντομάτας", "Φρέσκα Μυρωδικά"], price: 12 } ] },
  { id: "risotto", name: "Risotto", image: about2, items: [
    { id: "risotto-kotopoulo", name: "Risotto Κοτόπουλο", ingredients: ["Κοτόπουλο", "Φρέσκα Μανιτάρια", "Κρέμα Παρμεζάνας"], price: 9 } ] },
  { id: "anapsyktika", name: "Αναψυκτικά", image: drinks, items: [
    { id: "coca-cola", name: "Coca Cola 1L", ingredients: [], price: 3 } ] },
  { id: "pota", name: "Μπύρες/Ποτά", image: drinks, items: [
    { id: "nymfi", name: "Νύμφη Κουτί 500ml", ingredients: [], price: 4 } ] },
];

export const formatPrice = (n: number) =>
  n.toLocaleString("el-GR", { style: "currency", currency: "EUR" });

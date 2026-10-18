import salad from "@/assets/cat-salad.jpg";
import meat from "@/assets/cat-meat.jpg";
import soup from "@/assets/cat-soup.jpg";
import sea from "@/assets/cat-sea.jpg";
import drinks from "@/assets/cat-drinks.jpg";
import hero from "@/assets/hero.jpg";
import about2 from "@/assets/about-2.jpg";

export type MenuItem = { 
  id: string; 
  name: string; 
  ingredients: string[]; 
  price: number;
  price_individual?: number | null; // Προστέθηκε για τις ατομικές τιμές
  description?: string;
};

export type Category = { 
  id: string; 
  name: string; 
  note?: string; 
  image: string; 
  items: MenuItem[] 
};

// Αυτό το αντικείμενο θα δίνει την κατάλληλη φωτογραφία σε κάθε κατηγορία
export const CAT_IMAGES: Record<string, string> = {
  "Σαλάτες": salad,
  "Ορεκτικά": about2,
  "Σούπες": soup,
  "Ζυμαρικά": sea,
  "Risotto": about2,
  "Χοιρινό": meat,
  "Μοσχάρι": hero,
  "Κοτόπουλο": meat,
  "Αρνί - Κουνέλι": meat,
  "Όλα με Κιμά": hero,
  "Χωρίς Κρέας": about2,
  "Όσπρια": soup,
  "Ψάρια - Θαλασσινά": sea,
  "Αναψυκτικά": drinks,
  "Μπύρες / Ποτά": drinks
};

export const formatPrice = (n: number) =>
  n.toLocaleString("el-GR", { style: "currency", currency: "EUR" });
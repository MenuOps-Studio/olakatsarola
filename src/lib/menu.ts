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
  price_individual?: number | null;
  description?: string;
  status?: string;     // Προσθήκη για τη διαθεσιμότητα
  sort_order?: number; // Προσθήκη για την ταξινόμηση
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
  "Σαλάτες": "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=800&q=80",
  "Ορεκτικά": "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80",
  "Σούπες": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
  "Ζυμαρικά": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80",
  "Risotto": "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80",
 "Χοιρινό": "https://images.unsplash.com/photo-1432139509613-5c4255815697?auto=format&fit=crop&w=800&q=80",
  "Μοσχάρι": "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80",
  "Κοτόπουλο": "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=800&q=80",
 "Αρνί - Κουνέλι": "https://images.unsplash.com/photo-1514516345957-556ca7d90a29?auto=format&fit=crop&w=800&q=80",
  "Όλα με Κιμά": "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=800&q=80",
  "Χωρίς Κρέας": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
  "Όσπρια": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
  "Ψάρια - Θαλασσινά": "https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=800&q=80",
  "Αναψυκτικά": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80",
  "Μπύρες / Ποτά": "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80"
};

export const formatPrice = (n: number) =>
  n.toLocaleString("el-GR", { style: "currency", currency: "EUR" });
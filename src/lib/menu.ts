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
  images: string[]
  items: MenuItem[] 
};

export const CAT_IMAGES: Record<string, string[]> = {

  "Σαλάτες": [
    "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
  ],

  "Ορεκτικά": [
    "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600803907087-f56d462fd26b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1528607929212-2636ec44253e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1577906096429-f73c2c312435?auto=format&fit=crop&w=800&q=80"
  ],

  "Σούπες": [
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1604152135912-04a022e23696?auto=format&fit=crop&w=800&q=80",
    /*"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",*/  
    /*"https://images.unsplash.com/photo-1579372785671-8fa1b9338f19?auto=format&fit=crop&w=800&q=80"*/
  ],

  "Ζυμαρικά": [
    "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=800&q=80"
  ],

  "Risotto": [
    "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&w=800&q=80",
    /*"https://images.unsplash.com/photo-1633504581576-880016e30018?auto=format&fit=crop&w=800&q=80"*/
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80"
  ],

  "Χοιρινό": [
    "https://images.unsplash.com/photo-1432139509613-5c4255815697?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80"
    /*"https://images.unsplash.com/photo-1602491453631-e2a56cb1ce0e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1544025162-8317dbbf1956?auto=format&fit=crop&w=800&q=80"*/
  ],

  "Μοσχάρι": [
    "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80",
    /*"https://images.unsplash.com/photo-1558030006-ceae6c1c7fe9?auto=format&fit=crop&w=800&q=80",*/
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80"
    /*"https://images.unsplash.com/photo-1594046338164-96d5a7d656df?auto=format&fit=crop&w=800&q=80"*/
  ],

  "Κοτόπουλο": [
    "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
    /*"https://images.unsplash.com/photo-1564834724105-9b8b730f785b?auto=format&fit=crop&w=800&q=80",*/
    "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=800&q=80"
  ],

  "Αρνί - Κουνέλι": [
    "https://images.unsplash.com/photo-1514516345957-556ca7d90a29?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80",
    /*"https://images.unsplash.com/photo-1615865417482-411aeb474d28?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1544025162-8317dbbf1956?auto=format&fit=crop&w=800&q=80"*/
  ],

  "Όλα με Κιμά": [
    "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    /*"https://images.unsplash.com/photo-1550547660-d1548cb45d47?auto=format&fit=crop&w=800&q=80",*/
    "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&w=800&q=80"
  ],

  "Χωρίς Κρέας": [
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    /*"https://images.unsplash.com/photo-1490645935980-d144393d8315?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1498837167922-26d2163b4b5d?auto=format&fit=crop&w=800&q=80",*/
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80"
  ],

  "Όσπρια": [
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1533622597524-a1215e26c0a2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80"
  ],

  "Ψάρια - Θαλασσινά": [
    "https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=800&q=80",
    /*"https://images.unsplash.com/photo-1615141982318-7f99988a0994?auto=format&fit=crop&w=800&q=80",*/
    "https://images.unsplash.com/photo-1579684947550-22e945225d9a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80"
  ],

  "Αναψυκτικά": [
    "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80",
    /*"https://images.unsplash.com/photo-1527004013197-41aab9b2e737?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1581006852262-e4307cb62d3e?auto=format&fit=crop&w=800&q=80",*/
    "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=800&q=80"
  ],

  "Μπύρες / Ποτά": [
    "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=800&q=80",
    /*"https://images.unsplash.com/photo-1575037614876-c385f242c730?auto=format&fit=crop&w=800&q=80",*/
    "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=800&q=80"
  ]
};

export const formatPrice = (n: number) =>
  n.toLocaleString("el-GR", { style: "currency", currency: "EUR" });
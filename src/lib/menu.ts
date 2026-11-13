export type MenuItem = { 
  id: string; 
  name: string; 
  ingredients: string[]; 
  price: number;
  price_individual?: number | null;
  description?: string;
  status?: string;     
  sort_order?: number; 
};

export type Category = { 
  id: string; 
  name: string; 
  note?: string; 
  images: string[]
  items: MenuItem[] 
};

// 1. Δυναμική φόρτωση όλων των εικόνων
const categoryImageModules = import.meta.glob<{ default: string }>(
  '@/assets/categories/**/*.{jpeg,jpg,png,webp}', 
  { eager: true }
);

// 2. Προσωρινό αντικείμενο για να κρατήσουμε και τα ονόματα των αρχείων πριν την ταξινόμηση
const rawImages: Record<string, { url: string, filename: string }[]> = {};

// 3. Χωρίζουμε τις εικόνες στις κατηγορίες τους
Object.entries(categoryImageModules).forEach(([path, module]) => {
  const parts = path.split('/');
  const categoryName = parts[parts.length - 2]; 
  const fileName = parts[parts.length - 1]; // π.χ. "1.jpg"

  if (!rawImages[categoryName]) {
    rawImages[categoryName] = [];
  }
  
  rawImages[categoryName].push({ url: module.default, filename: fileName });
});

export const CAT_IMAGES: Record<string, string[]> = {};

// 4. Ταξινομούμε ΑΥΣΤΗΡΑ με βάση το όνομα του αρχείου (1.jpg, 2.jpg) μέσα σε κάθε κατηγορία ξεχωριστά
Object.keys(rawImages).forEach(cat => {
  CAT_IMAGES[cat] = rawImages[cat]
    .sort((a, b) => a.filename.localeCompare(b.filename, undefined, { numeric: true, sensitivity: 'base' }))
    .map(img => img.url);
});

export const formatPrice = (n: number) =>
  n.toLocaleString("el-GR", { style: "currency", currency: "EUR" });
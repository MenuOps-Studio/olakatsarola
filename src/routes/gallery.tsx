import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, ArrowDown, Camera } from "lucide-react";
import { useI18n } from "@/lib/i18n";

// 1. Δυναμική φόρτωση όλων των εικόνων από τον φάκελο της Γκαλερί
const imageModules = import.meta.glob<{ default: string }>('@/assets/gallery/*.{jpeg,jpg,png,webp}', { eager: true });

// 2. Εξαγωγή του ονόματος αρχείου και αριθμητική ταξινόμηση (1.jpg, 2.jpg)
const rawImages = Object.entries(imageModules).map(([path, module]) => {
  const fileName = path.split('/').pop() || "";
  return { url: module.default, filename: fileName };
});

const galleryImages = rawImages
  .sort((a, b) => a.filename.localeCompare(b.filename, undefined, { numeric: true, sensitivity: 'base' }))
  .map(img => img.url);

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Γκαλερί | Όλα Κατσαρόλα Σέρρες" },
      { name: "description", content: "Δείτε φωτογραφίες από τον χώρο μας και τα πιάτα μας." }
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { t, lang } = useI18n();
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const title = t('galleryTitle' as any) || (lang === 'en' ? "Our Gallery" : lang === 'bg' ? "Нашата галерия" : "Η Γκαλερί μας");
  const sub = t('gallerySub' as any) || (lang === 'en' ? "Moments from our restaurant" : lang === 'bg' ? "Моменти от нашия ресторант" : "Στιγμές από το εστιατόριό μας");

  if (galleryImages.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground px-6 text-center">
        Δεν υπάρχουν φωτογραφίες στο φάκελο assets/gallery
      </div>
    );
  }

  return (
    <div className="w-full bg-background min-h-[calc(100dvh-64px)]">
      
      {/* 📱 ΜΟΝΟ ΓΙΑ ΚΙΝΗΤΑ (Full-screen Scroll) */}
      <div className="md:hidden no-scrollbar h-[calc(100dvh-64px)] w-full snap-y snap-mandatory overflow-y-scroll">
        {galleryImages.map((src, index) => (
          <MobileGallerySlide
            key={index}
            src={src}
            index={index}
            total={galleryImages.length}
            title={title}
            sub={sub}
            onSelectImg={setSelectedImg}
          />
        ))}
      </div>

      {/* 💻 ΜΟΝΟ ΓΙΑ ΥΠΟΛΟΓΙΣΤΕΣ/TABLET (Pinterest Masonry Layout σε ΟΛΟ το πλάτος) */}
      <div className="hidden md:block w-full px-4 md:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Header (Τίτλος) */}
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="flex items-center gap-3">
            <Camera className="h-6 w-6 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{sub}</p>
          </div>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl text-ink">{title}</h1>
        </div>

        {/* Pinterest Grid - Απλώνεται παντού και αυξάνει τις στήλες σε πολύ μεγάλες οθόνες */}
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4 md:gap-6 space-y-4 md:space-y-6">
          {galleryImages.map((src, index) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "50px" }}
              transition={{ duration: 0.5, delay: (index % 10) * 0.1, ease: "easeOut" }}
              className="relative group cursor-zoom-in break-inside-avoid overflow-hidden rounded-2xl bg-muted shadow-sm ring-1 ring-border/50"
              onClick={() => setSelectedImg(src)}
            >
              <img 
                src={src} 
                alt={`Γκαλερί ${index + 1}`} 
                className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* 🔍 LIGHTBOX MODAL (Κοινό) */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-md cursor-zoom-out"
          >
            <button 
              onClick={() => setSelectedImg(null)}
              className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-8 sm:top-8"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={selectedImg} 
              className="max-h-[90vh] max-w-[95vw] rounded-xl object-contain shadow-2xl"
              alt="Μεγέθυνση φωτογραφίας"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 📱 COMPONENT ΑΠΟΚΛΕΙΣΤΙΚΑ ΓΙΑ ΤΟ SCROLL ΤΟΥ ΚΙΝΗΤΟΥ
function MobileGallerySlide({ src, index, total, title, sub, onSelectImg }: any) {
  return (
    <div className="relative h-full w-full snap-start snap-always flex items-center justify-center p-4 pb-8 overflow-hidden">
      <div 
        className="relative z-10 h-full w-full max-w-6xl overflow-hidden rounded-3xl bg-black shadow-2xl border border-white/5 cursor-zoom-in group"
        onClick={() => onSelectImg(src)}
      >
        <img 
          src={src} 
          alt="" 
          className="absolute inset-0 h-full w-full object-cover opacity-60 blur-2xl scale-110 pointer-events-none"
        />

        <img 
          src={src} 
          alt={`Στιγμιότυπο ${index + 1}`} 
          className="relative z-10 h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
          loading={index === 0 ? "eager" : "lazy"} 
        />
        
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none" />

        <div className="absolute bottom-0 left-0 z-30 flex w-full flex-col justify-end p-6 pointer-events-none">
          {index === 0 && (
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary drop-shadow-md">
                {sub}
              </p>
              <h1 className="mt-2 text-4xl font-bold text-white drop-shadow-lg">
                {title}
              </h1>
            </div>
          )}
          
          <div className="flex items-end justify-between">
            <span className="font-display text-lg font-medium tracking-widest text-white/90">
              {String(index + 1).padStart(2, '0')} 
              <span className="mx-1.5 text-sm text-white/40">/</span> 
              <span className="text-sm text-white/60">{String(total).padStart(2, '0')}</span>
            </span>
            
            {index === 0 && total > 1 && (
              <motion.div 
                animate={{ y: [0, 8, 0] }} 
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md"
              >
                Swipe <ArrowDown className="h-4 w-4" />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
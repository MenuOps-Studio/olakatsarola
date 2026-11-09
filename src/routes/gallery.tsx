import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState } from "react";
import { X, ArrowDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";

// Φορτώνει αυτόματα ΟΛΕΣ τις εικόνες από τον φάκελο src/assets/gallery
const imageModules = import.meta.glob<{ default: string }>('@/assets/gallery/*.{jpeg,jpg,png}', { eager: true });
const galleryImages = Object.values(imageModules).map(module => module.default);

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [{ title: "Γκαλερί | Όλα Κατσαρόλα Σέρρες" }],
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
    <div className="no-scrollbar h-[calc(100dvh-64px)] w-full snap-y snap-mandatory overflow-y-scroll bg-background">
      {galleryImages.map((src, index) => (
        <GallerySlide
          key={index}
          src={src}
          index={index}
          total={galleryImages.length}
          images={galleryImages}
          title={title}
          sub={sub}
          onSelectImg={setSelectedImg}
        />
      ))}

      {/* Lightbox Modal */}
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
              className="max-h-[90vh] max-w-full rounded-xl object-contain shadow-2xl"
              alt="Μεγέθυνση φωτογραφίας"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Ξεχωριστό Component για το κάθε slide ώστε να υπολογίζει σωστά την κίνηση του ποντικιού
function GallerySlide({ src, index, total, images, title, sub, onSelectImg }: any) {
  // Διαχείριση κίνησης ποντικιού (Parallax)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  const moveX1 = useTransform(springX, [-0.5, 0.5], [-40, 40]);
  const moveY1 = useTransform(springY, [-0.5, 0.5], [-40, 40]);
  const moveX2 = useTransform(springX, [-0.5, 0.5], [30, -30]);
  const moveY2 = useTransform(springY, [-0.5, 0.5], [30, -30]);
  const moveX3 = useTransform(springX, [-0.5, 0.5], [-20, 20]);
  const moveY3 = useTransform(springY, [-0.5, 0.5], [20, -20]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX / innerWidth - 0.5);
    mouseY.set(clientY / innerHeight - 0.5);
  };

  // Επιλογή άλλων εικόνων της γκαλερί για να μπουν ως "αιωρούμενες" στο φόντο
  const bg1 = images[(index + 1) % total];
  const bg2 = images[(index + 2) % total];
  const bg3 = images[(index + 3) % total];
  const bg4 = images[(index + 4) % total];

  return (
    <div 
      className="relative h-full w-full snap-start snap-always flex items-center justify-center p-4 pb-8 md:p-8 lg:p-12 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Το Floating Background (Εμφανίζεται ΜΟΝΟ σε desktop, κρυμμένο σε κινητά) */}
      <div className="absolute inset-0 hidden md:block pointer-events-none">
        <motion.img style={{ x: moveX1, y: moveY1 }} src={bg1} className="absolute top-[5%] left-[5%] w-64 h-64 object-cover rounded-3xl opacity-20 blur-[2px]" />
        <motion.img style={{ x: moveX2, y: moveY2 }} src={bg2} className="absolute bottom-[5%] right-[5%] w-80 h-56 object-cover rounded-3xl opacity-20 blur-[2px]" />
        <motion.img style={{ x: moveX3, y: moveY3 }} src={bg3} className="absolute top-[15%] right-[10%] w-48 h-64 object-cover rounded-3xl opacity-15 blur-[4px]" />
        <motion.img style={{ x: moveX2, y: moveY1 }} src={bg4} className="absolute bottom-[15%] left-[10%] w-56 h-56 object-cover rounded-3xl opacity-10 blur-[3px]" />
      </div>

      {/* Η Κύρια Κάρτα (Μεγαλύτερο z-index για να είναι πάνω από το background) */}
      <div 
        className="relative z-10 h-full w-full max-w-6xl overflow-hidden rounded-3xl bg-ink shadow-2xl border border-white/5 cursor-zoom-in"
        onClick={() => onSelectImg(src)}
      >
        <img 
          src={src} 
          alt={`Όλα Κατσαρόλα Στιγμιότυπο ${index + 1}`} 
          // Στο κινητό: object-cover. Στο desktop: object-contain.
          className="absolute inset-0 h-full w-full object-cover md:object-contain opacity-95 transition-transform duration-700 hover:scale-105"
          loading={index === 0 ? "eager" : "lazy"} 
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/90 pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.8 }} 
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute bottom-0 left-0 flex w-full flex-col justify-end p-6 sm:p-10 pointer-events-none"
        >
          {index === 0 && (
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary drop-shadow-md">
                {sub}
              </p>
              <h1 className="mt-2 text-4xl font-bold text-white drop-shadow-lg md:text-5xl">
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
                Scroll <ArrowDown className="h-4 w-4" />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
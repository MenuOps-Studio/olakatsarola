import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

// Αυτόματη φόρτωση όλων των φωτογραφιών από τον ΚΟΙΝΟ φάκελο (src/assets/home/carousel)
const imageModules = import.meta.glob<{ default: string }>('@/assets/home/carousel/*.{jpeg,jpg,png,webp}', { eager: true });
const images = Object.values(imageModules).map(module => module.default);

export function AnimatedGallery() {
  const [activeIndex, setActiveIndex] = useState(Math.floor(images.length / 2) || 0);
  const [isMobile, setIsMobile] = useState(false);

  // Ελέγχει αν η οθόνη είναι κινητό για να αλλάξει δυναμικά την απόσταση των καρτών
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Αρχικός έλεγχος
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (images.length === 0) {
    return (
      <div className="w-full pt-8 pb-10 text-center text-muted-foreground flex items-center justify-center min-h-[300px]">
        Δεν βρέθηκαν φωτογραφίες στον φάκελο src/assets/home/carousel
      </div>
    );
  }

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50; 
    if (info.offset.x > swipeThreshold && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    } else if (info.offset.x < -swipeThreshold && activeIndex < images.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const nextSlide = () => activeIndex < images.length - 1 && setActiveIndex(activeIndex + 1);
  const prevSlide = () => activeIndex > 0 && setActiveIndex(activeIndex - 1);

  return (
    <div className="w-full pt-8 pb-10 md:pt-10 md:pb-12 bg-background overflow-hidden flex flex-col items-center">
      
      {/* Header Ενότητας */}
      <div className="w-full max-w-6xl px-4 md:px-8 mb-12 flex flex-col items-center text-center">
        <div className="flex items-center gap-3">
          <Sparkles className="h-7 w-7 text-primary" />
          <h2 className="text-3xl font-bold md:text-5xl text-ink">Η Εμπειρία μας</h2>
        </div>
        <p className="mt-4 text-muted-foreground max-w-lg">
          Κάντε swipe ή κλικ για να περιηγηθείτε στον χώρο μας.
        </p>
      </div>

      {/* 3D Carousel Container */}
      <div className="relative w-full max-w-7xl h-[400px] md:h-[550px] flex items-center justify-center perspective-[1200px]">
        <AnimatePresence initial={false}>
          {images.map((src, index) => {
            const offset = index - activeIndex;
            const absOffset = Math.abs(offset);
            const isActive = offset === 0;

            // Κρύβουμε όσες κάρτες είναι πολύ πίσω για βελτίωση απόδοσης
            if (absOffset > 2) return null;

            // Διαφορετική απόσταση καρτών για κινητό (90px) και desktop (160px)
            const xOffset = offset * (isMobile ? 90 : 160); 
            const zOffset = absOffset * -150; 
            const rotateY = offset * -25; 
            const scale = isActive ? 1 : 0.85; 
            const opacity = isActive ? 1 : 0.5 - (absOffset * 0.1); 

            return (
              <motion.div
                key={src}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
                animate={{
                  x: xOffset,
                  z: zOffset,
                  rotateY: rotateY,
                  scale: scale,
                  opacity: opacity,
                  zIndex: 20 - absOffset,
                  filter: isActive ? "blur(0px)" : "blur(4px)"
                }}
                transition={{ type: "spring", stiffness: 220, damping: 25 }}
                onClick={() => setActiveIndex(index)}
                className={`absolute h-[320px] w-[240px] md:h-[500px] md:w-[380px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/50 bg-card ${
                  isActive ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
                }`}
              >
                {/* Η Φωτογραφία, καθαρή χωρίς κείμενα */}
                <img 
                  src={src} 
                  alt={`Εμπειρία ${index + 1}`}
                  className="w-full h-full object-cover pointer-events-none" 
                />
                
                {/* Σκοτεινό Overlay ΜΟΝΟ για τις κάρτες που είναι στο βάθος */}
                <div className={`absolute inset-0 bg-black transition-opacity duration-500 ${isActive ? "opacity-0" : "opacity-40"}`} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Κουμπιά Πλοήγησης (Βελάκια και Τελίτσες) */}
      <div className="mt-8 flex items-center gap-6">
        <button 
          onClick={prevSlide}
          disabled={activeIndex === 0}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-ink shadow-sm transition-all hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Προηγούμενη φωτογραφία"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div className="flex gap-2">
          {images.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-6 bg-primary" : "w-2 bg-border cursor-pointer hover:bg-primary/50"
              }`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>

        <button 
          onClick={nextSlide}
          disabled={activeIndex === images.length - 1}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-ink shadow-sm transition-all hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Επόμενη φωτογραφία"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

    </div>
  );
}
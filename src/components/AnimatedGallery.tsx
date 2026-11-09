import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

// Εισαγωγή των τοπικών φωτογραφιών από τον φάκελο assets/gallery. 
// ΣΗΜΑΝΤΙΚΟ: Βεβαιώσου ότι τα ονόματα των αρχείων ταιριάζουν με αυτά που έχεις στον φάκελό σου.
import img1 from "@/assets/gallery/IMG_7412.jpeg"; 
import img2 from "@/assets/gallery/IMG_7469.jpeg";
import img3 from "@/assets/gallery/salad-1.jpeg";
import img4 from "@/assets/gallery/IMG_7494.jpeg";
import img5 from "@/assets/gallery/IMG_7536.jpeg";
import img6 from "@/assets/gallery/IMG_7696.jpeg";

const IMAGES = [
  { id: 1, src: img1, title: "Μοσχαράκι Κοκκινιστό", desc: "Λιώνει στο στόμα, με φρέσκο πουρέ." },
  { id: 2, src: img2, title: "Ο Χώρος Μας", desc: "Ζεστό, φιλόξενο περιβάλλον." },
  { id: 3, src: img3, title: "Φρέσκες Σαλάτες", desc: "Από ντόπιους παραγωγούς." },
  { id: 4, src: img4, title: "Χοιρινά Μπριζολάκια", desc: "Με την παραδοσιακή μας μαρινάδα." },
  { id: 5, src: img5, title: "Παραδοσιακές Γεύσεις", desc: "Συνταγές που περνούν από γενιά σε γενιά." },
  { id: 6, src: img6, title: "Εκλεκτά Κρέατα", desc: "Ποιότητα που ξεχωρίζει σε κάθε μπουκιά." },
];

export function AnimatedGallery() {
  const [activeIndex, setActiveIndex] = useState(2);

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50; 
    if (info.offset.x > swipeThreshold && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    } else if (info.offset.x < -swipeThreshold && activeIndex < IMAGES.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const nextSlide = () => activeIndex < IMAGES.length - 1 && setActiveIndex(activeIndex + 1);
  const prevSlide = () => activeIndex > 0 && setActiveIndex(activeIndex - 1);

  return (
    <div className="w-full pt-8 pb-10 md:pt-10 md:pb-12 bg-background overflow-hidden flex flex-col items-center">
      
      <div className="w-full max-w-6xl px-4 md:px-8 mb-12 flex flex-col items-center text-center">
        <div className="flex items-center gap-3">
          <Sparkles className="h-7 w-7 text-primary" />
          <h2 className="text-3xl font-bold md:text-5xl text-ink">Η Εμπειρία μας</h2>
        </div>
        <p className="mt-4 text-muted-foreground max-w-lg">
          Κάντε swipe ή κλικ για να περιηγηθείτε στις γεύσεις και τον χώρο μας.
        </p>
      </div>

      <div className="relative w-full max-w-7xl h-[400px] md:h-[550px] flex items-center justify-center perspective-[1200px]">
        <AnimatePresence initial={false}>
          {IMAGES.map((item, index) => {
            const offset = index - activeIndex;
            const absOffset = Math.abs(offset);
            const isActive = offset === 0;

            if (absOffset > 2) return null;

            const xOffset = offset * (typeof window !== "undefined" && window.innerWidth < 768 ? 90 : 160); 
            const zOffset = absOffset * -150; 
            const rotateY = offset * -25; 
            const scale = isActive ? 1 : 0.85; 
            const opacity = isActive ? 1 : 0.5 - (absOffset * 0.1); 

            return (
              <motion.div
                key={item.id}
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
                <img 
                  src={item.src} 
                  alt={item.title}
                  className="w-full h-full object-cover pointer-events-none" 
                />
                
                <div className={`absolute inset-0 bg-black transition-opacity duration-500 ${isActive ? "opacity-0" : "opacity-40"}`} />
                
                <motion.div 
                  initial={false}
                  animate={{ 
                    opacity: isActive ? 1 : 0, 
                    y: isActive ? 0 : 20 
                  }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white flex flex-col justify-end"
                >
                  <h3 className="text-xl md:text-3xl font-bold tracking-tight mb-2">{item.title}</h3>
                  <p className="text-sm md:text-base text-gray-200">{item.desc}</p>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

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
          {IMAGES.map((_, i) => (
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
          disabled={activeIndex === IMAGES.length - 1}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-ink shadow-sm transition-all hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Επόμενη φωτογραφία"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

    </div>
  );
}
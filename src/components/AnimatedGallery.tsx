import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

// 6 Εγγυημένα ενεργά links φωτογραφιών (υψηλής ανάλυσης)
const IMAGES = [
  { id: 1, src: "https://images.unsplash.com/photo-1544025162-831109a9dbd4?auto=format&fit=crop&q=80&w=1200", title: "Μοσχαράκι Κοκκινιστό", desc: "Λιώνει στο στόμα, με φρέσκο πουρέ." },
  { id: 2, src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1200", title: "Ο Χώρος Μας", desc: "Ζεστό, φιλόξενο περιβάλλον." },
  { id: 3, src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1200", title: "Φρέσκες Σαλάτες", desc: "Από ντόπιους παραγωγούς." },
  { id: 4, src: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1200", title: "Χοιρινά Μπριζολάκια", desc: "Με την παραδοσιακή μας μαρινάδα." },
  { id: 5, src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200", title: "Παραδοσιακές Γεύσεις", desc: "Συνταγές που περνούν από γενιά σε γενιά." },
  { id: 6, src: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=1200", title: "Εκλεκτά Κρέατα", desc: "Ποιότητα που ξεχωρίζει σε κάθε μπουκιά." },
];

export function AnimatedGallery() {
  const [activeIndex, setActiveIndex] = useState(2); // Ξεκινάμε με εστίαση στη μεσαία φωτογραφία

  // Λειτουργία Swipe/Drag για κινητά και ποντίκι
  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50; // Πόσο πρέπει να σύρει ο χρήστης για να αλλάξει η κάρτα
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
      
      {/* Header Ενότητας */}
      <div className="w-full max-w-6xl px-4 md:px-8 mb-12 flex flex-col items-center text-center">
        <div className="flex items-center gap-3">
          <Sparkles className="h-7 w-7 text-primary" />
          <h2 className="text-3xl font-bold md:text-5xl text-ink">Η Εμπειρία μας</h2>
        </div>
        <p className="mt-4 text-muted-foreground max-w-lg">
          Κάντε swipe ή κλικ για να περιηγηθείτε στις γεύσεις και τον χώρο μας.
        </p>
      </div>

      {/* 3D Carousel Container */}
      {/* Η κλάση perspective-[1200px] δίνει την ψευδαίσθηση του βάθους (3D) */}
      <div className="relative w-full max-w-7xl h-[400px] md:h-[550px] flex items-center justify-center perspective-[1200px]">
        <AnimatePresence initial={false}>
          {IMAGES.map((item, index) => {
            // Υπολογίζουμε πόσο απέχει η κάθε κάρτα από την κεντρική (activeIndex)
            const offset = index - activeIndex;
            const absOffset = Math.abs(offset);
            const isActive = offset === 0;

            // Αν η κάρτα είναι πάνω από 2 θέσεις μακριά, δεν την εμφανίζουμε (για επιδόσεις)
            if (absOffset > 2) return null;

            // Δυναμικές 3D Τιμές (Αλλάζουν αυτόματα στο Swipe/Click)
            const xOffset = offset * (typeof window !== "undefined" && window.innerWidth < 768 ? 90 : 160); // Πόσο δεξιά/αριστερά πάει
            const zOffset = absOffset * -150; // Βάθος προς τα πίσω
            const rotateY = offset * -25; // Γωνία κλίσης
            const scale = isActive ? 1 : 0.85; // Μέγεθος
            const opacity = isActive ? 1 : 0.5 - (absOffset * 0.1); // Ξεθώριασμα

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
                  filter: isActive ? "blur(0px)" : "blur(4px)" // Οι πλαϊνές θολώνουν
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
                
                {/* Σκοτεινό Overlay για τις μη ενεργές κάρτες */}
                <div className={`absolute inset-0 bg-black transition-opacity duration-500 ${isActive ? "opacity-0" : "opacity-40"}`} />
                
                {/* Κείμενο Κεντρικής Κάρτας */}
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

      {/* Κουμπιά Πλοήγησης (Βελάκια) στο κάτω μέρος */}
      <div className="mt-8 flex items-center gap-6">
        <button 
          onClick={prevSlide}
          disabled={activeIndex === 0}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-ink shadow-sm transition-all hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Προηγούμενη φωτογραφία"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Indicators (Τελίτσες) */}
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
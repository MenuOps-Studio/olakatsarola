import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  images: string[];
  categoryName: string;
}

export function CategoryCarousel({ images, categoryName }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Χρόνος εναλλαγής (4 δευτερόλεπτα)
    
    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative h-36 w-full md:h-48 overflow-hidden bg-muted">
      <AnimatePresence mode="popLayout">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${categoryName} - ${currentIndex + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }} // Διάρκεια του fade effect
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      </AnimatePresence>
    </div>
  );
}
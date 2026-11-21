import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  images: string[];
  categoryName: string;
}

export function CategoryCarousel({ images, categoryName }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Παρακολουθεί αν το carousel είναι ορατό στην οθόνη
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "200px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Κάνει preload την επόμενη εικόνα πριν την εναλλαγή για να μην χάνεται το fade
  useEffect(() => {
    if (!isVisible || !images || images.length <= 1) return;

    const nextIndex = (currentIndex + 1) % images.length;
    const img = new Image();
    img.src = images[nextIndex];
  }, [currentIndex, isVisible, images]);

  // Αλλάζει εικόνα ΜΟΝΟ όσο η κατηγορία είναι ορατή
  useEffect(() => {
    if (!isVisible || !images || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible, images]);

  if (!images || images.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="relative h-36 w-full md:h-48 overflow-hidden bg-muted"
    >
      <AnimatePresence initial={false} mode="sync">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${categoryName} ${currentIndex + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-cover transform-gpu will-change-[opacity]"
          loading={currentIndex === 0 ? "eager" : "lazy"}
          decoding="async"
        />
      </AnimatePresence>
    </div>
  );
}
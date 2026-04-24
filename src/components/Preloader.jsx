import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader({ onComplete }) {
  const progressRef = useRef(0);
  const barRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    let frame;
    const startTime = performance.now();
    const duration = 2200;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Eased progress (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      progressRef.current = eased;

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${eased})`;
      }
      if (textRef.current) {
        textRef.current.textContent = `${Math.round(eased * 100)}%`;
      }

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setTimeout(() => onComplete?.(), 400);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [onComplete]);

  return (
    <motion.div
      className="preloader"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="preloader-logo gradient-text"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        PRAKALP
      </motion.div>
      
      <div className="preloader-bar-container">
        <div ref={barRef} className="preloader-bar" style={{ transform: 'scaleX(0)' }} />
      </div>
      
      <motion.div
        ref={textRef}
        className="preloader-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        0%
      </motion.div>
    </motion.div>
  );
}

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    // Don't render cursor on touch devices
    if ('ontouchstart' in window) return;

    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;
    let raf;

    const onMouseMove = (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      
      // Dot follows instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${cursorX - 3}px, ${cursorY - 3}px)`;
      }
    };

    const animate = () => {
      // Cursor ring follows with smooth lag
      dotX += (cursorX - dotX) * 0.15;
      dotY += (cursorY - dotY) * 0.15;

      if (cursorRef.current) {
        const size = hovering ? 50 : 20;
        cursorRef.current.style.transform = `translate(${dotX - size/2}px, ${dotY - size/2}px)`;
      }

      raf = requestAnimationFrame(animate);
    };

    const onMouseOver = (e) => {
      const target = e.target;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('.project-card') ||
        target.closest('.dept-card')
      ) {
        setHovering(true);
      }
    };

    const onMouseOut = (e) => {
      const target = e.target;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('.project-card') ||
        target.closest('.dept-card')
      ) {
        setHovering(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(raf);
    };
  }, [hovering]);

  // Don't render on mobile
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }

  return (
    <>
      <div ref={cursorRef} className={`custom-cursor ${hovering ? 'hovering' : ''}`} />
      <div ref={dotRef} className="cursor-dot" />
    </>
  );
}

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

/* ===== EVENT DATE ===== */
const EVENT_DATE = new Date('2026-04-25T09:30:00+05:30');

/* ===== Countdown Hook ===== */
function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

function getTimeLeft(target) {
  const now = new Date();
  const diff = target - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isLive: false,
  };
}

/* ==========================================================
   CANVAS - Interactive particle constellation background
   Pure Canvas2D - no Three.js overhead, silky 60fps
   ========================================================== */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const particlesRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Create particles
    const PARTICLE_COUNT = Math.min(120, Math.floor(width * 0.06));
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
    particlesRef.current = particles;

    const CONNECTION_DIST = 150;
    const MOUSE_RADIUS = 200;

    function animate() {
      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x * width;
      const my = mouseRef.current.y * height;

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Slight mouse attraction
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const force = (1 - dist / MOUSE_RADIUS) * 0.008;
          p.vx += dx * force;
          p.vy += dy * force;
        }

        // Damping
        p.vx *= 0.99;
        p.vy *= 0.99;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const opacity = (1 - dist / CONNECTION_DIST) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw mouse glow
      const gradient = ctx.createRadialGradient(mx, my, 0, mx, my, 300);
      gradient.addColorStop(0, 'rgba(0, 212, 255, 0.03)');
      gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.015)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      rafRef.current = requestAnimationFrame(animate);
    }

    animate();

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const onMouseMove = (e) => {
      mouseRef.current.x = e.clientX / width;
      mouseRef.current.y = e.clientY / height;
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-particle-canvas" />;
}

/* ==========================================================
   HERO SECTION
   ========================================================== */
function CountdownUnit({ value, label }) {
  return (
    <div className="cd-unit">
      <span className="cd-num">{String(value).padStart(2, '0')}</span>
      <span className="cd-lbl">{label}</span>
    </div>
  );
}

export default function HeroSection() {
  const countdown = useCountdown(EVENT_DATE);

  const handleExplore = useCallback((e) => {
    e.preventDefault();
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  /* Title letter-by-letter animation */
  const title = 'PRAKALP';
  const letterVariants = {
    hidden: { opacity: 0, y: 80, rotateX: -90 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: 0.3 + i * 0.05,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay) => ({
      opacity: 1,
      y: 0,
      transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <section className="hero" id="hero">
      {/* Particle constellation background */}
      <ParticleCanvas />

      {/* Ambient gradient orbs */}
      <div className="hero-glow hero-glow--blue" />
      <div className="hero-glow hero-glow--purple" />
      <div className="hero-glow hero-glow--cyan" />

      {/* Edge fades */}
      <div className="hero-fade hero-fade--top" />
      <div className="hero-fade hero-fade--bottom" />

      {/* Content */}
      <div className="hero__inner">
        {/* Eyebrow */}
        <motion.div
          className="hero__eyebrow"
          custom={0.3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <span className="hero__eyebrow-line" />
          <span>NGIT · Dept. of Humanities & Sciences</span>
          <span className="hero__eyebrow-line" />
        </motion.div>

        {/* Title */}
        <h1 className="hero__title" aria-label="PRAKALP">
          {title.split('').map((char, i) => (
            <motion.span
              key={i}
              className="hero__letter"
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              style={{ display: 'inline-block' }}
            >
              {char}
            </motion.span>
          ))}
        </h1>

        {/* Year */}
        <motion.div
          className="hero__year"
          custom={0.3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <span className="hero__year-line" />
          <span>2 0 2 6</span>
          <span className="hero__year-line" />
        </motion.div>

        {/* Countdown */}
        <motion.div
          custom={0.3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          {!countdown.isLive ? (
            <div className="hero__countdown">
              <CountdownUnit value={countdown.days} label="Days" />
              <span className="cd-colon">:</span>
              <CountdownUnit value={countdown.hours} label="Hrs" />
              <span className="cd-colon">:</span>
              <CountdownUnit value={countdown.minutes} label="Min" />
              <span className="cd-colon">:</span>
              <CountdownUnit value={countdown.seconds} label="Sec" />
            </div>
          ) : (
            <div className="hero__live">
              <span className="hero__live-dot" />
              Event is LIVE
            </div>
          )}
        </motion.div>

        {/* CTA */}
        <motion.a
          href="#projects"
          className="hero__cta"
          onClick={handleExplore}
          custom={0.3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <span>Explore Projects</span>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 9h10M10 5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.a>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5, duration: 1.5 }}
      >
        <div className="hero__scroll-track">
          <div className="hero__scroll-thumb" />
        </div>
        <span>Scroll</span>
      </motion.div>
    </section>
  );
}

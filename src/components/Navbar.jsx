import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useScrollProgress } from '../hooks/useScrollProgress';

export default function Navbar() {
  const { scrolled } = useScrollProgress();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile nav on scroll
  useEffect(() => {
    if (mobileOpen && scrolled) {
      setMobileOpen(false);
    }
  }, [scrolled]);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 2.5 }}
    >
      <div className="nav-logo">
        <span className="logo-accent">◈</span>
        PRAKALP
      </div>

      <ul className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}>
        <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')}>About</a></li>
        <li><a href="#departments" onClick={(e) => handleNavClick(e, 'departments')}>Departments</a></li>
        <li><a href="#projects" onClick={(e) => handleNavClick(e, 'projects')}>Projects</a></li>
        <li><a href="#stats" onClick={(e) => handleNavClick(e, 'stats')}>Stats</a></li>
        <li>
          <a 
            href="#projects" 
            className="nav-cta"
            onClick={(e) => handleNavClick(e, 'projects')}
          >
            Explore Projects
          </a>
        </li>
      </ul>

      <button
        className={`mobile-nav-toggle ${mobileOpen ? 'active' : ''}`}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        <span />
        <span />
        <span />
      </button>
    </motion.nav>
  );
}

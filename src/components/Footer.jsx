import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="section-container">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="gradient-text">PRAKALP</span> 2026
          </div>

          <div className="footer-text">
            Neil Gogte Institute of Technology - Department of Humanities & Sciences
            <br />
            <span style={{ opacity: 0.5, fontSize: '0.75rem' }}>
              © 2026 NGIT. Crafted with innovation.
            </span>
          </div>

          <ul className="footer-links">
            <li><a href="#hero" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Top ↑</a></li>
            <li><a href="#projects" onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}>Projects</a></li>
            <li><a href="#stats" onClick={(e) => { e.preventDefault(); document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' }); }}>Stats</a></li>
          </ul>
        </div>
      </div>
    </motion.footer>
  );
}

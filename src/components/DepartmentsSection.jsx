import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function DepartmentsSection({ stats }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const handleClick = (dept) => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="departments-section" id="departments" ref={ref}>
      <div className="section-container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.div className="section-badge" variants={itemVariants}>
            <span className="dot" />
            Streams
          </motion.div>

          <motion.h2 className="section-title" variants={itemVariants}>
            Two Streams, <br />
            <span className="gradient-text">Infinite Possibilities</span>
          </motion.h2>

          <motion.p className="section-subtitle" variants={itemVariants}>
            Explore innovative projects across both foundational sciences and applied engineering disciplines.
          </motion.p>

          <motion.div className="dept-cards-container" variants={itemVariants}>
            <motion.div
              className="dept-card dept-basic glow-border"
              onClick={() => handleClick('Basic Sciences')}
              role="button"
              tabIndex={0}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
                e.currentTarget.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
              }}
            >
              <div className="dept-card-bg" />
              <div className="dept-card-icon">🔬</div>
              <h3 className="dept-card-title">Basic Sciences</h3>
              <p className="dept-card-desc">
                From bioplastics to smart soil analysis - explore projects rooted in
                physics, chemistry, mathematics, and environmental science.
              </p>
              <div className="dept-card-count">
                <span>◈</span>
                {stats.basicSciences} Projects
              </div>
            </motion.div>

            <motion.div
              className="dept-card dept-engineering glow-border"
              onClick={() => handleClick('Engineering')}
              role="button"
              tabIndex={0}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
                e.currentTarget.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
              }}
            >
              <div className="dept-card-bg" />
              <div className="dept-card-icon">⚡</div>
              <h3 className="dept-card-title">Engineering</h3>
              <p className="dept-card-desc">
                Drones, IoT, robotics, and satellite systems - witness the future of
                applied engineering and technology innovation.
              </p>
              <div className="dept-card-count">
                <span>◈</span>
                {stats.engineering} Projects
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

import { useState, useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

export default function ShowcaseSection({ data }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const filteredData = useMemo(() => {
    let filtered = data;

    if (filter !== 'all') {
      filtered = filtered.filter(p => p.department === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.teamNo.toLowerCase().includes(q) ||
          p.guide.toLowerCase().includes(q) ||
          p.members.some(m => m.toLowerCase().includes(q))
      );
    }

    return filtered;
  }, [data, filter, search]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="showcase-section" id="projects" ref={ref}>
      <div className="section-container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.div className="section-badge" variants={itemVariants}>
            <span className="dot" />
            Project showcase
          </motion.div>

          <motion.h2 className="section-title" variants={itemVariants}>
            Discover <span className="gradient-text">Innovation</span>
          </motion.h2>

          <motion.p className="section-subtitle" variants={itemVariants}>
            Browse through {data.length} groundbreaking projects. Search by title, team number,
            or filter by department.
          </motion.p>
        </motion.div>

        <motion.div
          className="showcase-controls"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search projects, teams, or guides..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="project-search"
            />
          </div>

          <div className="filter-buttons">
            {['all', 'Basic Sciences', 'Engineering'].map((f) => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
                id={`filter-${f.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {f === 'all' ? 'All Projects' : f}
              </button>
            ))}
          </div>
        </motion.div>

        {filteredData.length > 0 ? (
          <div className="projects-grid">
            {filteredData.map((project, i) => (
              <ProjectCard
                key={project.teamNo}
                project={project}
                index={i}
                onSelect={setSelectedProject}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3>No projects found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}

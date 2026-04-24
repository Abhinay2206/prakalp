import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

const AVATAR_COLORS = [
  'linear-gradient(135deg, #00d4ff, #0090ff)',
  'linear-gradient(135deg, #8b5cf6, #6d28d9)',
  'linear-gradient(135deg, #06ffd0, #00b894)',
  'linear-gradient(135deg, #f472b6, #ec4899)',
  'linear-gradient(135deg, #6366f1, #4f46e5)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
];

function getInitials(name) {
  // Extract just the name part (before any parenthetical ID)
  const cleanName = name.replace(/\s*\(.*?\)\s*/g, '').trim();
  const parts = cleanName.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return cleanName.substring(0, 2).toUpperCase();
}

function getCleanName(name) {
  return name.replace(/\s*\(.*?\)\s*/g, '').trim();
}

export default function ProjectCard({ project, index, onSelect }) {
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    cardRef.current.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    cardRef.current.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    }
  }, []);

  const isBasic = project.department === 'Basic Sciences';
  const displayMembers = project.members.slice(0, 4);
  const extraCount = project.members.length - 4;

  return (
    <motion.div
      ref={cardRef}
      className="project-card"
      onClick={() => onSelect(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(project)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay: Math.min(index * 0.06, 0.3),
      }}
      style={{ transition: 'transform 0.15s ease-out, border-color 0.4s ease, box-shadow 0.4s ease' }}
    >
      <div className="project-card-header">
        <span className={`project-team-no ${isBasic ? 'basic' : 'engineering'}`}>
          {project.teamNo}
        </span>
        <div className="project-card-arrow">↗</div>
      </div>

      <h3 className="project-title">{project.title}</h3>
      <div className="project-dept">{project.department}</div>

      <div className="project-members-preview">
        {displayMembers.map((member, i) => (
          <div
            key={i}
            className="member-avatar"
            style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
            title={getCleanName(member)}
          >
            {getInitials(member)}
          </div>
        ))}
        {extraCount > 0 && (
          <span className="members-count">+{extraCount}</span>
        )}
      </div>
    </motion.div>
  );
}

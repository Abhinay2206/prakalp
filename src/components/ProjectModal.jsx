import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const AVATAR_COLORS = [
  'linear-gradient(135deg, #00d4ff, #0090ff)',
  'linear-gradient(135deg, #8b5cf6, #6d28d9)',
  'linear-gradient(135deg, #06ffd0, #00b894)',
  'linear-gradient(135deg, #f472b6, #ec4899)',
  'linear-gradient(135deg, #6366f1, #4f46e5)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
];

function getInitials(name) {
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

export default function ProjectModal({ project, onClose }) {
  const isBasic = project?.department === 'Basic Sciences';

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span
                  className={`modal-team-no ${isBasic ? 'project-team-no basic' : 'project-team-no engineering'}`}
                >
                  {project.teamNo}
                </span>
              </div>
              <button className="modal-close" onClick={onClose} aria-label="Close modal">
                ✕
              </button>
            </div>

            <div className="modal-body">
              <h2 className="modal-title">{project.title}</h2>
              <p className="modal-dept">{project.department}</p>

              {/* Guide */}
              <div className="modal-section-label">Project Guide</div>
              <div className="modal-guide">
                <div className="modal-guide-avatar">
                  {getInitials(project.guide)}
                </div>
                <div className="modal-guide-info">
                  <div className="name">{project.guide}</div>
                  <div className="role">Faculty Guide</div>
                </div>
              </div>

              {/* Members */}
              <div className="modal-section-label">
                Team Members ({project.members.length})
              </div>
              <ul className="modal-members-list">
                {project.members.map((member, i) => (
                  <motion.li
                    key={i}
                    className="modal-member-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.1 + i * 0.06,
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <div
                      className="modal-member-avatar"
                      style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                    >
                      {getInitials(member)}
                    </div>
                    <span className="modal-member-name">{getCleanName(member)}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

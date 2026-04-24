import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { motion, useInView } from 'framer-motion';
import * as THREE from 'three';

/* ===== Animated DNA-like helix for the visual ===== */
function HelixVisualization() {
  const groupRef = useRef();
  const pointCount = 100;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const points1 = [];
  const points2 = [];
  for (let i = 0; i < pointCount; i++) {
    const t = (i / pointCount) * Math.PI * 4;
    const y = (i / pointCount) * 4 - 2;
    points1.push(new THREE.Vector3(Math.cos(t) * 1.2, y, Math.sin(t) * 1.2));
    points2.push(new THREE.Vector3(Math.cos(t + Math.PI) * 1.2, y, Math.sin(t + Math.PI) * 1.2));
  }

  const curve1 = new THREE.CatmullRomCurve3(points1);
  const curve2 = new THREE.CatmullRomCurve3(points2);

  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef}>
        <mesh>
          <tubeGeometry args={[curve1, 100, 0.03, 8, false]} />
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.5} transparent opacity={0.6} />
        </mesh>
        <mesh>
          <tubeGeometry args={[curve2, 100, 0.03, 8, false]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.5} transparent opacity={0.6} />
        </mesh>
        
        {/* Connection rungs */}
        {Array.from({ length: 20 }).map((_, i) => {
          const t = (i / 20) * Math.PI * 4;
          const y = (i / 20) * 4 - 2;
          const x1 = Math.cos(t) * 1.2;
          const z1 = Math.sin(t) * 1.2;
          const x2 = Math.cos(t + Math.PI) * 1.2;
          const z2 = Math.sin(t + Math.PI) * 1.2;
          
          const midX = (x1 + x2) / 2;
          const midZ = (z1 + z2) / 2;
          const len = Math.sqrt((x2-x1)**2 + (z2-z1)**2);
          const angle = Math.atan2(z2-z1, x2-x1);
          
          return (
            <mesh key={i} position={[midX, y, midZ]} rotation={[0, -angle, 0]}>
              <boxGeometry args={[len, 0.015, 0.015]} />
              <meshStandardMaterial 
                color="#06ffd0" 
                emissive="#06ffd0" 
                emissiveIntensity={0.3} 
                transparent 
                opacity={0.3} 
              />
            </mesh>
          );
        })}
        
        <pointLight position={[0, 0, 0]} color="#00d4ff" intensity={1} distance={5} />
      </group>
    </Float>
  );
}

function AboutScene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[3, 3, 3]} intensity={0.6} color="#00d4ff" />
      <pointLight position={[-3, -3, -3]} intensity={0.4} color="#8b5cf6" />
      <HelixVisualization />
    </>
  );
}

export default function AboutSection({ stats }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
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
    <section className="about-section" id="about" ref={ref}>
      <div className="section-container">
        <div className="about-grid">
          <motion.div
            className="about-visual"
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="about-visual-inner">
              <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true }}
              >
                <AboutScene />
              </Canvas>
            </div>
          </motion.div>

          <motion.div
            className="about-text"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <motion.div className="section-badge" variants={itemVariants}>
              <span className="dot" />
              About the event
            </motion.div>

            <motion.h2 className="section-title" variants={itemVariants}>
              Innovation Beyond <br />
              <span className="gradient-text">Boundaries</span>
            </motion.h2>

            <motion.p className="section-subtitle" variants={itemVariants}>
              PRAKALP 2026 is a flagship project exhibition by the Department of Humanities
              & Sciences at NGIT. It brings together the brightest minds to showcase
              innovations spanning Basic Sciences and Engineering.
            </motion.p>

            <motion.h3 variants={itemVariants}>A Platform for Tomorrow's Innovators</motion.h3>
            <motion.p className="section-subtitle" variants={itemVariants}>
              From smart soil analysis to fire-fighting robots, each project represents
              months of dedication, research, and hands-on engineering excellence.
            </motion.p>

            <motion.div className="about-highlights" variants={itemVariants}>
              <div className="highlight-item">
                <div className="number">{stats.totalTeams}</div>
                <div className="label">Projects</div>
              </div>
              <div className="highlight-item">
                <div className="number">{stats.totalStudents}</div>
                <div className="label">Students</div>
              </div>
              <div className="highlight-item">
                <div className="number">{stats.basicSciences}</div>
                <div className="label">Basic Sciences</div>
              </div>
              <div className="highlight-item">
                <div className="number">{stats.engineering}</div>
                <div className="label">Engineering</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

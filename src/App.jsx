import { useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ReactLenis } from 'lenis/react';
import { useCSVData } from './hooks/useCSVData';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import DepartmentsSection from './components/DepartmentsSection';
import ShowcaseSection from './components/ShowcaseSection';
import StatsSection from './components/StatsSection';
import Footer from './components/Footer';

function ParallaxBackgrounds() {
  const { scrollYProgress } = useScroll();
  
  // Parallax translation speeds for the background layers
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const yGrid = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);

  return (
    <>
      <motion.div 
        className="grid-bg" 
        style={{ 
          y: yGrid,
          height: '150vh',
          top: '-25vh'
        }} 
      />
      <motion.div style={{ y: y1, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div className="bg-gradient-orb bg-orb-1" />
      </motion.div>
      <motion.div style={{ y: y2, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div className="bg-gradient-orb bg-orb-2" />
      </motion.div>
      <motion.div style={{ y: y3, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div className="bg-gradient-orb bg-orb-3" />
      </motion.div>
    </>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const { data, stats, loading: dataLoading, error } = useCSVData();

  const handlePreloadComplete = () => {
    setLoading(false);
  };

  return (
    <ReactLenis root>
      <AnimatePresence mode="wait">
        {loading && <Preloader key="preloader" onComplete={handlePreloadComplete} />}
      </AnimatePresence>

      {!loading && (
        <>
          <CustomCursor />
          
          <ParallaxBackgrounds />

          <Navbar />
          
          <main>
            <HeroSection />
            <AboutSection stats={stats} />
            <DepartmentsSection stats={stats} />
            
            {!dataLoading && !error && (
              <ShowcaseSection data={data} />
            )}
            
            {error && (
              <section className="showcase-section" id="projects">
                <div className="section-container">
                  <div className="no-results">
                    <h3>Error loading data</h3>
                    <p>{error}</p>
                  </div>
                </div>
              </section>
            )}
            
            <StatsSection stats={stats} />
          </main>
          
          <Footer />
        </>
      )}
    </ReactLenis>
  );
}

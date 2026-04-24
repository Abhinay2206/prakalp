import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
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

export default function App() {
  const [loading, setLoading] = useState(true);
  const { data, stats, loading: dataLoading, error } = useCSVData();

  const handlePreloadComplete = () => {
    setLoading(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader key="preloader" onComplete={handlePreloadComplete} />}
      </AnimatePresence>

      {!loading && (
        <>
          <CustomCursor />
          
          {/* Background effects */}
          <div className="grid-bg" />
          <div className="bg-gradient-orb bg-orb-1" />
          <div className="bg-gradient-orb bg-orb-2" />
          <div className="bg-gradient-orb bg-orb-3" />

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
    </>
  );
}

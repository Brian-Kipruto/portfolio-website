import React, { useEffect, Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber'; // Keep Canvas imported directly for LoadingFallback
import './styles/main.css';
import Header from './components/Header';
import Hero from './components/Hero';
import AtomSpinner from './components/AtomSpinner'; // Correct path for AtomSpinner

// START: Lazy-loaded components definitions
// These components will only load their code when they are rendered
const ThesisProject = lazy(() => import('./components/ThesisProject'));
const RangerProject = lazy(() => import('./components/RangerProject'));
const OtherProjects = lazy(() => import('./components/OtherProjects'));
const Skills = lazy(() => import('./components/Skills'));
const Publications = lazy(() => import('./components/Publications'));
const EducationTimeline = lazy(() => import('./components/EducationTimeline'));
const Affiliations = lazy(() => import('./components/Affiliations'));
const Blog = lazy(() => import('./components/Blog'));
const Gallery = lazy(() => import('./components/Gallery'));
const CentrifugeExperience = lazy(() => import('./components/CentrifugeExperience')); // Your experience section
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer')); // Lazy load Footer as well
// END: Lazy-loaded components definitions

// Fallback component to show while a lazy-loaded component is loading
const LoadingFallback = () => (
  <div className="loading-section-fallback section-padding">
    {/* AtomSpinner needs its own Canvas to render 3D */}
    <div className="atom-spinner-canvas-wrapper">
      <Canvas camera={{ position: [0, 0, 2] }}> {/* Small canvas for the spinner */}
        <ambientLight intensity={0.8} />
        <pointLight position={[0, 0, 0]} />
        <Suspense fallback={null}> {/* Inner suspense for AtomSpinner's own loading */}
          <AtomSpinner />
        </Suspense>
      </Canvas>
    </div>
    <p className="loading-text">Loading content...</p>
  </div>
);

function App() {
  useEffect(() => {
    const handleSmoothScroll = (e) => {
      if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleSmoothScroll);

    return () => {
      document.removeEventListener('click', handleSmoothScroll);
    };
  }, []);

  return (
    <div className="App">
      <Header />
      <main>
        <Hero /> {/* Hero is not lazy-loaded as it's the first view */}
        
        {/* Wrap each lazy-loaded section in its own Suspense boundary */}
        <Suspense fallback={<LoadingFallback />}>
          <ThesisProject />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <RangerProject />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <OtherProjects />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <Skills />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <Publications />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <EducationTimeline />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <Affiliations />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <Blog />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <Gallery />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <CentrifugeExperience /> {/* Your Centrifuge experience section */}
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <Contact />
        </Suspense>
      </main>
      {/* Footer is also lazy-loaded */}
      <Suspense fallback={<div className="loading-footer-fallback">Loading Footer...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;

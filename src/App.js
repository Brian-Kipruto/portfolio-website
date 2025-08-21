import React, { useEffect } from 'react';
import './styles/main.css';
import Header from './components/Header';
import Hero from './components/Hero';
import ThesisProject from './components/ThesisProject';
import RangerProject from './components/RangerProject';
import OtherProjects from './components/OtherProjects';
import Skills from './components/Skills';
import Publications from './components/Publications';
import Affiliations from './components/Affiliations'; // Import the new component
import CentrifugeExperience from './components/CentrifugeExperience';
import Blog from './components/Blog';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';

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
        <Hero />
        <ThesisProject />
        <RangerProject />
        <OtherProjects />
        <Skills />
        <Publications />
        <Affiliations />
        <CentrifugeExperience />
        <Blog/>
        <Gallery/>
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;

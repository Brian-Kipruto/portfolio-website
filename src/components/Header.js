import React, { useState } from 'react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsMoreDropdownOpen(false);
  };

  const toggleMoreDropdown = () => {
    setIsMoreDropdownOpen(!isMoreDropdownOpen);
  };

  return (
    <header className="header">
      <nav className="nav-bar">
        <a href="#hero-section" className="logo">Brian Kipruto</a>
        
        <button className="hamburger-icon" onClick={toggleMobileMenu}>
          ☰
        </button>

        <div className={`nav-links-desktop ${isMobileMenuOpen ? 'hidden-mobile' : ''}`}>
          <a href="#thesis-project">Thesis Project</a>
          <a href="#ranger-project">R.A.N.G.E.R. Project</a>
          <a href="#other-projects">Other Projects</a>
          <a href="#skills">Skills</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>

          <div className="dropdown">
            <button className="dropbtn" onClick={toggleMoreDropdown}>
              More ▼
            </button>
            {isMoreDropdownOpen && (
              <div className="dropdown-content">
                <a href="#publications" onClick={() => setIsMoreDropdownOpen(false)}>Publications</a>
                <a href="#affiliations" onClick={() => setIsMoreDropdownOpen(false)}>Affiliations</a>
                <a href="#education-timeline" onClick={() => setIsMoreDropdownOpen(false)}>Education</a>
                <a href="#blog" onClick={() => setIsMoreDropdownOpen(false)}>Blog</a> {/* New link */}
                <a href="#gallery" onClick={() => setIsMoreDropdownOpen(false)}>Gallery</a> {/* New link */}
                <a href="https://www.researchgate.net/profile/Your_ResearchGate_Profile" target="_blank" rel="noopener noreferrer" onClick={() => setIsMoreDropdownOpen(false)}>ResearchGate</a>
                <a href="https://medium.com/@your_medium_blog" target="_blank" rel="noopener noreferrer" onClick={() => setIsMoreDropdownOpen(false)}>Medium Blog</a>
              </div>
            )}
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="mobile-menu-overlay">
            <button className="close-mobile-menu" onClick={toggleMobileMenu}>
              &times;
            </button>
            <div className="mobile-nav-links">
              <a href="#thesis-project" onClick={toggleMobileMenu}>Thesis Project</a>
              <a href="#ranger-project" onClick={toggleMobileMenu}>R.A.N.G.E.R. Project</a>
              <a href="#other-projects" onClick={toggleMobileMenu}>Other Projects</a>
              <a href="#skills" onClick={toggleMobileMenu}>Skills</a>
              <a href="#experience" onClick={toggleMobileMenu}>Experience</a>
              <a href="#contact" onClick={toggleMobileMenu}>Contact</a>
              <a href="#publications" onClick={toggleMobileMenu}>Publications</a>
              <a href="#affiliations" onClick={toggleMobileMenu}>Affiliations</a>
              <a href="#education-timeline" onClick={toggleMobileMenu}>Education</a>
              <a href="#blog" onClick={toggleMobileMenu}>Blog</a> {/* New link */}
              <a href="#gallery" onClick={toggleMobileMenu}>Gallery</a> {/* New link */}
              <a href="https://www.researchgate.net/profile/Your_ResearchGate_Profile" target="_blank" rel="noopener noreferrer" onClick={toggleMobileMenu}>ResearchGate</a>
              <a href="https://medium.com/@your_medium_blog" target="_blank" rel="noopener noreferrer" onClick={toggleMobileMenu}>Medium Blog</a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;

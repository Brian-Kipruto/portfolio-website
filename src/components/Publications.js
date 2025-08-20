import React from 'react';
import './../styles/main.css'; // Ensure CSS is linked

const Publications = () => {
  // You can populate this with actual publication data later
  const futurePublications = [
    {
      id: 1,
      title: 'Application of Machine Learning for Rapid Performance Prediction of Flexible Graded-Z Composites',
      journal: 'Masters Thesis, University of Nairobi',
      year: 'Expected 2027',
      status: 'In Progress',
      link: '#', // Link to thesis defense or abstract
    },
    {
      id: 2,
      title: 'Robotic Autonomous Navigator for Geospatial Environmental Reconnaissance (R.A.N.G.E.R.)',
      journal: 'ByteAnza LTD',
      year: '2025',
      status: 'In progress',
      link: '#', // Link to project paper or abstract
    },
    {
      id: 3,
      title: 'Exploring Advanced Shielding Materials for space based Nuclear propulsion Systems',
      journal: 'Future Research Paper',
      year: 'TBD',
      status: 'Planned',
      link: '#',
    },
  ];

  return (
    <section id="publications" className="section-padding">
      <div className="container">
        <h2 className="section-title">Publications & Research</h2>
        <p className="section-description">
          Here you'll find a list of my academic publications, research papers, and contributions to the scientific community.
        </p>
        <div className="publications-list">
          {futurePublications.map(pub => (
            <div key={pub.id} className="publication-item">
              <h3>{pub.title}</h3>
              <p className="publication-meta">
                {pub.journal} | {pub.year} | <span className={`publication-status ${pub.status.toLowerCase().replace(/\s/g, '-')}`}>{pub.status}</span>
              </p>
              <p className="publication-description">{pub.description}</p>
              {pub.link !== '#' && (
                <a href={pub.link} target="_blank" rel="noopener noreferrer" className="publication-link">
                  View Publication &rarr;
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Publications;

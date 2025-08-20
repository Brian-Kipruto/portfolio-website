import React, { useState } from 'react';
import './../styles/main.css'; // Ensure CSS is linked

const projectsData = [
  {
    id: 1,
    name: 'Learning Management System (LMS)',
    description: 'Developed a robust LMS platform currently in use, featuring user authentication, course management, content delivery, and progress tracking.',
    category: 'Software Development',
    link: 'https://bytelab.byteanza.com/', 
    image: '/images/Capture.PNG' 
  },
  {
    id: 2,
    name: 'R.A.N.G.E.R Software',
    description: 'An innovative project delivering smart, autonomous agricultural solutions for small- and medium-scale farmers, recognized in national competitions.',
    category: 'IoT/Robotics',
    link: 'https://bytelab.byteanza.com/', 
    image: '/images/kargi.PNG' 
  },
  {
    id: 3,
    name: 'Personal Portfolio Website',
    description: 'A dynamic and interactive portfolio showcasing my scientific research and development skills using React and Three.js.',
    category: 'Web Development',
    link: 'https://github.com/Brian-Kipruto', // Link to your GitHub (or this repo once deployed)
    image: '/images/portfolio.PNG' // Placeholder image
  },
  {
    id: 4,
    name: 'Colloidal Particulate Structure Detection',
    description: 'Machine learning application for particulate structure detection in colloidal solutions, involving data analytics and neural network implementation.',
    category: 'Machine Learning',
    link: '#', // Replace with actual link
    image: 'https://placehold.co/400x250/24252A/E4E6EB?text=ML+Research' // Placeholder image
  },
  // Add more projects here with relevant categories
];

const OtherProjects = () => {
  const [filter, setFilter] = useState('All');

  const filteredProjects = projectsData.filter(project => {
    if (filter === 'All') {
      return true;
    }
    return project.category === filter;
  });

  const categories = ['All', 'Web Development', 'Software Development', 'IoT/Robotics', 'Machine Learning']; // Define all categories

  return (
    <section id="other-projects" className="section-padding">
      <div className="container">
        <h2 className="section-title">Some other projects I've done</h2>
        
        <div className="filter-buttons">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {filteredProjects.map(project => (
            <div key={project.id} className="project-card">
              <img src={project.image} alt={project.name} className="project-image" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x250/24252A/E4E6EB?text=Image+Not+Found"; }} />
              <div className="card-content">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                  View Project &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OtherProjects;

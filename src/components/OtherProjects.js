import React, { useState } from 'react';
import './../styles/main.css';

const projectsData = [
  {
    id: 1,
    name: 'Learning Management System (LMS)',
    description: [
      'Developed a dynamic and supportive learning ecosystem powered by a robust backend.',
      '<strong>Asynchronous Architecture:</strong> Leveraged Celery and Redis for non-blocking background tasks (e.g., automated weekly progress reports to parents).', // Changed ** to <strong>
      '<strong>Interactive Codepad:</strong> A hands-on coding environment with an embedded Simulator, allowing students to write and test code directly in the browser.', // Changed ** to <strong>
      '<strong>Full-Featured Bootcamp App:</strong> An immersive experience with daily schedules, project submissions, and a gamification system (points, badges) for student engagement.', // Changed ** to <strong>
      '<strong>Complete E-commerce Shop:</strong> A fully functional shop with multi-step checkout and asynchronous Daraja M-Pesa integration for non-blocking, real-time payments.', // Changed ** to <strong>
      '<strong>Innovation Incubator:</strong> A collaborative space for students to propose original project ideas, form teams, and receive mentorship from instructors.', // Changed ** to <strong>
    ],
    category: 'Software Development',
    link: '#',
    image: '/images/Capture.PNG'
  },
  {
    id: 2,
    name: 'Smart Agriculture System (Bytegrow)',
    description: 'An innovative project delivering smart, autonomous agricultural solutions for small- and medium-scale farmers, recognized in national competitions.',
    category: 'IoT/Robotics',
    link: 'https://byteanza.com/research/portfolio-details.html',
    image: 'https://placehold.co/400x250/24252A/E4E6EB?text=Bytegrow+Project'
  },
  {
    id: 3,
    name: 'Personal Portfolio Website',
    description: 'A dynamic and interactive portfolio showcasing my scientific research and development skills using React and Three.js.',
    category: 'Web Development',
    link: 'https://github.com/Ruto20',
    image: 'https://placehold.co/400x250/24252A/E4E6EB?text=Portfolio+Website'
  },
  {
    id: 4,
    name: 'Colloidal Particulate Structure Detection',
    description: 'Machine learning application for particulate structure detection in colloidal solutions, involving data analytics and neural network implementation.',
    category: 'Machine Learning',
    link: '#',
    image: 'https://placehold.co/400x250/24252A/E4E6EB?text=ML+Research'
  },
];

const OtherProjects = () => {
  const [filter, setFilter] = useState('All');

  const filteredProjects = projectsData.filter(project => {
    if (filter === 'All') {
      return true;
    }
    return project.category === filter;
  });

  const categories = ['All', 'Web Development', 'Software Development', 'IoT/Robotics', 'Machine Learning'];

  return (
    <section id="other-projects" className="section-padding">
      <div className="container">
        <h2 className="section-title">Some of my recent projects</h2>
        
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
                {/* START: Corrected conditional rendering for description */}
                {Array.isArray(project.description) ? (
                  <ul className="project-description-list">
                    {project.description.map((item, index) => (
                      <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                  </ul>
                ) : (
                  <p>{project.description}</p>
                )}
                {/* END: Corrected conditional rendering for description */}
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
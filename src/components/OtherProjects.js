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
    link: 'https://bytelab.byteanza.com/',
    image: '/images/Capture.PNG'
  },
  {
    id: 2,
    name: 'R.A.N.G.E.R Software',
    description: [
      'The goal here was to build a web-based control and monitoring interface for the R.A.N.G.E.R <strong>(Robotic Autonomous  Navigator for Geospatial Environmental Reconnaissance)</strong>. The architecture comprises of: ',
      '<strong>Backend:</strong> Python (v3.12) using the Django web framework (v4.2.x). Real-time communication is handled by Django Channels (using the Daphne ASGI server) with a Ping-Pong mechanism for connection stability. Serial communication with the Arduino is managed by the pyserial library.',
      '<strong>Database:</strong> MySQL/MariaDB (specifically Ranger_db, currently running locally on MariaDB v10.4.32). Stores user credentials, robot information, and logged sensor data. Managed via phpMyAdmin. I recently migrated data access to usse django ORM',
      '<strong>Frontend:</strong> Standard HTML5, CSS3, and extensive vanilla JavaScript. Dynamic maps are rendered using Leaflet.js, and data visualizations use Chart.js. Features a chatbot interface (R.A.N.G.E.R. Assistant) for querying data via Google Gemini API. Displays Target Robot ID in the header.'


     ],
    category: 'Software Development',
    link: 'https://youtu.be/9DqESTCRMgg',
    image: '/images/kargi.png'
  },
  {
    id: 3,
    name: 'Personal Portfolio Website',
    description: 'A dynamic and interactive portfolio showcasing my scientific research and development skills journey using React and Three.js.',
    category: 'Web Development',
    link: 'https://github.com/Brian-Kipruto',
    image: '/images/portfolio.PNG'
  },
  {
    id: 4,
    name: 'Colloidal Particulate Structure Detection',
    description: 'Machine learning application for particulate structure detection in colloidal solutions, involving data analytics and neural network implementation.',
    category: 'Machine Learning',
    link: '#',
    image: '/images/dl.jpeg'
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
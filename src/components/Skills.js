import React, { useState } from 'react';
import './../styles/main.css';

const skillsData = [
  {
    id: 'cpp',
    name: 'C++',
    icon: 'C++',
    category: 'Programming Languages',
    description: 'I appreciate C++ for its performance and control over system resources, which is crucial in scientific computing and real-time robotics like the R.A.N.G.E.R. project. I think Its efficiency is unmatched for complex simulations.',
  },
  {
    id: 'arduino',
    name: 'Arduino',
    icon: '⚙️',
    category: 'Programming Languages',
    description: 'Arduino allows me to quickly prototype hardware solutions for IoT and robotics. I love its simplicity and vast community resources. I used it in projects Bytegrow and R.A.N.G.E.R.',
  },
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    category: 'Programming Languages',
    description: 'Python is my go-to for data analysis, machine learning, and backend development. Its extensive libraries (like NumPy, Pandas, TensorFlow) are indispensable for my nuclear physics research and ML model development.',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: 'JS',
    category: 'Programming Languages',
    description: 'I dont care what pple say but vanilla JavaScript is where its at😂. It has enabled me to build dynamic, interactive web interfaces like RANGERs dashboard.',
  },
  {
    id: 'reactjs',
    name: 'React.js',
    icon: '⚛️',
    category: 'Programming Languages',
    description: 'I got into using React.js quite recently and I think its component-based approach makes development efficient and scalable, allowing for complex UIs like this portfolio.',
  },
  {
    id: 'html',
    name: 'HTML',
    icon: '📄',
    category: 'Programming Languages',
    description: 'Proficient in structuring web content using HTML5, ensuring semantic and accessible markup for robust web applications and dynamic interfaces.',
  },
  {
    id: 'css',
    name: 'CSS',
    icon: '🎨',
    category: 'Programming Languages',
    description: 'Skilled in styling web applications with CSS3, including responsive design, animations, and modern layout techniques to create visually appealing and user-friendly interfaces.',
  },
  {
    id: 'raspberry_pi',
    name: 'Raspberry Pi',
    icon: '🍓',
    category: 'Programming Languages',
    description: 'Experienced in programming Raspberry Pi for on-board computing, sensor integration, and server handling in robotic systems like R.A.N.G.E.R. Its versatility makes it ideal for embedded development.',
  },
  {
    id: 'geant4',
    name: 'GEANT4',
    icon: '⚛️',
    category: 'Software & Tools',
    description: 'Ok this is one software I have very recently come to love and I am actively learning. It allows for high-fidelity particle transport simulations. Its power is critical for modeling radiation interactions in my Masters thesis, allowing virtual prototyping of shielding materials.',
  },
 
  {
    id: 'google_gemini',
    name: 'Google Gemini',
    icon: '✨', 
    category: 'Software & Tools',
    description: 'Utilizing Google Gemini for advanced AI capabilities, particularly in natural language understanding and contextualization for the R.A.N.G.E.R. project\'s intelligent assistant. Its multimodal reasoning is a key asset.',
  },
  
  {
    id: 'slack',
    name: 'Slack',
    icon: '💬',
    category: 'Software & Tools',
    description: 'An essential communication and collaboration tool for team-based projects. Its integration capabilities streamline workflows and enhance team coordination. Although that notification sound gives me anxiety at times😂',
  },
  {
    id: 'xgboost',
    name: 'XGBoost',
    icon: '📈',
    category: 'Software & Tools',
    description: 'Like GEANT 4, i have started gaining experience with Gradient Boosting machines (specifically XGBoost) quite recently. It allows for high-performance gradient boosting and is a key tool in my Masters thesis for rapid prediction of radiation shielding performance, known for its speed and accuracy.',
  },
  {
    id: 'latin_hypercube_sampling',
    name: 'Latin Hypercube Sampling',
    icon: '🎲',
    category: 'Software & Tools',
    description: 'I am utilizing Latin Hypercube Sampling for efficient and representative data generation in high-dimensional design spaces, crucial for training robust machine learning models in my research.',
  },
  {
    id: 'mysql',
    name: 'MySQL',
    icon: '🗄️',
    category: 'Software & Tools',
    description: 'Proficient in MySQL for relational database management, designing schemas, and querying data. Essential for backend data storage in web applications like the R.A.N.G.E.R. platform.',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    icon: '🐘',
    category: 'Software & Tools',
    description: 'Experienced with PostgreSQL, valuing its robustness, extensibility, and advanced features for complex data handling and integrity, suitable for scalable applications.',
  },
  {
    id: 'django',
    name: 'Django',
    icon: '🕸️',
    category: 'Software & Tools',
    description: 'My primary framework for building robust and scalable web backends with Python. Django’s "batteries-included" approach accelerates development, as demonstrated in the R.A.N.G.E.R. web platform.',
  },
  {
    id: 'physics_research',
    name: 'Physics Research',
    icon: '🔬',
    category: 'Research & Analysis',
    description: 'My foundation in physics research drives my analytical approach to problem-solving. I enjoy delving into complex systems and applying scientific methodology to real-world challenges.',
  },
  {
    id: 'qual_quant_analysis',
    name: 'Qualitative & Quantitative Analysis',
    icon: '📊',
    category: 'Research & Analysis',
    description: 'Proficient in both qualitative and quantitative analysis, enabling me to interpret diverse datasets, identify patterns, and draw evidence-based conclusions for research and project development.',
  },
  {
    id: 'data_viz',
    name: 'Data Analysis & Visualization',
    icon: '📈',
    category: 'Research & Analysis',
    description: 'I transform raw data into actionable insights and compelling visualizations. This skill is vital for understanding environmental radiation, ML model performance, and smart agriculture data.',
  },
  {
    id: 'design_thinking',
    name: 'Design Thinking',
    icon: '💡',
    category: 'Other Competencies',
    description: 'Applying design thinking principles allows me to approach complex problems with a human-centered focus, leading to innovative and user-friendly solutions in my projects.',
  },
  {
    id: 'ai',
    name: 'AI',
    icon: '🧠',
    category: 'Other Competencies',
    description: 'My interest in AI spans from machine learning model development for radiation shielding to integrating AI assistants in robotics. I believe AI is key to future technological innovation.',
  },
  {
    id: 'iot',
    name: 'IoT',
    icon: '🌐',
    category: 'Other Competencies',
    description: 'I have hands-on experience in IoT, connecting physical devices to digital platforms for data collection and automation, as demonstrated in my smart agriculture projects.',
  },
  {
    id: 'project_management',
    name: 'Project Management',
    icon: '✅',
    category: 'Other Competencies',
    description: 'Skilled in planning, executing, and overseeing projects from conception to completion, ensuring milestones are met and objectives achieved, as demonstrated in ByteAnza research initiatives.',
  },
];

const Skills = () => {
  const [activeSkill, setActiveSkill] = useState(null);

  const toggleSkillDescription = (skillId) => {
    setActiveSkill(activeSkill === skillId ? null : skillId);
  };

  const categorizedSkills = skillsData.reduce((acc, skill) => {
    (acc[skill.category] = acc[skill.category] || []).push(skill);
    return acc;
  }, {});

  const categoriesOrder = [
    'Programming Languages',
    'Software & Tools',
    'Research & Analysis',
    'Other Competencies',
  ];

  return (
    <section id="skills" className="section-padding">
      <div className="container">
        <h2 className="section-title">What I can do</h2>
        
        {categoriesOrder.map(category => categorizedSkills[category] && (
          <div key={category} className="skill-category">
            <h3>{category}</h3>
            <div className="skills-grid">
              {categorizedSkills[category].map((skill) => (
                <div
                  key={skill.id}
                  className={`skill-item ${activeSkill === skill.id ? 'active' : ''}`}
                  onClick={() => toggleSkillDescription(skill.id)}
                >
                  <span className="skill-icon">{skill.icon}</span>
                  <span className="skill-text">{skill.name}</span>
                  {activeSkill === skill.id && (
                    <div className="skill-item-description">
                      {skill.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;

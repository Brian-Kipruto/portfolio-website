import React, { useRef, Suspense, useState, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

// Extend Line_ for drawing lines in Three.js
extend({ Line_: THREE.Line });

// Data for your experience items (extracted from your current Experience.js)
const experienceData = [
  {
    id: 1,
    title: 'Autonomous Radiation Mapping Robot - ByteAnza Research',
    date: 'Jan 2025 - Present',
    description: 'Leading the design and development of a semi-autonomous robotic system for environmental radiation mapping in Marsabit County, Kenya. This project directly applies principles of nuclear physics and radiation detection.',
  },
  {
    id: 2,
    title: 'STEM Educator, The Bytelab',
    date: 'Nov 2023 - Present',
    description: 'Led the planning, development, and execution of dynamic STEM education programs for young learners, encompassing electronics, coding, robotics, and IoT.',
  },
  {
    id: 3,
    title: 'Scientific Researcher, ByteAnza',
    date: 'Jan 2023 - Nov 2023',
    description: 'Led the research, development, and implementation of Bytegrow, an innovative project delivering smart, autonomous agricultural solutions for small- and medium-scale farmers.',
  },
  {
    id: 4,
    title: 'Machine Learning Research Intern, University of Konstanz',
    date: 'May 2022 - Aug 2022',
    description: 'Contributed to a research project focused on machine learning applications for particulate structure detection in colloidal solutions.',
  },
  // You can add more items here
];

// Component for a single experience card attached to the centrifuge
const ExperienceCard = ({ data, position, rotationY }) => {
  const ref = useRef();
  const [active, setActive] = useState(false);

  return (
    <group position={position} rotation-y={rotationY}>
      <Html center wrapperClass="experience-card-html">
        <div className={`experience-card ${active ? 'active' : ''}`} onClick={() => setActive(!active)}>
          <h3>{data.title}</h3>
          <p className="experience-card-date">{data.date}</p>
          {active && <p className="experience-card-description">{data.description}</p>}
          <button className="expand-btn">{active ? 'Collapse ▲' : 'Expand ▼'}</button>
        </div>
      </Html>
    </group>
  );
};

// The main Centrifuge model and animation
const Centrifuge = ({ experienceItems }) => {
  const centrifugeRef = useRef();
  const rotationSpeed = 0.05; // Adjust speed of centrifuge rotation

  // Define radius here so it's accessible to all parts of the component
  const radius = 2; 

  useFrame((state, delta) => {
    if (centrifugeRef.current) {
      centrifugeRef.current.rotation.y += rotationSpeed * delta;
    }
  });

  // Calculate positions for experience cards around the centrifuge
  const cardPositions = useMemo(() => {
    const positions = [];
    const numCards = experienceItems.length;
    for (let i = 0; i < numCards; i++) {
      const angle = (i / numCards) * Math.PI * 2;
      positions.push({
        position: [Math.sin(angle) * radius, 0, Math.cos(angle) * radius],
        rotationY: angle, // Initial rotation to face outwards
      });
    }
    return positions;
  }, [experienceItems, radius]); // Add radius to dependency array

  return (
    <group ref={centrifugeRef}>
      {/* Central Cylinder */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 2, 32]} />
        <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Rotating Arms (simplified) */}
      {cardPositions.map((pos, index) => (
        <React.Fragment key={index}>
          <mesh position={[pos.position[0] / 2, 0, pos.position[2] / 2]} rotation-y={pos.rotationY}>
            <boxGeometry args={[radius - 0.5, 0.1, 0.1]} /> {/* Arm extending to card */}
            <meshStandardMaterial color="#666666" />
          </mesh>
          <ExperienceCard data={experienceItems[index]} position={pos.position} rotationY={pos.rotationY} />
        </React.Fragment>
      ))}

      {/* "Danger Radiation" Sticker (Example) */}
      <Html position={[0, 1.1, 0.5]} wrapperClass="radiation-sticker-html">
        <div className="radiation-sticker">
          ☢️ DANGER RADIOACTIVE MATERIAL ☢️
        </div>
      </Html>
    </group>
  );
};

const CentrifugeExperience = () => {
  return (
    <section id="experience" className="project-section"> {/* Re-using project-section styles */}
      <div className="container project-content">
        <h2 className="section-title">Experience & Projects</h2>
        <p className="section-description">
          Explore my professional journey and key projects through this interactive centrifuge. Click on each card to expand details.
        </p>
      </div>
      <div className="project-canvas"> {/* Re-using project-canvas styles */}
        <Canvas camera={{ position: [0, 0, 4] }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} castShadow />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />
          
          <Suspense fallback={null}>
            <Centrifuge experienceItems={experienceData} />
          </Suspense>
          
          {/* Ensure OrbitControls is rendered directly inside Canvas */}
          <OrbitControls enableZoom={true} enablePan={false} />
        </Canvas>
      </div>
    </section>
  );
};

export default CentrifugeExperience;

import React, { useRef, useState, Suspense, useMemo } from 'react';
import { Canvas, useFrame, } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

// Data for your educational stages
const educationStages = [
  { id: 'primary', name: 'Primary School', years: '2010 - 2013', details: 'I attended Naivasha Boys Boarding Priamry school & I like to think that these were my foundational years that built my early learning habits.', radius: 1.0, color: '#FF5722' },
  { id: 'secondary', name: 'High School Diploma', years: '2014 - 2017', details: 'I attended st Joseph Boys National School in Kitale. This is where I kinda fell in love with physics', radius: 1.5, color: '#00BFFF' }, // Accent Blue
  { id: 'uon_ug', name: 'UoN Undergraduate', years: '2018 - 2023', details: 'BSc Astrophysics - Deep dive into cosmic phenomenon and developed analytical skills. I also came to love the concept of particles though the nuclear physics unit,', radius: 2.0, color: '#00BF63' }, // Accent Green
  { id: 'uon_msc', name: 'UoN MSc', years: '2025 - 2027', details: 'MSc Nuclear Science & Technology - Here is where I am right now. I am focused on the virtual prototyping of flexible Graded-Z Composites.', radius: 2.5, color: '#E4E6EB' }, // Off-white
];

// Component for a single orbital path
const OrbitalPath = ({ radius, color, name, years, isActive, onClick }) => {
  const ref = useRef();
  const circlePoints = useMemo(() => {
    const points = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(radius * Math.cos(angle), 0, radius * Math.sin(angle)));
    }
    return points;
  }, [radius]);

  return (
    <group rotation-x={Math.PI / 2}> {/* Rotate to make circles horizontal */}
      <lineLoop>
        <bufferGeometry attach="geometry" args={[new THREE.BufferGeometry().setFromPoints(circlePoints)]} />
        <lineBasicMaterial attach="material" color={isActive ? color : new THREE.Color(color).lerp(new THREE.Color(0x18191D), 0.7)} transparent opacity={isActive ? 0.8 : 0.3} linewidth={2} />
      </lineLoop>
      <Html position={[radius + 0.2, 0, 0]} center wrapperClass="orbital-label-html">
        <div className={`orbital-label ${isActive ? 'active' : ''}`} onClick={onClick}>
          <p>{name}</p>
          <p className="orbital-years">{years}</p>
        </div>
      </Html>
    </group>
  );
};

// The moving particle (representing Brian)
const UserParticle = ({ activeStage, stages }) => {
  const particleRef = useRef();
  const currentStage = stages.find(s => s.id === activeStage);
  const orbitSpeed = 0.5; // Speed of particle around orbit

  useFrame((state) => {
    if (particleRef.current && currentStage) {
      const time = state.clock.elapsedTime * orbitSpeed;
      const x = currentStage.radius * Math.cos(time);
      const z = currentStage.radius * Math.sin(time);
      particleRef.current.position.set(x, 0, z);

      // Optional: Add a subtle glow/trail effect to the particle
      particleRef.current.material.color.set(currentStage.color);
      particleRef.current.material.emissive.set(currentStage.color);
      particleRef.current.material.emissiveIntensity = Math.sin(time * 5) * 0.2 + 0.8;
    }
  });

  return (
    <mesh ref={particleRef}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial color={currentStage?.color || '#E4E6EB'} emissive={currentStage?.color || '#E4E6EB'} emissiveIntensity={0.5} />
    </mesh>
  );
};

const EducationTimeline = () => {
  const [activeStageId, setActiveStageId] = useState(educationStages[0].id); // Start at primary school
  const [activeStageDetails, setActiveStageDetails] = useState(educationStages[0]);

  const handleOrbitalClick = (stageId) => {
    setActiveStageId(stageId);
    setActiveStageDetails(educationStages.find(s => s.id === stageId));
  };

  return (
    <section id="education-timeline" className="project-section">
      <div className="container project-content">
        <h2 className="section-title">My Educational Journey</h2>
        <p className="section-description">
          Explore my academic path through a unique particle accelerator visualization. Click on each orbital to learn more about that stage.
        </p>
      </div>
      <div className="project-canvas">
        <Canvas camera={{ position: [0, 3, 3], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={0.8} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />
          
          {/* Central Nucleus */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color="#FF5722" emissive="#FF5722" emissiveIntensity={0.8} /> {/* Glowing nucleus */}
          </mesh>

          <Suspense fallback={null}>
            {educationStages.map(stage => (
              <OrbitalPath
                key={stage.id}
                radius={stage.radius}
                color={stage.color}
                name={stage.name}
                years={stage.years}
                isActive={activeStageId === stage.id}
                onClick={() => handleOrbitalClick(stage.id)}
              />
            ))}
            <UserParticle activeStage={activeStageId} stages={educationStages} />
          </Suspense>
          <OrbitControls enableZoom={true} enablePan={true} /> {/* OrbitControls directly here */}
          
        </Canvas>
      </div>

      {/* Details Card below the canvas */}
      {activeStageDetails && (
        <div className="container education-details-card">
          <h3>{activeStageDetails.name} ({activeStageDetails.years})</h3>
          <p>{activeStageDetails.details}</p>
        </div>
      )}
    </section>
  );
};

export default EducationTimeline;

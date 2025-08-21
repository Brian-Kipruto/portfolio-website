import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber'; // Removed useThree
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

// Data for your affiliations
const affiliationsData = [
  {
    id: 'uon',
    name: 'University of Nairobi',
    logo: '/images/logos/UoN.jpeg', // Placeholder logo
    details: 'MSc Nuclear Science & Technology Student (Aug 2025-Aug 2027), BSc Astrophysics (Sep 2019-Sep 2023).',
    link: 'https://www.uonbi.ac.ke/',
  },
  {
    id: 'byteanza',
    name: 'ByteAnza Research',
    logo: '/images/logos/research.png', // Placeholder logo
    details: 'Lead Developer for Autonomous Radiation Mapping Robot & Scientific Researcher for Smart Agriculture System. (Jan 2023 - Present)',
    link: 'https://byteanza.com/',
  },
  {
    id: 'nsk',
    name: 'Nuclear Society of Kenya',
    logo: '/images/logos/nsk.jpeg', // Placeholder logo
    details: 'Active Member, involved in public outreach, professional development, and policy advocacy. (Jan 2025 - Present)',
    link: 'https://nuclearsocietyofkenya.org/', // Assuming a website
  },
  {
    id: 'bytelab',
    name: 'The Bytelab',
    logo: '/images/logos/bytelab.png', // Placeholder logo
    details: 'STEM Educator, leading dynamic programs in electronics, coding, robotics, and IoT. (Nov 2023 - Present)',
    link: 'http://www.byteanza.com/bytelab/',
  },
  {
    id: 'konstanz',
    name: 'University of Konstanz',
    logo: '/images/logos/konstanz_logo.png', // Placeholder logo
    details: 'Machine Learning Research Intern & Project Team Member. (May 2022 - Aug 2022)',
    link: 'https://www.uni-konstanz.de/',
  },
];

// Electron Cloud Component - Stable version that avoids hooks issues
const ElectronCloud = ({ position, hoveredId, affiliationId }) => {
  const meshRef = useRef();
  const particleCount = 200;
  const radius = 0.8;
  const maxInfluence = 0.5;

  const initialPositions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(theta);
    }
    return positions;
  }, []);

  // Initialize colors array with base color
  const colors = useMemo(() => {
    const colorArray = new Float32Array(particleCount * 3);
    const initialColor = new THREE.Color('#00BFFF'); // Base color (Accent Blue)
    for (let i = 0; i < particleCount; i++) {
      colorArray[i * 3] = initialColor.r;
      colorArray[i * 3 + 1] = initialColor.g;
      colorArray[i * 3 + 2] = initialColor.b;
    }
    return colorArray;
  }, []);

  const baseColor = useMemo(() => new THREE.Color('#00BFFF'), []);
  const highlightColor = useMemo(() => new THREE.Color('#00BF63'), []);

  useFrame((state) => {
    const { clock } = state;
    if (meshRef.current) {
      const positionsArray = meshRef.current.geometry.attributes.position.array;
      const colorsArray = meshRef.current.geometry.attributes.color.array;
      const currentInfluence = hoveredId === affiliationId ? 1 : 0;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = initialPositions[i3];
        const y = initialPositions[i3 + 1];
        const z = initialPositions[i3 + 2];

        const timeOffset = clock.elapsedTime * 0.5;
        const speedFactor = hoveredId === affiliationId ? 2 : 0.5;
        const displacement = Math.sin(timeOffset * speedFactor + i) * maxInfluence * currentInfluence;

        positionsArray[i3] = x + displacement * Math.sin(timeOffset);
        positionsArray[i3 + 1] = y + displacement * Math.cos(timeOffset);
        positionsArray[i3 + 2] = z + displacement * Math.sin(timeOffset * 0.7);

        const particleColor = new THREE.Color();
        particleColor.copy(baseColor).lerp(highlightColor, currentInfluence);
        
        colorsArray[i3] = particleColor.r;
        colorsArray[i3 + 1] = particleColor.g;
        colorsArray[i3 + 2] = particleColor.b;
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true;
      meshRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  return (
    <points ref={meshRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={initialPositions}
          count={initialPositions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={colors.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial vertexColors={true} size={0.05} sizeAttenuation={true} transparent opacity={0.7} />
    </points>
  );
};

// Affiliation Logo and Info Card
const AffiliationItem = ({ data, position, onHover, onLeave, onClick, hoveredId, activeId }) => {
  const isActive = activeId === data.id;

  return (
    <group position={position}>
      {/* The logo container HTML. This is where hover/click should be detected. */}
      <Html center wrapperClass="affiliation-logo-html"
        onPointerOver={() => onHover(data.id)}
        onPointerOut={() => onLeave()}
        onClick={() => onClick(data.id)}
      >
        <div className="affiliation-logo-container">
          <img src={data.logo} alt={data.name} className="affiliation-logo" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/18191D/E4E6EB?text=Logo"; }} />
        </div>
      </Html>

      {/* Info card HTML. It should be visible when active. */}
      {isActive && (
        <Html position={[0, -1.5, 0]} center wrapperClass="affiliation-info-html-card">
          <div className="affiliation-info-card">
            <h3>{data.name}</h3>
            <p>{data.details}</p>
            {data.link && (
              <a href={data.link} target="_blank" rel="noopener noreferrer" className="affiliation-link">
                Visit Website &rarr;
              </a>
            )}
            <button className="close-info-btn" onClick={(e) => { e.stopPropagation(); onClick(null); }}>X</button>
          </div>
        </Html>
      )}

      {/* Electron Cloud around the logo - no Suspense here */}
      <ElectronCloud position={[0, 0, 0]} hoveredId={hoveredId} affiliationId={data.id} />
    </group>
  );
};

const Affiliations = () => {
  const [hoveredAffiliation, setHoveredAffiliation] = useState(null);
  const [activeAffiliation, setActiveAffiliation] = useState(null);

  const handleHover = (id) => setHoveredAffiliation(id);
  const handleLeave = () => setHoveredAffiliation(null);
  const handleClick = (id) => setActiveAffiliation(activeAffiliation === id ? null : id);

  const affiliationPositions = useMemo(() => {
    const positions = [];
    const radius = 2.5;
    const numAffiliations = affiliationsData.length;
    for (let i = 0; i < numAffiliations; i++) {
      const angle = (i / numAffiliations) * Math.PI * 2;
      positions.push([
        Math.sin(angle) * radius,
        0,
        Math.cos(angle) * radius,
      ]);
    }
    return positions;
  }, []);

  return (
    <section id="affiliations" className="section-padding">
      <div className="container project-content">
        <h2 className="section-title">My Affiliations</h2>
        <p className="section-description">
          A look at the organizations and institutions that have shaped my professional and academic journey.
          Hover over a logo to see its electron cloud react, and click for more details.
        </p>
      </div>
      <div className="project-canvas">
        <Canvas camera={{ position: [0, 0, 4] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={0.8} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />
          
          {/* No Suspense here - render directly */}
          {affiliationPositions.map((pos, index) => (
            <AffiliationItem
              key={affiliationsData[index].id}
              data={affiliationsData[index]}
              position={pos}
              onHover={handleHover}
              onLeave={handleLeave}
              onClick={handleClick}
              hoveredId={hoveredAffiliation}
              activeId={activeAffiliation}
            />
          ))}
          <OrbitControls enableZoom={true} enablePan={true} /> {/* OrbitControls directly here */}
          
        </Canvas>
      </div>
    </section>
  );
};

export default Affiliations;

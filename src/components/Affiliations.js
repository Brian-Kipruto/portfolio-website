import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

// Data for your affiliations (remains unchanged)
const affiliationsData = [
  {
    id: 'uon',
    name: 'University of Nairobi',
    logo: '/images/logos/uon_logo.png',
    details: 'MSc Nuclear Science & Technology Student (Aug 2025-Aug 2027), BSc Astrophysics (Sep 2019-Sep 2023).',
    link: 'https://www.uonbi.ac.ke/',
  },
  {
    id: 'byteanza',
    name: 'ByteAnza Research',
    logo: '/images/logos/byteanza_logo.png',
    details: 'Lead Developer for Autonomous Radiation Mapping Robot & Scientific Researcher for Smart Agriculture System. (Jan 2023 - Present)',
    link: 'https://byteanza.com/',
  },
  {
    id: 'nsk',
    name: 'Nuclear Society of Kenya',
    logo: '/images/logos/nsk_logo.png',
    details: 'Active Member, involved in public outreach, professional development, and policy advocacy. (Jan 2025 - Present)',
    link: 'https://nuclearsocietyofkenya.org/',
  },
  {
    id: 'bytelab',
    name: 'The Bytelab',
    logo: '/images/logos/bytelab_logo.png',
    details: 'STEM Educator, leading dynamic programs in electronics, coding, robotics, and IoT. (Nov 2023 - Present)',
    link: 'http://www.byteanza.com/bytelab/',
  },
  {
    id: 'konstanz',
    name: 'University of Konstanz',
    logo: '/images/logos/konstanz_logo.png',
    details: 'Machine Learning Research Intern & Project Team Member. (May 2022 - Aug 2022)',
    link: 'https://www.uni-konstanz.de/',
  },
];

// Electron Cloud Component (remains unchanged)
const ElectronCloud = ({ position, isHovered }) => {
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

  const colors = useMemo(() => {
    const colorArray = new Float32Array(particleCount * 3);
    const initialColor = new THREE.Color('#00BFFF');
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
      const currentInfluence = isHovered ? 1 : 0;
      const elapsedTime = clock.getElapsedTime();

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = initialPositions[i3];
        const y = initialPositions[i3 + 1];
        const z = initialPositions[i3 + 2];

        const timeOffset = elapsedTime * 0.5;
        const speedFactor = isHovered ? 2 : 0.5;
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

// Affiliation Logo and Info Card (UPDATED: Click logic moved to the inner div)
const AffiliationItem = ({ data, position, onClick, activeId }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isActive = activeId === data.id;

  return (
    <group position={position}>
      {/* Invisible mesh for hover detection. No click handler here. */}
      <mesh
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* The logo container HTML. The click handler is now on the inner div. */}
      <Html center wrapperClass="affiliation-logo-html">
        <div 
          className="affiliation-logo-container"
          onClick={() => onClick(data.id)}
        >
          <img src={data.logo} alt={data.name} className="affiliation-logo" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/18191D/E4E6EB?text=Logo"; }} />
        </div>
      </Html>

      {/* Info card HTML */}
      {isActive && (
        <Html position={[0, -1.5, 0]} center wrapperClass="affiliation-info-html-card">
          <div className="affiliation-info-card" onClick={(e) => e.stopPropagation()}>
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

      {/* Electron Cloud */}
      <ElectronCloud position={[0, 0, 0]} isHovered={isHovered} />
    </group>
  );
};

const Affiliations = () => {
  const [activeAffiliation, setActiveAffiliation] = useState(null);

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
        <Canvas camera={{ position: [0, 0, 4] }} onPointerMissed={() => setActiveAffiliation(null)}>
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={0.8} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />
          
          {affiliationPositions.map((pos, index) => (
            <AffiliationItem
              key={affiliationsData[index].id}
              data={affiliationsData[index]}
              position={pos}
              onClick={handleClick}
              activeId={activeAffiliation}
            />
          ))}
          <OrbitControls enableZoom={true} enablePan={true} />
          
        </Canvas>
      </div>
    </section>
  );
};

export default Affiliations;
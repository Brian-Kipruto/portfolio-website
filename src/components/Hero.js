// START: COPIED AND UPDATED FILE: src/components/Hero.js

import React, { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber'; 
// START: CHANGE - We need 'Html' to render text labels in 3D
import { OrbitControls, useGLTF, useAnimations, Html } from '@react-three/drei';
// END: CHANGE

// START: NEW ANNOTATION COMPONENT
// This component renders an HTML div at a specific 3D position.
const Annotation = ({ position, text, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Html position={position} center wrapperClass="annotation-wrapper">
      <div className="annotation-dot" onClick={() => setIsOpen(!isOpen)}>
        {/* You can put a number or icon here if you want */}
      </div>
      {isOpen && (
        <div className="annotation-card" onClick={(e) => e.stopPropagation()}>
          <h4>{title}</h4>
          <p>{text}</p>
        </div>
      )}
    </Html>
  );
};
// END: NEW ANNOTATION COMPONENT

// START: NEW ANNOTATION DATA
// We define the annotations we want to display.
// --- YOU WILL NEED TO ADJUST THESE [x, y, z] POSITIONS ---
const annotationsData = [
  {
    position: [-1.5, 0.5, 0], // Guessed position for the initial neutron
    title: 'Thermal Neutron',
    text: 'A slow (thermal) neutron strikes Uranium 235 (U-235).'
  },
  {
    position: [1.5, 0, 0], // Guessed position for the main nucleus
    title: 'Chain Reaction',
    text: 'The U-235 nucleus splits, producing fission products and more neutrons, which cause further fissions.'
  }
];
// END: NEW ANNOTATION DATA

// UPDATED 3D FISSION MODEL COMPONENT
const NuclearFissionModel = () => {
  const { scene, animations } = useGLTF('/models/nuclear-fission.glb');
  const { ref, actions } = useAnimations(animations, scene);
  
  useEffect(() => {
    if (animations && animations.length) {
      const animationName = animations[0].name;
      actions[animationName].play();
    }
  }, [actions, animations]); 
  
  return (
    // We wrap the model and annotations in a 'group' so they move together
    <group ref={ref}>
      <primitive 
        object={scene} 
        scale={2.5} 
        position={[0, -0.5, 0]} 
      />
      {/* START: CHANGE - Render the annotations */}
      {annotationsData.map((props, i) => (
        <Annotation key={i} {...props} />
      ))}
      {/* END: CHANGE */}
    </group>
  );
};
// END: UPDATED 3D FISSION MODEL COMPONENT

// Ambient Particles in the background (Unchanged)
const AmbientParticles = () => {
  const meshRef = useRef();
  useFrame(() => {
    meshRef.current.position.z += 0.005;
    if (meshRef.current.position.z > 5) {
      meshRef.current.position.z = -5;
    }
  });

  const particleCount = 2000;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
  }

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color={0x00FFFF} size={0.01} sizeAttenuation={true} transparent opacity={0.5} />
    </points>
  );
};

const Hero = () => {
  const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] = useState(false); // (Unchanged)

  const openProfilePictureModal = () => { // (Unchanged)
    setIsProfilePictureModalOpen(true);
  };

  const closeProfilePictureModal = () => { // (Unchanged)
    setIsProfilePictureModalOpen(false);
  };

  return (
    <section id="hero-section" className="hero-section">
      <div className="hero-content">
        {/* All hero-content HTML is unchanged */}
        <div className="hero-profile-picture-container" onClick={openProfilePictureModal}>
          <img src="/images/brian.jpeg" alt="Brian KipRuto Profile" className="hero-profile-picture" />
        </div>
        <h1>Brian Kipruto</h1>
        <p>
          Hi there窓樟. I am Kipruto from Kenya . I am an Astrophysicist but my passion lies more in the particle and matter aspects
          as compared to astrophysics in terms of the sheer vastness of the universe. 
        </p>
        <p>I enjoy tinkering with electronics,
          the outdoors, grilling and boy am I a sucker for scenic views. I am currently working on my MSc and I am particularly interested in 
          designing and making nuclear technologies for use in space based applications. </p>
        <p>My overaching philosophy in life is that <strong>Motion is Key泊</strong>.... always be doing sth with yourself no matter how small.</p>
      </div>
      <div className="hero-canvas">
        {/* Camera position and fov (Unchanged from last step) */}
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.8} /> 
          <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} castShadow /> 
          <pointLight position={[-5, -5, -5]} intensity={0.5} />
          
          <Suspense fallback={null}> 
            <NuclearFissionModel />
          </Suspense>
          
          <AmbientParticles />
          
          <OrbitControls enableZoom={true} enablePan={true} />
        </Canvas>
      </div>

      {/* Profile Picture Modal (Unchanged) */}
      {isProfilePictureModalOpen && (
        <div className="profile-picture-modal-overlay" onClick={closeProfilePictureModal}>
          <div className="profile-picture-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={closeProfilePictureModal}>&times;</button>
            <img src="/images/brian.jpeg" alt="Brian Kipruto Profile Enlarged" className="enlarged-profile-picture" />
            <p className="enlarged-profile-caption">Brian Kipruto</p>
            <p className="enlarged-profile-subcaption">MSc Nuclear Science & Technology Student</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;

// END: COPIED AND UPDATED FILE: src/components/Hero.js
import React, { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'; // Keep useThree
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Extend Line_ so it can be used in JSX (for the graph's base line)
extend({ Line_: THREE.Line });

// Graded-Z Shield Component - Now with a subtle glow effect
const GradedZShield = () => {
  const { scene } = useGLTF('/models/graded-z-composite.gltf');
  const ref = useRef();
  const materialRef = useRef(); // Reference to the mesh's material

  // Define your accent colors from main.css for consistency
  const baseColor = new THREE.Color(0x00BFFF); // Accent Blue
  const glowColor = new THREE.Color(0x00BF63); // Accent Green

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.1; // Maintain subtle rotation

      // Simulate a subtle glow/pulse, as if energy is being absorbed
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.9; // Oscillates between 0.8 and 1.0
      if (materialRef.current) {
        // Interpolate between base color and glow color based on pulse
        materialRef.current.color.copy(baseColor).lerp(glowColor, pulse * 0.2); // Subtle glow intensity
      }
    }
  });

  // Traverse the scene to apply the material override and get a reference to it
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        // Ensure the model uses a MeshStandardMaterial for lighting and color effects
        child.material = new THREE.MeshStandardMaterial({ color: baseColor });
        materialRef.current = child.material; // Store reference to the material
        child.castShadow = true; // Allow it to cast shadows
        child.receiveShadow = true; // Allow it to receive shadows
      }
    });
    // Set a consistent scale for the GLTF model
    scene.scale.set(0.7, 0.7, 0.7); // Adjust scale as needed
  }, [scene]); 


  return <primitive ref={ref} object={scene} />;
};

// Ambient Particles in the background
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

// Particle Beam Component - Fires towards the shield
const ParticleBeam = () => {
  const beamRef = useRef();
  const initialPosition = new THREE.Vector3(-1.5, 0, 0); // Start closer to the shield
  const targetPosition = new THREE.Vector3(0, 0, 0);   // Target the shield center
  const speed = 0.8; // Increased speed for a more noticeable animation

  useFrame((state, delta) => {
    if (beamRef.current) {
      // Move beam towards the target using linear interpolation
      beamRef.current.position.lerp(targetPosition, speed * delta);

      // Reset beam when it gets close to the target
      if (beamRef.current.position.distanceTo(targetPosition) < 0.1) {
        beamRef.current.position.copy(initialPosition);
      }
    }
  });

  return (
    <mesh ref={beamRef} position={initialPosition} scale={[0.5, 0.05, 0.05]}> {/* Adjusted scale */}
      <boxGeometry args={[1, 1, 1]} /> {/* Base geometry, scale handles actual size */}
      <meshBasicMaterial color={0xFF5722} transparent opacity={0.8} /> {/* Accent Orange */}
    </mesh>
  );
};

// Energy Spectrum Graph Component
const EnergySpectrumGraph = () => {
  const ref = useRef();
  const [beforeHeight, setBeforeHeight] = useState(0.8);
  const [afterHeight, setAfterHeight] = useState(0.2); // Simulate attenuation

  useFrame((state) => {
    // Animate the "before" and "after" heights for dynamism
    setBeforeHeight(0.8 + Math.sin(state.clock.elapsedTime * 1) * 0.1);
    setAfterHeight(0.2 + Math.cos(state.clock.elapsedTime * 1.5) * 0.05);

    // Update scale for "before" bar
    if (ref.current && ref.current.children[0]) {
      ref.current.children[0].scale.y = beforeHeight;
      ref.current.children[0].position.y = beforeHeight / 2; // Position from bottom
    }
    // Update scale for "after" bar
    if (ref.current && ref.current.children[1]) {
      ref.current.children[1].scale.y = afterHeight;
      ref.current.children[1].position.y = afterHeight / 2; // Position from bottom
    }
  });

  return (
    <group ref={ref} position={[1.5, 0, 0]} rotation={[0, -Math.PI / 4, 0]}> 
      {/* "Before" bar - moved to the left */}
      <mesh position={[-0.2, 0, 0]}>
        <boxGeometry args={[0.1, 1, 0.05]} />
        <meshBasicMaterial color={0x00BF63} /> {/* Accent Green */}
      </mesh>
      {/* "After" bar - moved to the right */}
      <mesh position={[0.2, 0, 0]}>
        <boxGeometry args={[0.1, 1, 0.05]} />
        <meshBasicMaterial color={0xFF5722} /> {/* Accent Orange */}
      </mesh>
      {/* Simple base line for the graph */}
      <line_>
        <bufferGeometry attach="geometry" args={[new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-0.3, -0.5, 0), new THREE.Vector3(0.3, -0.5, 0)])]} />
        <lineBasicMaterial attach="material" color={0xE4E6EB} /> {/* Off-white */}
      </line_>
    </group>
  );
};


const Hero = () => {
  const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] = useState(false); // New state

  const openProfilePictureModal = () => {
    setIsProfilePictureModalOpen(true);
  };

  const closeProfilePictureModal = () => {
    setIsProfilePictureModalOpen(false);
  };

  return (
    <section id="hero-section" className="hero-section">
      <div className="hero-content">
        <div className="hero-profile-picture-container" onClick={openProfilePictureModal}>
          <img src="/images/brian.jpeg" alt="Brian Kipruto Profile" className="hero-profile-picture" />
        </div>
        <h1>Brian Kipruto</h1>
        <p>
          Hi there👋🏾. I am Kipruto from Kenya. I am an Astrophysicist but my passion lies more in the particle and matter aspects
          as compared to astrophysics in terms of the sheer vastness of the universe. I enjoy tinkering with electronics,
          the outdoors, grilling and boy am I a sucker for scenic views. I am currently working on my MSc and I am particularly interested in 
          designing and making nuclear technologies for use in space based applications. 
        </p>
      </div>
      <div className="hero-canvas">
        <Canvas camera={{ position: [0, 0, 1], fov: 75 }}>
          <ambientLight intensity={0.8} /> 
          <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} castShadow /> 
          <pointLight position={[-5, -5, -5]} intensity={0.5} />
          
          <Suspense fallback={null}> 
            <GradedZShield />
          </Suspense>
          <AmbientParticles />
          <ParticleBeam /> 
          <EnergySpectrumGraph /> 
          
          {/* START: Direct OrbitControls with useThree */}
          <OrbitControls enableZoom={true} enablePan={true} />
          {/* END: Direct OrbitControls with useThree */}
        </Canvas>
      </div>

      {isProfilePictureModalOpen && (
        <div className="profile-picture-modal-overlay" onClick={closeProfilePictureModal}>
          <div className="profile-picture-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={closeProfilePictureModal}>&times;</button>
            <img src="/images/brian.jeg" alt="Brian Kipruto Profile Enlarged" className="enlarged-profile-picture" />
            <p className="enlarged-profile-caption">Brian Kipruto</p>
            <p className="enlarged-profile-subcaption">MSc Nuclear Science & Technology Student</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;

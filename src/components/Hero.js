// START: COPIED AND UPDATED FILE: src/components/Hero.js

// START: CHANGE - We need useEffect
import React, { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber'; 
// START: CHANGE - We need useAnimations
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
// END: CHANGE

// START: UPDATED 3D FISSION MODEL COMPONENT
const NuclearFissionModel = () => {
  // Load the model AND its animations
  // START: CHANGE - We now also get 'animations' from useGLTF
  const { scene, animations } = useGLTF('/models/nuclear-fission.glb');
  // END: CHANGE

  // START: CHANGE - Set up the animation mixer
  // This 'ref' will be attached to the model
  // 'actions' will contain all available animation clips
  const { ref, actions } = useAnimations(animations, scene);
  // END: CHANGE

  // START: CHANGE - Play the animation
  useEffect(() => {
    // 'animations[0].name' is just a way to get the *first* animation clip's name
    // We then tell the 'actions' to play that clip.
    if (animations && animations.length) {
      const animationName = animations[0].name;
      actions[animationName].play();
    }
  }, [actions, animations]); // This effect runs once when the component mounts
  // END: CHANGE
  
  // We're adding 'position' and 'scale' props to center the model and make it larger.
  // You can tweak these values (e.g., make 'scale' bigger or smaller).
  return <primitive 
    ref={ref} 
    object={scene} 
    // START: CHANGE - Adjust position and scale
    scale={2.5} 
    position={[0, -0.5, 0]} 
    // END: CHANGE
  />;
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
        {/* START: CHANGE - We are "zooming out" by moving the camera from 1 to 5 */}
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        {/* END: CHANGE */}

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
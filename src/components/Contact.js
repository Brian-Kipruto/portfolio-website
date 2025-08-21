import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Particle field that reacts to mouse movement
const InteractiveParticleField = () => {
  const meshRef = useRef();
  const mouse = useRef(new THREE.Vector2());
  const tempSphere = new THREE.Object3D();
  const particleCount = 5000;
  const initialPositions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, []);

  const colors = useMemo(() => new Float32Array(particleCount * 3), []);
  const baseColor = new THREE.Color('#00BFFF'); // Accent Blue
  const highlightColor = new THREE.Color('#FF5722'); // Accent Orange

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    const { clock, camera } = state;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse.current, camera);

    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position.array;
      const originalPositions = initialPositions;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = originalPositions[i3];
        const y = originalPositions[i3 + 1];
        const z = originalPositions[i3 + 2];

        tempSphere.position.set(x, y, z);
        const distance = raycaster.ray.origin.distanceTo(tempSphere.position);
        
        let influence = 0;
        if (distance < 2) {
          influence = (2 - distance) / 2;
        }

        const timeOffset = clock.elapsedTime * 0.5;
        tempSphere.position.x = x + Math.sin(x + timeOffset) * 0.1 * influence;
        tempSphere.position.y = y + Math.cos(y + timeOffset) * 0.1 * influence;
        tempSphere.position.z = z + Math.sin(z + timeOffset) * 0.1 * influence;

        const particleColor = new THREE.Color();
        particleColor.copy(baseColor).lerp(highlightColor, influence);
        colors[i3] = particleColor.r;
        colors[i3 + 1] = particleColor.g;
        colors[i3 + 2] = particleColor.b;

        positions[i3] = tempSphere.position.x;
        positions[i3 + 1] = tempSphere.position.y;
        positions[i3 + 2] = tempSphere.position.z;
      }

      meshRef.current.geometry.attributes.position.needsUpdate = true;
      meshRef.current.geometry.attributes.color.needsUpdate = true; 
    }
  });

  return (
    <points ref={meshRef}>
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


const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: {
            'Accept': 'application/json'
        }
      });
      if (response.ok) {
        alert('Thank you for your message! I will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
      } else {
        const data = await response.json();
        if (data.errors) {
          alert(data.errors.map(error => error.message).join(', '));
        } else {
          alert('Oops! There was an error submitting your form.');
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Oops! There was a network error submitting your form.');
    }
  };

  return (
    <section id="contact" className="contact-section section-padding">
      <div className="contact-canvas-container">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Suspense fallback={null}>
            <InteractiveParticleField />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} /> {/* OrbitControls directly here */}
        </Canvas>
      </div>
      
      <div className="container contact-content-wrapper">
        <div className="contact-info-panel">
          <h2 className="section-title contact-title">Get in Touch</h2>
          <p className="contact-intro">
            I'm always open to discussing new projects, collaborations, or mentorship opportunities. Feel free to reach out!
          </p>
          <div className="contact-details">
            <p>Email: <a href="mailto:bryanrutto4@gmail.com" className="contact-link">bryanrutto4@gmail.com</a></p>
            <p>LinkedIn: <a href="https://www.linkedin.com/in/brian-kipruto" target="_blank" rel="noopener noreferrer" className="contact-link">linkedin.com/in/brian-kipruto</a></p>
            <p>GitHub: <a href="https://github.com/Ruto20" target="_blank" rel="noopener noreferrer" className="contact-link">github.com/Ruto20</a></p>
            <div className="profile-picture-container">
              <img src="/images/brian_kipruto_profile.jpg" alt="Brian Kipruto" className="profile-picture" />
              <h3>Brian Kipruto</h3>
              <p>MSc Nuclear Science & Technology Student</p>
            </div>
            <a href="/docs/CV.pdf" download="Brian_Kipruto_CV.pdf" className="download-cv-btn">
              Download CV (PDF)
            </a>
          </div>
        </div>

        <div className="contact-form-panel">
          <form onSubmit={handleSubmit} className="contact-form" action="https://formspree.io/f/xblkegpl" method="POST">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required></textarea>
            </div>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;

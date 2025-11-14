import React, { useRef, Suspense, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber'; // Removed useThree
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';

// RangerRobot component with component highlighting and info on hover
const RangerRobot = () => {
  const { scene } = useGLTF('/models/ranger-robot.gltf');
  const robotRef = useRef();
  const [hovered, setHovered] = useState(null);
  const [activeComponent, setActiveComponent] = useState(null);

  const componentsInfo = {
    'RangerBody': { info: 'The main chassis of the R.A.N.G.E.R. robot, housing all core systems.' },
  };

  const defaultMaterial = useRef(new THREE.MeshStandardMaterial({ color: '#555555', metalness: 0.5, roughness: 0.8 }));
  const highlightMaterial = useRef(new THREE.MeshStandardMaterial({ color: '#00BFFF', emissive: '#00BFFF', emissiveIntensity: 0.5, metalness: 0.8, roughness: 0.2 }));

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.name = 'RangerBody'; // Force name for the single cube placeholder
          child.material = defaultMaterial.current;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      scene.scale.set(0.5, 0.5, 0.5); // Adjust scale to fit the scene
      scene.position.set(0, -0.25, 0); // Position it slightly above the ground
    }
  }, [scene]);

  useFrame(() => {
    if (robotRef.current) {
      robotRef.current.rotation.y += 0.005;

      scene.traverse((child) => {
        if (child.isMesh && child.name === 'RangerBody') {
          if (child.name === hovered || child.name === activeComponent) {
            child.material = highlightMaterial.current;
          } else {
            child.material = defaultMaterial.current;
          }
        }
      });
    }
  });

  return (
    <group
      ref={robotRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(e.object.name);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        setActiveComponent(e.object.name === activeComponent ? null : e.object.name); // Toggle active
      }}
    >
      <primitive object={scene} />

      {Object.entries(componentsInfo).map(([name, comp]) => {
        const object3D = scene.getObjectByName(name);
        if (!object3D) return null;

        return (
          <Html key={name} position={object3D.position.toArray()} wrapperClass="component-label" center>
            <div className="label-content">
              {(hovered === name && !activeComponent) && <p>{name}</p>}
              {activeComponent === name && (
                <div className="info-box">
                  <h4>{name}</h4>
                  <p>{comp.info}</p>
                  <button onClick={(e) => { e.stopPropagation(); setActiveComponent(null); }}>X</button>
                </div>
              )}
            </div>
          </Html>
        );
      })}
    </group>
  );
};

// AnimatedPath component with simulated hotspot data
const AnimatedPath = () => {
  const pathHeadRef = useRef();
  const hotspotMeshRef = useRef();

  const pathPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i < 100; i++) {
      points.push(new THREE.Vector3(
        Math.sin(i * 0.1) * 2 + (Math.random() - 0.5) * 1.5,
        0.01,
        Math.cos(i * 0.1) * 2 + (Math.random() - 0.5) * 1.5
      ));
    }
    return points;
  }, []);

  const radiationData = useMemo(() => {
    const data = [];
    for (let i = 0; i < 100; i++) {
      data.push(Math.random() * 100);
    }
    return data;
  }, []);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(pathPoints), [pathPoints]);

  const tempPosition = new THREE.Vector3();
  const tempScale = new THREE.Vector3();
  const tempColor = new THREE.Color();
  const hotspotCount = 200;

  const colors = useMemo(() => new Float32Array(hotspotCount * 3), [hotspotCount]);

  let pathOffset = 0;

  useFrame((state) => {
    pathOffset = (pathOffset + 0.005) % 1;

    const robotPoint = curve.getPointAt(pathOffset);
    if (pathHeadRef.current) {
      pathHeadRef.current.position.copy(robotPoint);
    }

    if (hotspotMeshRef.current) {
      for (let i = 0; i < hotspotCount; i++) {
        const t = i / (hotspotCount - 1);
        curve.getPointAt(t, tempPosition);

        const distanceToRobot = robotPoint.distanceTo(tempPosition);
        let intensity = 0;
        if (distanceToRobot < 0.75) {
          intensity = 1 - (distanceToRobot / 0.75);
        } else {
          intensity = 0;
        }
        
        const dataIntensity = radiationData[Math.floor(t * radiationData.length)] / 100;
        intensity = Math.max(dataIntensity * 0.5, intensity);

        tempColor.set(0x00BFFF).lerp(new THREE.Color(0xFF5722), intensity);
        
        colors[i * 3] = tempColor.r;
        colors[i * 3 + 1] = tempColor.g;
        colors[i * 3 + 2] = tempColor.b;
        
        tempScale.setScalar(0.08 + intensity * 0.15);
        
        const matrix = new THREE.Matrix4().compose(
          tempPosition,
          new THREE.Quaternion(),
          tempScale
        );
        hotspotMeshRef.current.setMatrixAt(i, matrix);
      }
      hotspotMeshRef.current.instanceMatrix.needsUpdate = true;
      hotspotMeshRef.current.geometry.attributes.instanceColor.needsUpdate = true; 
    }
  });

  const pathGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(curve.getPoints(200)), [curve]);
  const pathMaterial = useMemo(() => new THREE.LineBasicMaterial({
    color: 0x00BFFF,
    linewidth: 1,
    transparent: true,
    opacity: 0.2
  }), []);

  return (
    <>
      <line geometry={pathGeometry} material={pathMaterial} />
      <mesh ref={pathHeadRef}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={0x00BF63} />
      </mesh>
      <instancedMesh ref={hotspotMeshRef} args={[null, null, hotspotCount]}>
        <sphereGeometry args={[0.08, 8, 8]}>
          <instancedBufferAttribute attach="attributes-instanceColor" args={[colors, 3]} />
        </sphereGeometry>
        <meshBasicMaterial vertexColors={true} transparent={true} opacity={0.8} />
      </instancedMesh>
    </>
  );
};

const RangerProject = () => {
  return (
    <section id="ranger-project" className="project-section">


<div className="container project-content">
  <span className="featured-label">Featured Project</span>
  <h2>R.A.N.G.E.R. Project: Autonomous Environmental Reconnaissance</h2>

  <p className="project-intro">
    An innovative system that combines a rugged 6WD robotic platform with a modular sensor suite to democratize environmental data collection in remote regions.
  </p>

  {/* Mission section remains as is, but with an icon */}
  <h3>🎯 The Mission: Closing the Data Gap</h3>
  <p>
    In <strong>ASAL</strong> communities, a critical lack of environmental data hinders everything from climate change adaptation for farmers to addressing decades-old, unverified fears of toxic waste. R.A.N.G.E.R. was built to close this gap, providing the evidence needed for proactive policy and environmental justice.
  </p>

  {/* V1 and V2 are now wrapped in a styled container */}
  <div className="project-subsection">
    <h3>✅ Proven Prototype (V1)</h3>
    <p>
      The current system is a successful, field-tested proof of concept that integrates a custom hardware platform with a full-stack web application. Key features include:
    </p>
    <ul className="feature-list">
      <li><strong>Live Geospatial Mapping:</strong> A web interface built with Django (Python) displays real-time sensor data on an interactive map.</li>
      <li><strong>Multi-Parameter Data Collection:</strong> The onboard sensor suite captures precise spatial measurements of radiation (Geiger-Müller tube), particulate matter (PM2.5/10), and atmospheric conditions.</li>
      <li><strong>AI-Powered Analysis:</strong> An integrated "R.A.N.G.E.R. Assistant," powered by the Google Gemini API, allows users to query complex environmental data using natural language.</li>
    </ul>
  </div>

  <div className="project-subsection">
    <h3>🚀 The Vision: RANGER V2</h3>
    <p>
      The roadmap for R.A.N.G.E.R. focuses on scaling for impact with a next-generation platform designed for advanced autonomy and perception. The key upgrades include:
    </p>
    <ul className="feature-list">
      <li><strong>Advanced All-Terrain Mobility:</strong> An 8-wheel drive platform featuring an active Rocker-Bogie suspension system for maximum traversal capability.</li>
      <li><strong>Onboard Compute:</strong> Integrating an NVIDIA Jetson Orin to handle complex, real-time processing at the edge.</li>
      <li><strong>Intelligent Perception:</strong> Utilizing 360° Lidar Mapping and advanced VSLAM/VIO for robust navigation and creating a real-time "Digital Twin" of the environment.</li>
      <li><strong>Predictive AI:</strong> Leveraging the new hardware to deploy models for AI-powered anomaly detection and automated mission planning.</li>
    </ul>
  </div>
  
  <a href="https://youtu.be/9DqESTCRMgg" target="_blank" rel="noopener noreferrer" className="view-details-btn">
    View Project Details &rarr;
  </a>
</div>


      <div className="project-canvas">
        <Canvas camera={{ position: [0, 2, 3] }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
          <pointLight position={[0, 1, 0]} intensity={0.8} />
          
          <Suspense fallback={null}>
            <RangerRobot />
          </Suspense>

          <AnimatedPath />
          <OrbitControls enableZoom={true} enablePan={true} /> {/* OrbitControls directly here */}
        </Canvas>
      </div>
    </section>
  );
};

export default RangerProject;

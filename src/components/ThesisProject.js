import React, { Suspense, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber'; // Removed useThree
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const THESIS_DATA = [
  { x: 0.1, y: 0.5, z: 0.2, info: "PE/Pb/Al, Low Dose" },
  { x: 0.3, y: 0.1, z: 0.8, info: "C/Ta/Ti, Medium Dose" },
  { x: 0.8, y: 0.7, z: 0.3, info: "PE/B4C/Fe, High Dose" },
];

const Points = ({ data, onSelectPoint }) => {
  const meshRef = useRef();

  const handleClick = (e) => {
    e.stopPropagation();
    const instanceId = e.instanceId;
    const pointData = data[instanceId];
    onSelectPoint(pointData);
  };

  const temp = new THREE.Object3D();

  useFrame(() => {
    for (let i = 0; i < data.length; i++) {
      const { x, y, z } = data[i];
      temp.position.set(x, y, z);
      temp.updateMatrix();
      meshRef.current.setMatrixAt(i, temp.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, data.length]} onClick={handleClick}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial color="#00FFFF" />
    </instancedMesh>
  );
};

const Grid = () => {
  return (
    <gridHelper args={[20, 20, '#444444', '#282c34']} />
  );
};

const Axes = () => {
  return (
    <axesHelper args={[2]} />
  );
};

const ThesisProject = () => {
  const [selectedPointInfo, setSelectedPointInfo] = useState(null);

  const handlePointSelection = (data) => {
    setSelectedPointInfo(data.info);
  };

  return (
    <section id="thesis-project" className="project-section">
      <div className="container project-content">
        <span className="featured-label">Featured Project</span>
        <h2>Masters Project: Machine Learning for Graded-Z Composites</h2>
        <p>
          I am developing a virtual design and testing tool that leverages GEANT4 for high-fidelity data generation and Machine Learning (ML) for rapid performance prediction of flexible Graded-Z composites. This aims to accelerate the development cycle of these critical radiation shielding materials.
        </p>
        <p>
          The core of this project is to create and validate ML models that can rapidly predict radiation shielding performance based on their material composition, layering strategy, and thickness. My goal is to reduce reliance on time-consuming and expensive physical experiments.
        </p>
        {selectedPointInfo && (
          <div className="info-panel">
            <h3>Selected Configuration:</h3>
            <p>{selectedPointInfo}</p>
          </div>
        )}
        <a href="https://www.linkedin.com/in/brian-kipruto" target="_blank" rel="noopener noreferrer" className="view-details-btn">
          View Project Details &rarr;
        </a>
      </div>
      <div className="project-canvas">
        <Canvas camera={{ position: [1, 1, 3] }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />

          <Grid />
          <Axes />

          <Suspense fallback={null}>
            <Points data={THESIS_DATA} onSelectPoint={handlePointSelection} />
          </Suspense>
          <OrbitControls enableZoom={true} enablePan={true} /> {/* OrbitControls directly here */}
        </Canvas>
      </div>
    </section>
  );
};

export default ThesisProject;

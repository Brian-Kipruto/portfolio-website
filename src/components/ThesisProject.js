import React, { Suspense, useRef, useState } from 'react';
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
  <h2>MSc Project: Machine Learning for Graded-Z Composites</h2>

  {/* START: New Updated Content */}
  <p className="project-intro">
    Accelerating the design of next-generation radiation shielding by combining high-fidelity particle simulation with predictive machine learning.
  </p>

  <div className="project-subsection">
    <h3>🎯 Core Objective</h3>
    <p>
      To create and validate Machine Learning models that can rapidly predict the radiation shielding performance of flexible Graded-Z composites based on their material composition, layering strategy, densities and thickness. The primary goal is to reduce reliance on time-consuming and expensive physical experiments.
    </p>
  </div>

  <div className="project-subsection">
    <h3>🛠️ Methodology & Key Technologies</h3>
    <p>
      This project integrates several key technologies to build a virtual design and testing tool:
    </p>
    <ul className="feature-list">
      <li><strong>High-Fidelity Simulation:</strong> Leveraging GEANT4, a CERN-developed toolkit, to generate robust and accurate data on particle interactions within shielding materials.</li>
      <li><strong>Predictive Machine Learning:</strong> I am using gradient boosting machines, specifically XG Boost, to develop and train advanced ML models to learn the complex relationship between a composite's properties and its shielding effectiveness.</li>
      <li><strong>Virtual Prototyping:</strong> The final output is a tool that will enable rapid iteration and optimization of Graded_Z shielding designs, drastically accelerating the development cycle.</li>
    </ul>
  </div>
  {/* END: New Updated Content */}
  
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

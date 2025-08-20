import React, { useRef, Suspense, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
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
  const ref = useRef();
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
        <p>
          Project R.A.N.G.E.R. (Robotic Autonomous Navigator for Geospatial Environmental Reconnaissance) is an innovative system for environmental data collection in remote regions. It combines a rugged mobile robot with a modular sensor suite to democratize ground-level environmental data.
        </p>
        <p>
          The platform uses a modular sensor suite for monitoring Particulate Matter (PM), radiation, and atmospheric conditions. It's designed to provide real-time data to communities and governments for proactive, evidence-based policy and environmental justice. The long-term vision is to scale R.A.N.G.E.R. into a collaborative fleet for wide-area monitoring.
        </p>
        <a href="https://byteanza.com/research/portfolio-details.html" target="_blank" rel="noopener noreferrer" className="view-details-btn">
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
          {/* START: Direct OrbitControls with useThree */}
          <OrbitControls enableZoom={true} enablePan={true} />
          {/* END: Direct OrbitControls with useThree */}
        </Canvas>
      </div>
    </section>
  );
};

export default RangerProject;

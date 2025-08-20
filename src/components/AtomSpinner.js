// src/components/AtomSpinner/AtomSpinner.js
import React, { useRef, useMemo } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';

// Extend Line_ so it can be used in JSX for the orbits
extend({ Line_: THREE.Line });

const AtomSpinner = () => {
  const groupRef = useRef();
  const nucleusRef = useRef();
  const electron1Ref = useRef();
  const electron2Ref = useRef();
  const electron3Ref = useRef();

  const orbitRadius1 = 0.5;
  const orbitRadius2 = 0.7;
  const orbitRadius3 = 0.9;

  // Create orbit points once
  const orbitPoints1 = useMemo(() => {
    const points = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(orbitRadius1 * Math.cos(angle), orbitRadius1 * Math.sin(angle), 0));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [orbitRadius1]);

  const orbitPoints2 = useMemo(() => {
    const points = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(orbitRadius2 * Math.cos(angle), 0, orbitRadius2 * Math.sin(angle)));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [orbitRadius2]);

  const orbitPoints3 = useMemo(() => {
    const points = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(0, orbitRadius3 * Math.cos(angle), orbitRadius3 * Math.sin(angle)));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [orbitRadius3]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Rotate the entire atom group
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.2;
      groupRef.current.rotation.x = time * 0.1;
    }

    // Animate electrons around their orbits
    if (electron1Ref.current) {
      electron1Ref.current.position.x = orbitRadius1 * Math.cos(time * 2);
      electron1Ref.current.position.y = orbitRadius1 * Math.sin(time * 2);
    }
    if (electron2Ref.current) {
      electron2Ref.current.position.x = orbitRadius2 * Math.cos(time * 1.5);
      electron2Ref.current.position.z = orbitRadius2 * Math.sin(time * 1.5);
    }
    if (electron3Ref.current) {
      electron3Ref.current.position.y = orbitRadius3 * Math.cos(time * 1);
      electron3Ref.current.position.z = orbitRadius3 * Math.sin(time * 1);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Nucleus */}
      <mesh ref={nucleusRef}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#FF5722" /> {/* Accent Orange for nucleus */}
      </mesh>

      {/* Orbits */}
      <line_ geometry={orbitPoints1}>
        <lineBasicMaterial color="#00BFFF" transparent opacity={0.3} />
      </line_>
      <line_ geometry={orbitPoints2}>
        <lineBasicMaterial color="#00BF63" transparent opacity={0.3} />
      </line_>
      <line_ geometry={orbitPoints3}>
        <lineBasicMaterial color="#E4E6EB" transparent opacity={0.3} />
      </line_>

      {/* Electrons */}
      <mesh ref={electron1Ref}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#00BFFF" />
      </mesh>
      <mesh ref={electron2Ref}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#00BF63" />
      </mesh>
      <mesh ref={electron3Ref}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#E4E6EB" />
      </mesh>
    </group>
  );
};

export default AtomSpinner;
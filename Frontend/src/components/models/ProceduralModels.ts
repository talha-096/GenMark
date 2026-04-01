import * as THREE from 'three';

export const createProceduralModels = (scene: THREE.Scene) => {
  const models: Record<string, THREE.Group | THREE.Mesh> = {};

  // Common Material
  const genMarkMaterial = new THREE.MeshStandardMaterial({
    color: 0x3b82f6,           // primary blue
    emissive: 0x0a1a3a,
    emissiveIntensity: 0.6,
    metalness: 0.75,
    roughness: 0.25,
    transparent: true,
    opacity: 0.9,
    wireframe: true, // Use wireframe to give that technical neural feel
  });

  // 1. Neural Brain
  const brainGroup = new THREE.Group();
  const brainCore = new THREE.Mesh(new THREE.IcosahedronGeometry(10, 2), genMarkMaterial);
  brainGroup.add(brainCore);
  
  // Add orbital lines
  const lineMat = new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.4 });
  for (let i = 0; i < 3; i++) {
    const orbit = new THREE.LineLoop(
      new THREE.EdgesGeometry(new THREE.TorusGeometry(14 + i * 2, 0.1, 8, 64)),
      lineMat
    );
    orbit.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    brainGroup.add(orbit);
  }
  brainGroup.position.set(0, 0, -300); // Initial off-screen position for GSAP
  brainGroup.visible = false; // Hidden until GSAP shows it
  scene.add(brainGroup);
  models.neuralBrain = brainGroup;

  // 2. Content Cube
  const cubeGroup = new THREE.Group();
  const boxGeo = new THREE.BoxGeometry(12, 12, 12, 3, 3, 3);
  const cubeCore = new THREE.Mesh(boxGeo, genMarkMaterial);
  
  // Add Edges for technical look
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(boxGeo), new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.2, transparent: true }));
  cubeGroup.add(cubeCore);
  cubeGroup.add(edges);
  
  cubeGroup.position.set(20, 0, -50); // Just a safe place, will be moved
  cubeGroup.visible = false;
  scene.add(cubeGroup);
  models.contentCube = cubeGroup;

  // 3. Brand Ring
  const ringGroup = new THREE.Group();
  const ringColors = [0x3b82f6, 0xa855f7, 0xf97316]; // Blue, Violet, Orange
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(16, 0.6, 16, 100),
      new THREE.MeshStandardMaterial({
        color: ringColors[i],
        emissive: ringColors[i],
        emissiveIntensity: 0.4,
        roughness: 0.1,
        metalness: 0.8,
        transparent: true,
        opacity: 0.8
      })
    );
    ring.rotation.x = (i * Math.PI) / 3;
    ringGroup.add(ring);
  }
  ringGroup.position.set(-20, 0, -60);
  ringGroup.visible = false;
  scene.add(ringGroup);
  models.brandRing = ringGroup;

  // 4. Rocket Shape
  const rocketGroup = new THREE.Group();
  const cone = new THREE.Mesh(new THREE.ConeGeometry(5, 14, 8), genMarkMaterial);
  cone.position.y = 7;
  const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(3, 5, 8, 8), genMarkMaterial);
  cylinder.position.y = -4;
  
  // Add thruster rings
  const thruster = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.4, 8, 16), new THREE.MeshBasicMaterial({ color: 0xf97316 }));
  thruster.position.y = -8;
  thruster.rotation.x = Math.PI / 2;
  
  rocketGroup.add(cone);
  rocketGroup.add(cylinder);
  rocketGroup.add(thruster);
  
  rocketGroup.position.set(0, -50, -100);
  rocketGroup.visible = false;
  scene.add(rocketGroup);
  models.rocketShape = rocketGroup;

  return models;
};

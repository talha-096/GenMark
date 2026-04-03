import * as THREE from 'three';

export const ProceduralModels = {
  getIDEWindow: () => {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({
      color: 0x0088ff,
      emissive: 0x001133,
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: false,
    });
    
    // Main Editor panel
    const mainPanel = new THREE.Mesh(new THREE.BoxGeometry(10, 6, 0.2), material);
    group.add(mainPanel);
    
    // Sidebar
    const sidebar = new THREE.Mesh(new THREE.BoxGeometry(2.5, 6, 0.2), material);
    sidebar.position.set(-6.5, 0, 0);
    group.add(sidebar);
    
    // Console
    const terminal = new THREE.Mesh(new THREE.BoxGeometry(10, 2, 0.2), material);
    terminal.position.set(0, -4.2, 0);
    group.add(terminal);

    // Explode positions storage
    group.userData.originalPositions = [
      mainPanel.position.clone(),
      sidebar.position.clone(),
      terminal.position.clone(),
    ];
    
    return group;
  },
  
  getCodeAtom: () => {
    const group = new THREE.Group();
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff });
    const core = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), coreMat);
    group.add(core);

    const ringMat = new THREE.MeshBasicMaterial({ color: 0x0088ff, wireframe: true });
    for (let i=0; i<3; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(3, 0.1, 16, 100), ringMat);
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        group.add(ring);
    }
    return group;
  },
  
  getDeployCube: () => {
    const group = new THREE.Group();
    const solidMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.8 });
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true });

    const solid = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4, 2, 2, 2), solidMat);
    const wire = new THREE.Mesh(new THREE.BoxGeometry(4.2, 4.2, 4.2, 2, 2, 2), wireMat);
    
    group.add(solid);
    group.add(wire);
    
    return group;
  },
  
  getAIBrain: () => {
    const group = new THREE.Group();
    const geo = new THREE.IcosahedronGeometry(3, 1);
    
    const mat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.3 });
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);
    
    // Nodes
    const pMat = new THREE.PointsMaterial({ color: 0x00d4ff, size: 0.2 });
    const points = new THREE.Points(geo, pMat);
    group.add(points);
    
    return group;
  }
};

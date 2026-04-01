import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// Use Google-hosted DRACO decoders for high reliability on Windows
const DRACO_DECODER_URL = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/';

export const useModelLoader = () => {
  const [loader, setLoader] = useState<GLTFLoader | null>(null);

  useEffect(() => {
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    
    // Set up Draco decoder
    dracoLoader.setDecoderPath(DRACO_DECODER_URL);
    gltfLoader.setDRACOLoader(dracoLoader);
    
    setLoader(gltfLoader);
    
    return () => {
      dracoLoader.dispose();
    };
  }, []);

  const loadModel = (url: string): Promise<THREE.Group> => {
    return new Promise((resolve, reject) => {
      if (!loader) {
        reject(new Error('Loader not initialized'));
        return;
      }

      loader.load(
        url,
        (gltf) => resolve(gltf.scene),
        undefined,
        (error) => reject(error)
      );
    });
  };

  return { loadModel, isReady: !!loader };
};

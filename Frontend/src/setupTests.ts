import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

// Mock window.scrollTo
window.scrollTo = vi.fn();

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.IntersectionObserver = IntersectionObserver;

// Mock Canvas getContext for Three.js
HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation((contextId) => {
  if (contextId === '2d') {
    return {
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      getImageData: vi.fn(),
      putImageData: vi.fn(),
      createImageData: vi.fn(),
      setTransform: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      clip: vi.fn(),
      rect: vi.fn(),
      scale: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      measureText: vi.fn(() => ({ width: 0 })),
      transform: vi.fn(),
      rect: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      fillText: vi.fn(),
      strokeText: vi.fn(),
    };
  }
  if (contextId === 'webgl' || contextId === 'webgl2' || contextId === 'experimental-webgl') {
    return {
      getExtension: vi.fn(),
      getParameter: vi.fn().mockImplementation((param) => {
        if (param === 35724) return 'WebGL 1.0'; // VERSION
        if (param === 7936) return 'WebKit'; // VENDOR
        if (param === 7937) return 'WebKit WebGL'; // RENDERER
        if (param === 35725) return 'WebGL GLSL ES 1.0 (Mock)'; // SHADING_LANGUAGE_VERSION
        return null;
      }),
      createProgram: vi.fn(),
      createShader: vi.fn(),
      shaderSource: vi.fn(),
      compileShader: vi.fn(),
      getShaderParameter: vi.fn(() => true),
      getProgramParameter: vi.fn(() => true),
      createBuffer: vi.fn(),
      bindBuffer: vi.fn(),
      bufferData: vi.fn(),
      enableVertexAttribArray: vi.fn(),
      vertexAttribPointer: vi.fn(),
      drawArrays: vi.fn(),
      useProgram: vi.fn(),
      getAttribLocation: vi.fn(),
      getUniformLocation: vi.fn(),
      uniform1f: vi.fn(),
      uniformMatrix4fv: vi.fn(),
      clear: vi.fn(),
      viewport: vi.fn(),
      createTexture: vi.fn(),
      bindTexture: vi.fn(),
      texParameteri: vi.fn(),
      texImage2D: vi.fn(),
      canvas: { width: 100, height: 100 },
    };
  }
  return null;
});

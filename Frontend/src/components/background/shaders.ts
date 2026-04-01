export const particlesVert = `
attribute float size;
attribute float opacity;
uniform float time;
uniform float scrollProgress;
varying float vOpacity;

void main() {
  vOpacity = opacity;
  vec3 pos = position;
  pos.y += sin(time * 0.0003 + position.x * 0.01) * 2.0;
  pos.z += scrollProgress * -50.0;
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = size * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const particlesFrag = `
varying float vOpacity;
uniform vec3 color;

void main() {
  float d = distance(gl_PointCoord, vec2(0.5));
  if (d > 0.5) discard;
  float alpha = (1.0 - smoothstep(0.35, 0.5, d)) * vOpacity;
  gl_FragColor = vec4(color, alpha);
}
`;

export const gridFrag = `
varying vec2 vUv;
uniform float time;
uniform float scrollProgress;

void main() {
  vec2 uv = vUv;
  uv.y -= time * 0.05 + scrollProgress * 0.3;
  
  float gridX = abs(fract(uv.x * 20.0) - 0.5);
  float gridY = abs(fract(uv.y * 20.0) - 0.5);
  float line = min(gridX, gridY);
  float grid = 1.0 - smoothstep(0.0, 0.05, line);
  
  float fade = 1.0 - smoothstep(0.3, 1.0, distance(vUv, vec2(0.5)));
  
  gl_FragColor = vec4(0.0, 0.53, 1.0, grid * fade * 0.15);
}
`;

export const gridVert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

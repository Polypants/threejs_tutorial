uniform float time;
varying float dist;

void main () {
  dist = sin(time) * 0.5 + 0.5;
  vec4 offset = vec4(position, 1.0);
  offset.xyz += normal * dist;
  gl_Position = projectionMatrix * modelViewMatrix * offset;
}
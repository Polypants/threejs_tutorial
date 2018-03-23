varying float dist;

void main () {
  float red = dist;
  float blue = 1.0 - dist;
  gl_FragColor = vec4(red, 0.5, blue, 1.0);
}
var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);

var vertShader = require('webpack-glsl-loader!./shaders/shader.vert');
var fragShader = require('webpack-glsl-loader!./shaders/shader.frag');

function createIcosahedron() {
  // create icosahedron geometry
  var icosahedronGeometry = new THREE.IcosahedronGeometry();

  // this should be commented out after we start using the shaders
  var icosahedronMaterial = new THREE.MeshNormalMaterial();

  // create icosahedron material
  // var icosahedronMaterial = new THREE.ShaderMaterial({
  //   vertexShader: vertShader,
  //   fragmentShader: fragShader,
  //   uniforms: {
  //     time: { type: 'f', value: 0 }
  //   }
  });

  // create icosahedron mesh and add to scene
  var icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
  
  // return the icosahedron
  return icosahedron;
}

(function init() {
  var time = 0;

  // create scene
  var scene = new THREE.Scene();

  // create camera
  var fieldOfView = 45;
  var aspectRatio = window.innerWidth / window.innerHeight;
  var nearClipping = 1;
  var farClipping = 1000;
  var camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearClipping,
    farClipping
  );
  camera.position.z = 10;

  // create controls
  var controls = new OrbitControls(camera);
  
  // create icosahedron
  var icosahedron = createIcosahedron();
  scene.add(icosahedron);

  // create light
  var pointLight = new THREE.PointLight(0xffffff, 1.2);
  pointLight.position.x = 10;
  pointLight.position.y = 10;
  pointLight.position.z = 10;
  scene.add(pointLight);

  // create renderer
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('root').appendChild(renderer.domElement);

  // start render loop
  animate(scene, camera, controls, renderer, time, icosahedron);
}());

function animate(scene, camera, controls, renderer, time, icosahedron) {
  // update time variable for shader
  time += 0.05;

  // update rotation for cool spin effect
  icosahedron.rotation.x += 0.005;
  icosahedron.rotation.y += 0.005;
  icosahedron.rotation.z += 0.005;

  // update the shader time attribute
  // icosahedron.material.uniforms.time.value = time;

  requestAnimationFrame(function() {
    animate(scene, camera, controls, renderer, time, icosahedron);
  });

  controls.update();
  renderer.render(scene, camera);
}
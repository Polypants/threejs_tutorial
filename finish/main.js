var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);

(function init() {
    // create texture loader
    var textureLoader = new THREE.TextureLoader();

    // create environment map
    var reflectionCube = new THREE.CubeTextureLoader().load([
        'assets/cube/px.png', 'assets/cube/nx.png',
        'assets/cube/py.png', 'assets/cube/ny.png',
        'assets/cube/pz.png', 'assets/cube/nz.png'
    ]);

    // create scene
    var scene = new THREE.Scene();
    scene.background = reflectionCube;

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
    
    // create sphere
    var sphereGeometry = new THREE.SphereGeometry(1, 48, 48);
    var sphereMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffbb00,
        roughness: 0,
        metalness: 1,
        opacity: 1
    });
    sphereMaterial.envMap = reflectionCube;
    var sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
    sphereMaterial.transparent = true;
    sphere.castShadow = true;
    scene.add(sphere);

    // create plane
    var planeGeometry = new THREE.PlaneGeometry(10, 10);
    var planeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 0.8
    });
    planeMaterial.map = textureLoader.load('./assets/rock.jpg');
    planeMaterial.bumpMap = textureLoader.load('./assets/rock.jpg');
    planeMaterial.bumpScale = 0.02;
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = -1;
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);

    // create light
    var pointLight = new THREE.PointLight(0xffffff, 1.2);
    pointLight.position.x = 10;
    pointLight.position.y = 10;
    pointLight.position.z = 10;
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 2048;
    pointLight.shadow.mapSize.height = 2048;
    scene.add(pointLight);

    // create renderer
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('root').appendChild(renderer.domElement);

    animate(scene, camera, controls, renderer);
}());

function animate(scene, camera, controls, renderer) {
    requestAnimationFrame(function() {
        animate(scene, camera, controls, renderer);
    });
    controls.update();
    renderer.render(scene, camera);
}
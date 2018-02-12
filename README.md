# A Three.js Tutorial

This tutorial will walk you through the basics of setting up a scene, using cube environment maps, bump texture maps, and reflective textures.

## The Project

To see the finished product, `cd` to `threejs_tutorial/finish` and run `npm install` to install the dependencies.
Once that's done, run `npm start` to start the development server.

## Getting Started

Download the archive. `cd` to `threejs_tutorial/start` and run `npm install` to install the dependencies.
Once that's done, run `npm start` to start the development server.

## Creating the Scene Object

A Scene represents the 3D world we will be building. It’s a container for all our 3D objects. Remember to include a capital 'S' in `THREE.Scene()` and a lowercase 's' for the variable name.

```
var scene = new THREE.Scene();
```

## Creating a Camera

The camera is one of two things that will determine how we will see our 3D scene.
The first parameter is the field of view, 
second is the aspect ratio,
third is the near clipping plane,
and fourth is the far clipping plane.
Anything outside the clipping planes won’t be visible to our camera and won’t be included in the calculations used to generate the image.

```
var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
);
```

## Creating the Renderer

Now we'll need to render what the camera sees. Three.js comes with different kinds of renderers, we will be using the WebGL renderer.
There are also `canvas` and `SVG` renderers. The use the CPU for rendering, unlike webGL that uses the GPU. This means rendering time is way faster with the WebGL renderer. Also, some features like shadows and shaders aren’t available to those other renderers. They can be useful if you need to support environments that don't support WebGL.

```
var renderer = new THREE.WebGLRenderer();
```

We also need to set the size of the renderer, which will determine the size of the rendered image.

```
renderer.setSize(window.innerWidth, window.innerHeight);
```

And then append the `renderer`’s `domElement` attribute to the `#root` div, already present in our index.HTML file.

```
document.getElementById(‘root’).appendChild(renderer.domElement);
```

And now we can call the `render()` method of the `renderer` object to get it to display something.

```
renderer.render(scene, camera);
```

If we run this now, we should see a black screen. This is good! This is our 3D world, there’s just nothing to look at yet.

## Creating a Sphere

Let’s make something to look at now. 
Before the `renderer` code, we can add the following code.
When we want to create 3D object in Three.js, we need to define the object's shape and material separately, then they get combined to create a 3D object. Then it needs to be added to the scene.

```
var sphereGeometry = new THREE.SphereGeometry();
var sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffbb00 });
var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
```

If we look at our scene, we won’t be able to see anything yet. This is because the `camera` and the `sphere` we just created are overlapping each other in the center of the scene. 
Let’s fix this by moving the camera towards us, on the z axis.

```
camera.position.z = 10;
```

When no parameters are set for a `SphereGeometry`, it defaults to a polygonal sphere and aren't very pretty. Let’s add some more vertices to it to make it look more round. 
The first parameter is the size (defaults to 1), the second parameter is the width segments, and the third is the height segments. Add parameters to match the following code.

```
var sphereGeometry = new THREE.SphereGeometry(1, 48, 48);
```

To demonstrate how segments work, go to the three.js docs and try playing with the example.
https://threejs.org/docs/#api/geometries/SphereGeometry

## The MeshBasicMaterial

Right now, the ball just looks like a flat circle. It’s 3D, but because the `MeshBasicMaterial` isn’t affected by light, it’s always 100% lit up in all directions and so it looks flat.

## The MeshLambertMaterial

Let's change the material from a `MeshBasicMaterial` to `MeshLambertMaterial`. The lambert material has a matt finish, like rubber or clay.

```
var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xff5500 });
```

If we check our scene, everything should be black again. This is good! It's back because there's no light to illuminate our sphere.

## Creating a Light

There are 6 different kinds of lights in Three.js. We'll create a `PointLight`. The point light is like a light bulb, it shines light in all directions away from a single point.
We’ll create a variable called `pointLight` (lowercase `p` in the var name), set its color, intensity and position, and finally we'll add it to the scene.

```
var pointLight = new THREE.PointLight(0xffffff, 1.2);
pointLight.position.x = 10;
pointLight.position.y = 10;
pointLight.position.z = 10;
scene.add(pointLight);
```

So now we can see our ball, with the light coming in a little bit from the side. It looks 3D, but it would be better if we could see it from different angles.

## Setting up OrbitControls

`OrbitControls` is a package made for Three.js to set up basic click and drag controls for a scene. After the camera code, add the following code to initialize the controls.

```
var controls = new OrbitControls(camera);
```

## Setting up the Render Loop

There’s one more thing we’ll need to set up before we can have the controls working. 
Right now, the `renderer.render()` is being run once, to display a single static image. To be able to update the scene, we’ll need to call it recursively (over and over) for each frame. We could use a `setInterval()` function, but `requestAnimationFrame()` has optimizations for this specific purpose, like pausing when we're not viewing the webpage.

```
animate();

function animate() {
    requestAnimationFrame(function() {
        animate();
    });
    controls.update();
    renderer.render(scene,camera);
}
```

We can take out the old `render.render()` that's outside the `animate()` function. Now, the controls are updated with each frame and the renderer renders the image. 
If we look at our scene, we should be able to drag around and zoom in and out to get a better view of what’s going on.

Now that we have orbitcontrols, lets play around with another kind of material.

## The MeshPhongMaterial
So far, we’ve looked at the `MeshBasicMaterial`, which is always fully illuminated and the `MeshLambertMaterial` which is has a dull, matt finish. 
Lets now try the `MeshPhongMaterial` which adds a `shininess` parameter. Modify the `sphereMaterial` to be a `MeshPhongMaterial` and add a `shininess` parameter, after the color, and set it to 10.

```
var sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xff5500, shininess: 10 });
```

If we look at our scene, the sphere looks a little shiny. Let's jack up the `shininess` to `1000`.
Now our ball very shiny, like a pool ball or something.

## Creating the init() Function

For organization, many Three.js developers decide to put all the code that has to do with the initial setup of the scene in an `init()` function. 
This will make our code neater and takes all our variables out of the global namespace which is always a good thing.

```
init();

function init() {
    // all the code, excluding the require() statements and the animate() function goes in here.
}
```
Make sure to include the `animate()` function call at the bottom of the `init()` function declaration.
We could leave it as-is, with `init()` being called before its declared, as JavaScript ‘hoists’ all functions to the top of their block scope. But, because we only need to call it once, I like to make the function self-calling with the following code.

```
(function init() {
    // all the code, excluding the require() statements and the animate() function declaration goes in here.
}());
```

This way, `init()` is called automatically.

Now that all our variables are not in the global scope, we will need to pass some of them as parameters to the `animate()` function.

At the end of the `init()` function add the following code.

```
animate(controls, renderer, scene, camera);
```

And now modify the `animate()` function to match the following code.

```
function animate(controls, renderer, scene, camera) {
    requestAnimationFrame(function() {
        animate(controls, renderer, scene, camera);
    });
    controls.update();
    renderer.render(scene, camera);
};
```

Now that that’s all done, everything is looking clean and organized.

## Rotations and Creating a Plane

I'd like to set up shadows next but we first need something for the sphere to cast a shadow onto. So let’s make a plane under the sphere.
For now we'll use a lambert material, but feel free to use a phong material and a shininess level to see what it looks like. We'll be using yet another material later though.

The only new thing we're doing here is setting a `rotation` property. Three.js uses radians (not degrees) to calculate angles. Radians are based on the mathematical constant Pi.
A rotation value of `Math.PI` is equal to 180 degrees. So the below rotation value rotates the plane by -90 degrees.

```
var planeGeometry = new THREE.PlaneGeometry(10, 10);
var planeMaterial = new THREE.MeshLambertMaterial({ color: 0x0055ff });
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.y = -1;
plane.rotation.x = -Math.PI / 2;
scene.add(plane);
```

## Setting up Shadows

To render shadows, we first need to tell the renderer that shadows will be rendered.

```
renderer.shadowMap.enabled = true;
```

And tell the light to cast shadows.

```
pointLight.castShadow = true;
```

And now we will set which objects should cast shadows and which objects should receive them.

```
plane.receiveShadow = true;
```

```
sphere.castShadow = true;
```

The shadows are looking a little pixely, so let’s increase their resolution. 
The default is 512, let’s double it. If you’re feeling confident, you can quadruple it, or make it whatever you want.

```
pointLight.shadow.mapSize.width = 2048;
pointLight.shadow.mapSize.height = 2048;
```

## The MeshStandardMaterial

There’s one more material we’ll try out and it’s called the standard material. This material is considered an industry standard, hence its name. 
It has `roughness`, `metalness`, and `opacity` parameters, along with `color`. Let’s try them out on the sphere. 
`Roughness`, `metalness` and `opacity` all take a numbers from 0 to 1. Let’s set `roughness` and `metalness` to `0` and `opacity` to `1`.
Where we have declared the `sphereMaterial`, replace it with this code.

```
var sphereMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xff5500,
    roughness: 0,
    metalness: 0,
    opacity: 1
});
```

Try playing with the `roughness` and `metalness` values to see how it affects the look of the sphere.

If you haven't noticed already, opacity won't do anything yet. We need to set the material's `transparent` parameter to `true` so it will accept an `opacity` value.

```
sphereMaterial.transparent = true;
```

Now we can set the `opacity` to `0.5` or something and see the result. But I don't think it looks that good so I'm gonna set it back to `1`.

## Adding Textures

Let’s try adding a texture to our plane. We’ll first create an instance of `TextureLoader` so we can use it more than once.
Add the following variable above the `scene` variable.

```
var textureLoader = new THREE.TextureLoader();
```

Now we can load in a texture and set it as an overlay on our `planeMaterial`.
There's a concrete texture called rock.jpg inside the assets folder. Let's use that.
(it's named rock because I kept spelling concrete wrong :s)

```
planeMaterial.map = textureLoader.load('assets/rock.jpg');
```

That looks cool, but it’s a little flat looking. We can fix that with a bump map.
We’ll need to change our plane material to a `MeshStandardMaterial`. This is the only material bump maps are available for. Let’s also set it’s `roughness` to `0.8` for a realistic concrete look.

```
var planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
planeMaterial.bumpMap = textureLoader.load('assets/rock.jpg');
```

Okay, that’s a liiiittle too bumpy. Let’s scale it.

```
planeMaterial.bumpScale = 0.02;
```

Now if we pan our scene around, the plane looks just the right amount of bumpy and rough to look like concrete.

## Setting up the Background

Backgrounds (or environment maps or cube maps) are created from 6 images that are mapped to a cube that will surround the scene. 
You can convert any panoramic/ spherical photo into a cube map to import into three.js for use as an environment map. For today, there’s already an example cube map for us to use as our background inside the assets folder.
First we need to import all of the faces of the cube from our assets folder. Let’s do that above the `scene` variable.

```
var cubeTexture = new THREE.CubeTextureLoader().load([
    'assets/cube/px.png', 'assets/cube/nx.png',
    'assets/cube/py.png', 'assets/cube/ny.png',
    'assets/cube/pz.png', 'assets/cube/nz.png'
]);
```

Now that that’s done, we can set the scene background to the `reflectionCube`.

```
scene.background = cubeTexture;
```

And we can set the `envMap` (environment map) property of out `sphereMaterial` to the `cubeTexture`, to give it something to reflect.

```
sphereMaterial.envMap = reflectionCube;
```

Try playing with the `metalness` and `roughness` values of the `sphereMaterial` to see how it affects the reflection of the background.


































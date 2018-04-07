# Exercise 1: The Basics

In this exercise, we'll setup a scene, an environment map, a bump texture map and explore materials.

## What we're building

To see the finished product:

1. Download the archive.

2. Unzip it and navigate to the unzipped folder in your terminal then run `npm install`.

3. Run `npm run part1-finish`. This will open the completed project.

## Getting Started

Run `npm run part1-start` in your terminal to start the development server.

The files have been setup with Three.js already installed.
If you look at the console, you can see the `THREE` object has been logged.

## Creating the Scene Object

A Scene represents the 3D world we will be building. It’s a container for all our 3D objects.

> 💡 Remember to include a capital 'S' in `THREE.Scene()` and a lowercase 's' for the variable name.

```javascript
var scene = new THREE.Scene();
```

## Creating a Camera

The camera is one of two things that will determine how we will see our 3D scene. (The other is the renderer and we'll create that next)

The first parameter is the field of view,

second is the aspect ratio,

third is the near clipping plane and

fourth is the far clipping plane.

Anything outside the clipping planes won’t be visible to our camera and won’t be included in the calculations used to generate the image.

Heres a picture of what these parameters set for a THREE.js camera:

http://sots.brookes.ac.uk/webmsc/p00700/pngs/threejs_camera_model.png

```javascript
var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
);
```

## Creating the Renderer

Now we'll need to render what the camera sees. Three.js comes with a few different kinds of renderers. 
Today, we will be using the WebGL renderer but there are also the canvas and SVG renderers. 
These use the CPU for rendering, unlike the webGL renderer which uses the GPU. 
This means rendering time is way faster with the WebGL renderer. 
Also, some features like shadows and shaders aren’t available to those other renderers. 
Other renders can be useful if you need to support environments that don't support WebGL.

```javascript
var renderer = new THREE.WebGLRenderer();
```

We also need to set the size of the renderer, which will determine the size of the rendered image.

```javascript
renderer.setSize(window.innerWidth, window.innerHeight);
```

And then append the `renderer`’s `domElement` attribute to the `#root` div, already present in our `index.HTML` file.

```javascript
document.getElementById("root").appendChild(renderer.domElement);
```

And now we can call the `render()` method of the `renderer` object to get it to display something.

```javascript
renderer.render(scene, camera);
```

If we run this now, we should see a black screen.
This is good! This is our 3D world, there’s just nothing to look at yet.

## Creating a Sphere

Let’s make something to look at now.

When we want to create 3D object in Three.js, we need to define the object's shape and material separately.
Then, they get combined to create a 3D object.
Then it needs to be added to the scene.

Before the `renderer` code, we will add the following code.

```javascript
var sphereGeometry = new THREE.SphereGeometry();
var sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffbb00 });
var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
```

If we look at our scene, we won’t be able to see anything yet.
This is because the `camera` and the `sphere` we just created are overlapping each other in the center of the scene.

Let’s fix this by moving the camera towards us, on the z axis.

```javascript
camera.position.z = 10;
```

When no parameters are set for a `SphereGeometry`, it defaults to a polygonal sphere and aren't very pretty.
Let’s add some more vertices to it to make it look more round.

The first parameter is the size (defaults to 1), the second parameter is the width segments, and the third is the height segments.
Add parameters to match the following code.

```javascript
var sphereGeometry = new THREE.SphereGeometry(1, 48, 48);
```

To demonstrate how segments work, go to the three.js docs and try playing with the example.

https://threejs.org/docs/#api/geometries/SphereGeometry

## The MeshBasicMaterial

Right now, the ball just looks like a flat circle. 
It’s 3D, but because the `MeshBasicMaterial` isn’t affected by light, it’s always 100% lit up in all directions and so it looks flat.

## The MeshLambertMaterial

Let's change the material from a `MeshBasicMaterial` to `MeshLambertMaterial`. The lambert material has a matt finish, like rubber or clay.

```javascript
var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xffbb00 });
```

If we check our scene, everything should be black again. This is good! It's back because there's no light to illuminate our sphere.

## Creating a Light

There are 6 different kinds of lights in Three.js.
We'll create a `PointLight`. The point light is like a light bulb: It shines light in all directions, away from a single point.

We’ll create a variable called `pointLight` (lowercase `p` in the `var` name), set its color, intensity and position, and finally we'll add it to the scene.

```javascript
var pointLight = new THREE.PointLight(0xffffff, 1.2);
pointLight.position.x = 10;
pointLight.position.y = 10;
pointLight.position.z = 10;
scene.add(pointLight);
```

So now we can see our ball again with light shining on it little bit from the side.
It looks 3D, but it would be better if we could see it from different angles.

## Setting up OrbitControls

`OrbitControls` is a package made for Three.js to set up basic click and drag controls for a scene.
We'll need to do a couple things for it to work. The first is initializing the controls.
After the camera code, add the following code.

```javascript
var controls = new OrbitControls(camera);
```

## Setting up the Render Loop

There’s one more thing we’ll need to set up before we can have the controls working.

Right now, the `renderer.render()` is being run once, to display a single static image.
To be able to update the scene, we’ll need to call it recursively (over and over) for each frame.
We could use a `setInterval()` function, but `requestAnimationFrame()` has optimizations for this specific purpose, like pausing when we're not viewing the webpage.

```javascript
animate();

function animate() {
    requestAnimationFrame(function() {
        animate();
    });
    controls.update();
    renderer.render(scene,camera);
}
```

We can take out the old `render.render()` that's outside the `animate()` function.
Now, the controls are updated with each frame and the renderer renders the image.

If we look at our scene, we should be able to drag around and zoom in and out to get a better view of what’s going on.

Now that we have `orbitcontrols`, lets play around with another kind of material.

## The MeshPhongMaterial

So far, we’ve looked at the `MeshBasicMaterial`, which is always fully illuminated and the `MeshLambertMaterial` which is has a dull, matt finish.

Lets now try the `MeshPhongMaterial` which adds a `shininess` parameter.

Modify the `sphereMaterial` to be a `MeshPhongMaterial` and add a `shininess` parameter, after the color, and set it to 10.

```javascript
var sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xffbb00, shininess: 10 });
```

If we look at our scene, the sphere looks a little shiny. Let's jack up the `shininess` to `1000`.

Now our ball very shiny, like a pool ball or something.


Our ball is looking like the moon here with its one dark side which isn't a bad thing but let's see what we can do about it.

If we add a couple more properties, `emissive` and `emissiveIntensity` we can have the sphere look like it's emitting light on its own, similar to the `MeshBasicMaterial`.

`emissive` is the colour the material will emit. This defaults to black. `emissiveIntensity` will change how string it is, and defaults to 1.

```javascript
var sphereMaterial = new THREE.MeshPhongMaterial({ 
  color: 0xffbb00, 
  shininess: 1000, 
  emissive: 0xffbb00, 
  emissiveIntensity: 0.2 
});
```

Now we have the best of `MeshBasicMaterial` and `MeshPhongMaterial` going on.

## Creating the init() Function

For organization, many Three.js developers decide to put all the code that has to do with the initial setup of the scene in an `init()` function.

Doing this will make our code neater and takes all our variables out of the global namespace which is always a good thing.

```javascript
init();

function init() {
    // all the code, excluding the require() statements and the animate() function goes in here.
}
```

Make sure to include the `animate()` function call at the bottom of the `init()` function declaration.

We could leave it as-is, with `init()` being called before its declared, as JavaScript ‘hoists’ all functions to the top of their block scope.
But, because we only need to call it once, I like to make the function self-calling with the following code.

```javascript
(function init() {
    // all the code, excluding the require() statements and the animate() function declaration goes in here.
}());
```

This way, `init()` is called automatically.


Now that all our variables are not in the global scope, we will need to pass some of them as parameters to the `animate()` function.

At the end of the `init()` function add the following code.

```javascript
animate(controls, renderer, scene, camera);
```

And now modify the `animate()` function to match the following code.

```javascript
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

I'd like to set up shadows but we first need something for the sphere to cast a shadow onto. So let’s make a plane under the sphere.

For now we'll use a `meshLambertMaterial`, but feel free to use a `meshPhongMaterial` and a shininess level to see what it looks like.
We'll be using yet another material later though.


The only new thing we're doing here is setting a `rotation` property.
Three.js uses radians (not degrees) to calculate angles. Radians are based on the mathematical constant Pi.

A rotation value of `Math.PI` is equal to 180 degrees. So the below rotation value rotates the plane by -90 degrees.

Add the following code under the sphere code.

```javascript
var planeGeometry = new THREE.PlaneGeometry(10, 10);
var planeMaterial = new THREE.MeshLambertMaterial({ color: 0x0055ff });
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.y = -1;
plane.rotation.x = -Math.PI / 2;
scene.add(plane);
```

## Setting up Shadows

To render shadows, we need do a few different things.

First, we need to tell the renderer that shadows will be rendered.

Add the following code just under the `renderer` code.

```javascript
renderer.shadowMap.enabled = true;
```

Next, we'll tell the light to cast shadows.

Add the following code just under the `pointLight` code.

```javascript
pointLight.castShadow = true;
```

Finally, we'll set which objects should cast shadows and which objects should receive them.

Add the following code just under the `plane` code.

```javascript
plane.receiveShadow = true;
```

And finally, add the following code just under the `sphere` code.

```javascript
sphere.castShadow = true;
```

The shadows are looking a little pixely, so let’s increase their resolution.

The default is 512 so let’s try doubling it. If you’re feeling confident, you can quadruple it. Or make it whatever you want.

Add the following code just under the `pointLight` code.

```javascript
pointLight.shadow.mapSize.width = 2048;
pointLight.shadow.mapSize.height = 2048;
```

## The MeshStandardMaterial

There’s one more material we’ll try out and it’s called the standard material. This material is considered an industry standard, hence its name.

It has `roughness`, `metalness`, and `opacity` parameters, along with `color`. Let’s try them out on the sphere.

`Roughness`, `metalness` and `opacity` all take a numbers from 0 to 1. Let’s set `roughness` and `metalness` to `0` and `opacity` to `1`.

Where we have declared the `sphereMaterial`, replace it with this code.

```javascript
var sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xffbb00,
    roughness: 0,
    metalness: 0
});
```

Try playing with the `roughness` and `metalness` values to see how it affects the look of the sphere.

## Adding Textures

Let’s try adding a texture to our plane. We’ll first create an instance of `TextureLoader` so we can use it more than once.

Add the following variable above the `scene` variable.

```javascript
var textureLoader = new THREE.TextureLoader();
```

Now we can load in a texture and set it as an overlay on our `planeMaterial`.

There's a concrete texture called `rock.jpg` inside the assets folder. Let's use that.
(it's named rock because I kept spelling concrete wrong :s)

```javascript
planeMaterial.map = textureLoader.load('assets/rock.jpg');
```

That looks cool, but it’s a little flat looking. We can fix that with a bump map.

We’ll need to change our plane material to a `MeshStandardMaterial`.
This is the only material bump maps are available for.
Let’s also set it’s `roughness` to `0.8` for a realistic concrete look.

```javascript
var planeMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xffffff, 
  roughness: 0.8 
});
planeMaterial.bumpMap = textureLoader.load('assets/rock.jpg');
```

Okay, that’s a liiiittle too bumpy. Let’s set its `bumpScale` value to 0.02.

```javascript
planeMaterial.bumpScale = 0.02;
```

Now if we pan our scene around, the plane looks just the right amount of bumpy and rough to look like concrete.

## Setting up the Background

Backgrounds (or environment maps, or cube maps) are created from 6 images that are put together in a cube shape that will surround the scene.

You can convert any panoramic or spherical photo into a cube map to import into three.js for use as an environment map.
For today, there’s already an example cube map for us to use as our background inside the assets folder.

First we need to import all of the faces of the cube from our assets folder. Let’s do that above the `scene` variable.

```javascript
var cubeTexture = new THREE.CubeTextureLoader().load([
    'assets/cube/px.png', 'assets/cube/nx.png',
    'assets/cube/py.png', 'assets/cube/ny.png',
    'assets/cube/pz.png', 'assets/cube/nz.png'
]);
```

Now that that’s done, we can set the scene background to the `cubeTexture`.

```javascript
scene.background = cubeTexture;
```

And we can set the `envMap` (environment map) property of our `sphereMaterial` to the `cubeTexture`, to give it something to reflect.

```javascript
sphereMaterial.envMap = cubeTexture;
```

Try playing with the `metalness` and `roughness` values of the `sphereMaterial` to see how it affects the reflection of the background.

And we're done with this exercise! 

Now it's time to learn the basics of shaders!!

# Exercise 2: Shaders

Shaders are custom materials that you can make with the power of math!

## What we're building

Run `npm run part2-finish` to check out the finished product.

This is a very simple example of the power of shaders.
The colour and position of each face of the object is being updated each frame based on a variables being passed into the shader code from Three.js

## Getting Started

Run `npm run part2-start` in your terminal.

## What we're working with

The `main.js` in `threejs_tutorial/shaders/start` has a basic scene already set up.
This is so we can see what the object looks like before our custom shaders are applied.

Right now the object has a `MeshNormalMaterial` applied to it.
This material is mainly used for testing and doesn't require light to be visible.

### What are Shaders?

Shaders are custom materials.
Shaders are written in the OpenGL Shading Language (GLSL).
There are a few different kinds of shaders, today we'll be using vertex shaders and fragment shaders.

### What are Vertex Shaders?

A vertex is where two or more lines meet. So for example, a triangle as three vertexes.

A vertex shader is run once for each vertex of a mesh its applied to.
Also, Three.js will pass in special variables for vertex shaders, including ones that have to do with the vertex position.

### What are Fragment Shaders?

A fragment is similar to a pixel. Fragments are calculated when the 3D object is being rendered as a 2D image.
The fragment shader is applied to each 'fragment' the 2D image takes up of the entire rendered image.
The size covered by a fragment is related to the pixel area, but rasterization can produce multiple fragments 
from the same object per-pixel, depending on various multisampling parameters and OpenGL state.

## Setting up the main.js

We need to do a couple things to our `main.js` before we start writing our shader code.

First, we need to uncomment the `ShaderMaterial` code (lines 16 to 22).

We should also comment out the `MeshNormalMaterial`, now that we're not using it.

Second, in the `animate()` function at the bottom, uncomment the following code.

```javascript
icosahedron.material.uniforms.time.value = time;
```

`time` is a variable that's been setup to start at 0 and add 0.05 each frame.
This line of code passes that variable into the vertex shader.
You can see the value of `time` and how often it's updated by checking the console, where it's being printed each frame.

In the `main.js`, the `ShaderMaterial` has a `uniforms` value that's an object.
The object contains two properties: `type` and `value`. The type is 'f' for float, and the value is set to 0 to start.

This is needed to define exactly what the shader should expect to have passed into it.

### What is the main() function?

Both Fragment and vertex shaders need a `main()` function.

The vertex shader `main()` function gets called once for every vertex of the mesh it's applied to.

The fragment shader `main()` function gets called once* for every fragment the 3D object takes up of the final 2D rendered image.

\* or more depending on various multisampling parameters and OpenGL state.

## Adding Motion to the Faces

With the `time` variable and a little math, we are going to make the faces of the mesh move outward and back inward.

In `shader.vert` We first need to setup some variables we'll be using.

```glsl
uniform float time;
```

This initializes the `time` variable that we passed in.

### What's a Uniform?

A `uniform` variable is used to communicate with your vertex shader from "outside".
They are variables passed into shaders by us, from our code.

Now, we'll add the following code under the `uniform` we just made, a the top of the `shader.vert`.

```glsl
varying float dist;
```

### What's a Varying?

A `varying` variable is for passing values between vertex and fragment shaders. We'll be using `dist` soon in our fragment shader.

Now, we'll set the value of `dist`. Add the following code inside the `main()` function in `shader.vert`

```glsl
dist = sin(time) * 0.5 + 0.5;
```

If you'd like to see what that calculation does, open your terminal, write `node` then drag in the `timeSineOutput.js` file that's inside `threejs_tutorial/part2/start`.
It's a simple program that contains the same calculation and logs the output to the console.
That's what we'll be using to set the position of each face.

Now we'll add the following line of code to initialize a a variable named `offset`, which will be used in calculating the final position of the faces.

Add the following code to inside the `shader.vert`s `main()` function.

```glsl
vec4 offset = vec4(position, 1.0);
```

A `vec4` variable is a variable that contains 4 numbers.

`position` is passed in automatically by Three.js. It's a `vec3` (it contains 3 numbers).

And now, we'll add the following code to update the value stored in `offset`.

```glsl
offset.xyz += normal * dist;
```

In 3D rendering, a normal is a perpendicular line sticking out of the center of a face. 
The `normal` variable is passed in from Three.js.

`.xyz` is used to only target the first three values of the `vec4` variable.

And finally, we'll add the following code to set an internal variable called `gl_Position`. Add it to the `main()` function.

```glsl
gl_Position = projectionMatrix * modelViewMatrix * offset;
```

`gl_Position` is the output position of the current vertex.

`projectionMatrix` and `modelViewMatrix` are built-in variables passed in by ThreeJS.

We won't be able to see the object yet. This is because we haven't given it any colour.

In the `shader.frag` we'll add the following code inside the `main()` function.

```glsl
gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
```

`gl_FragColor` is the variable that determines the colour of the fragment. So the above code is setting each face to white.

And now we can see the object with it's animation.

## Updating the colour

To be able to update the colour, we'll need use the `varying` variable we setup earlier.

Add the following code to the tops of the `shader.frag`.

```glsl
varying float dist;
```

Now, the value of `dist` is shared between the two files.

Add the following code to inside the `main()` function of the `shader.frag`.

```glsl
float red = dist;
float blue = 1.0 - dist;
gl_FragColor = vec4(red, 0.5, blue, 1.0);
```

And now the colour is updating!

And we're done!
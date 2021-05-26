import './style.css'

import * as THREE from 'three';
// OrbitControls - allows to move around the scene, using mouse
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

// scene - is a container
// in order to look inside a scene - we need camera
// Perspective camera - most popular. Mimics what human eye would see

const scene = new THREE.Scene();
// field of view. Percentage out of 360%, what human eye sees
// 2-nd argument - aspect ration
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('bg')
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight); // setting canvas full screen
camera.position.setZ(30); // camera is positioned in the middle of the scene
camera.position.setX(-3);
renderer.render(scene, camera);

// Torus

// material - a wrapping paper for the geometry
// basic material doesn't require light source
// const material = new THREE.MeshBasicMaterial({color: 0xFF6347, wireframe: true});
// for other materials we need lightning

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);


// Lights
// in JS, if we write "0x" before value, it means that we work with HEX value. Thus, no parenthesis needed
const pointLight = new THREE.PointLight(0xffffff); // color - white
pointLight.position.set(5, 5, 5); // moving light from center, but still inside the Torus

// AmbientLight - light across the whole scene, not just inside the Torus. It's like a flat light in the room
const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);


// Helpers
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper); // shows the position of light source

// will listen to DOM events on the mouse and will update camera position accordingly
//const controls = new OrbitControls(camera, renderer.domElement);


function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({color: 0xffffff});
    const star = new THREE.Mesh(geometry, material);

    // generate random coordinates for star
    // create an Array of 3 elements
    // randFloatSpread - generates a random number between -100 to 100
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
    scene.add(star);
}

// create array of 200 values and for each value call addStar f()
Array(200).fill().forEach(addStar);
const spaceTextureBackground = new THREE.TextureLoader().load('space.jpeg');
scene.background = spaceTextureBackground;


// CUSTOM TEXTURES

// Avatar
// texture loader - loads an image
const jeffTexture = new THREE.TextureLoader().load('igor.jpeg');
const jeff = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.MeshBasicMaterial({map: jeffTexture})
);

scene.add(jeff);

// Moon
const moonTexture = new THREE.TextureLoader().load('moon.jpeg');
const normalTexture = new THREE.TextureLoader().load('normal.jpeg');

const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial({
        map: moonTexture,
        normalMap: normalTexture
    })
);

scene.add(moon);

// properties in THREE.js can be assigned in 2 ways as below
moon.position.z = 30;
moon.position.setX(-10);

jeff.position.z = -5;
jeff.position.x = 2;

// Scroll Animation
function moveCamera() {
    // calculate where user scrolls to. Shows how far we are away from the top of the page
    const t = document.body.getBoundingClientRect().top;
    moon.rotation.x += 0.05;
    moon.rotation.y += 0.075;
    moon.rotation.z += 0.05;

    jeff.rotation.y += 0.01;
    jeff.rotation.z += 0.01;

    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.rotation.y = t * -0.0002;
}

// will call mveCamera() f() every time user scrolls
document.body.onscroll = moveCamera;
moveCamera();

// recursive f()
function animate() {
    // The window.requestAnimationFrame() method tells the browser that you wish to perform an animation
    // and requests that the browser calls a specified function to update an animation before the next repaint.
    requestAnimationFrame(animate);

    // updating for every animation frame
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;

    // controls.update();
    renderer.render(scene, camera);
}

animate();


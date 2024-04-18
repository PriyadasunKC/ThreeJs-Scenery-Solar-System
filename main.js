import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.01,
  10000
);
camera.position.set(0, 0, 200); // Set the camera's initial position outside the star cluster

const textureLoader = new THREE.TextureLoader();
textureLoader.load("./public/background/background.jpg", (texture) => {
  scene.background = texture;
});

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("canvas").appendChild(renderer.domElement);

let solarSystem;
let stars;
let solarSystemMixer;
let starsMixer;

// Load the solar system model
function addStarCluster(x, y, z) {
  // Load the star model
  const starLoader = new GLTFLoader();
  starLoader.load(
    "./public/Stars/scene.gltf",
    (gltf) => {
      const stars = gltf.scene;
      stars.position.set(x, y, z);
      stars.scale.set(100, 100, 100);
      scene.add(stars);

      // Set up the animation mixer for the star cluster
      const starsMixer = new THREE.AnimationMixer(stars);
      const starsAction = starsMixer.clipAction(gltf.animations[0]);
      starsAction.play();
    },
    undefined,
    (error) => {
      console.error(error);
    }
  );
}

// Load the solar system model
const loader = new GLTFLoader();
loader.load(
  "./public/scene.gltf",
  (gltf) => {
    solarSystem = gltf.scene;
    scene.add(solarSystem);

    // Set up the animation mixer for the solar system
    solarSystemMixer = new THREE.AnimationMixer(solarSystem);
    const solarSystemAction = solarSystemMixer.clipAction(gltf.animations[0]);
    solarSystemAction.play();

    // Add the star clusters after the solar system is loaded
    for (let i = 0; i < 100; i++) {
      const x = (Math.random() - 0.5) * 1000; 
      const y = (Math.random() - 0.5) * 1000;
      const z = (Math.random() - 0.5) * 1000;
      addStarCluster(x, y, z); 
    }
  },
  undefined,
  (error) => {
    console.error(error);
  }
);

// Add lighting for the scene
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  // Update the solar system animation
  if (solarSystemMixer) {
    solarSystemMixer.update(0.01);
  }

  // Update the star cluster animation
  if (starsMixer) {
    starsMixer.update(0.01);
  }

  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

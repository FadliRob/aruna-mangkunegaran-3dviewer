import * as THREE from "./libs/three.module.js";
import { GLTFLoader } from "./libs/GLTFLoader.js";
import { RGBELoader } from "./libs/RGBELoader.js";
import { PointerLockControls } from "./libs/PointerLockControls.js";

let scene, camera, renderer, controls;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;

function init() {
    scene = new THREE.Scene();

    // ========== CAMERA ==========
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(0, 3, 5);

    // ========== RENDERER ==========
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);

    // ========== HDRI ==========
    new RGBELoader()
        .setPath("/hdr/")
        .load("env.hdr", (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.environment = texture;
            scene.background = texture;
        });

    // ========== LIGHT ==========
    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2));

    // ========== POINTER LOCK ==========
    controls = new PointerLockControls(camera, document.body);
    document.getElementById("lookButton").onclick = () => controls.lock();

    // ========== KEYBOARD ==========
    document.addEventListener("keydown", (e) => {
        if (e.key === "w") moveForward = true;
        if (e.key === "s") moveBackward = true;
        if (e.key === "a") moveLeft = true;
        if (e.key === "d") moveRight = true;
    });

    document.addEventListener("keyup", (e) => {
        if (e.key === "w") moveForward = false;
        if (e.key === "s") moveBackward = false;
        if (e.key === "a") moveLeft = false;
        if (e.key === "d") moveRight = false;
    });

    // ========== LOAD GLB ==========
    const loader = new GLTFLoader();
    loader.load("/model/Mangkunegaran.glb", (gltf) => {
        scene.add(gltf.scene);
        document.getElementById("loading").style.display = "none";
    });

    // ========== MOBILE JOYSTICK ==========
    const joy = new Joystick(document.getElementById("joystickContainer"));

    setInterval(() => {
        moveForward = joy.value.y < -0.3;
        moveBackward = joy.value.y > 0.3;
        moveLeft = joy.value.x < -0.3;
        moveRight = joy.value.x > 0.3;
    }, 10);

    window.addEventListener("resize", onResize);
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    const speed = 0.1;

    const dir = new THREE.Vector3();
    dir.z = Number(moveForward) - Number(moveBackward);
    dir.x = Number(moveRight) - Number(moveLeft);
    dir.normalize();

    controls.moveRight(dir.x * speed);
    controls.moveForward(dir.z * speed);

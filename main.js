let scene, camera, renderer, controls;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;

let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();

init();
animate();

function init() {
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );
    camera.position.set(0, 3, 5);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputEncoding = THREE.sRGBEncoding;

    document.body.appendChild(renderer.domElement);

    // === HDRI Environment ===
    new THREE.RGBELoader()
        .setPath("hdr/")
        .load("env.hdr", function (texture) {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.environment = texture;
            scene.background = texture; // bisa diganti null jika mau background polos
        });

    // Light
    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2));

    // FPS Controls
    controls = new THREE.PointerLockControls(camera, document.body);
    document.getElementById("lookButton").addEventListener("click", () => {
        controls.lock();
    });

    // Keyboard controls
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

    // Load Model
    const loader = new THREE.GLTFLoader();
    loader.load("./model/Mangkunegaran.glb", (gltf) => {
        scene.add(gltf.scene);
        document.getElementById("loading").style.display = "none";
    });

    // Joystick
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

    const speed = 0.08;

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();

    controls.moveRight(direction.x * speed);
    controls.moveForward(direction.z * speed);

    renderer.render(scene, camera);
}

// --- 1. SETUP THE SCENE (Like allocating memory in C) ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg-canvas'), antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 5;


// --- 2. CREATE THE 3D "7th" TEXT LOGO ---
const ramGroup = new THREE.Group();
scene.add(ramGroup);

// Material for the 3D text structure
const textMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x111115, 
    metalness: 0.9, 
    roughness: 0.2 
});
const wireMat = new THREE.LineBasicMaterial({ color: 0xbc0000 });

// Initialize the font loader
const fontLoader = new THREE.FontLoader();

// We load a high-tech font layout directly from a secure open-source URI
fontLoader.load('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/fonts/helvetiker_bold.typeface.json', function (font) {
    
    const textGeometry = new THREE.TextGeometry('7th', {
        font: font,
        size: 1.5,          // Size of the text
        height: 0.4,        // Thickness / Depth (Extrusion) of the 3D text
        curveSegments: 12,  // Smoothness of curves
        bevelEnabled: true, // Smooth tech-style edges
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelSegments: 5
    });

    // Center the 3D geometry calculations perfectly around its local axis
    textGeometry.center();

    // Create the solid 3D mesh
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    
    // Add that signature holographic wireframe outline you like
    const edgeGeo = new THREE.EdgesGeometry(textGeometry);
    const wireframe = new THREE.LineSegments(edgeGeo, wireMat);
    textMesh.add(wireframe);

    // Add it into our animation group
    ramGroup.add(textMesh);
});



// --- 3. LIGHTING ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Neon colored accent light pointing directly at our RAM
const neonLight = new THREE.PointLight(0xbc0000, 2, 10);
neonLight.position.set(0, 0, 2);
scene.add(neonLight);

// --- 4. INTERACTIVE MOUSE MOVEMENT (Capturing coordinates) ---
let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
});

// --- 5. THE ANIMATION LOOP (Like a while(1) loop in C) ---
function animate() {
    requestAnimationFrame(animate);

    // Rotate the group based on time + mouse positioning
    ramGroup.rotation.y += 0.005;
    ramGroup.rotation.y += mouseX * 0.05;
    ramGroup.rotation.x += mouseY * 0.05;

    renderer.render(scene, camera);
}
animate();

// --- 6. DYNAMIC UI INTERACTION (The JS functions called by HTML buttons) ---
window.changeColor = function(colorHex) {
    // Dynamically updates the color pointer of the neon hardware light
    neonLight.color.set(colorHex);
};

// Adjust sizing cleanly if browser window changes
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

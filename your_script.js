// Scene setup
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Adjust camera position
camera.position.z = 15; // Increase the z distance so all cubes are visible

// OrbitControls for camera manipulation
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // An optional setting that gives a smoother control feel
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// Adding an HDRI background and lighting
new THREE.RGBELoader()
    .setDataType(THREE.UnsignedByteType) // Depending on the HDR content
    .load('forest.hdr', function(texture) {
        var envMap = pmremGenerator.fromEquirectangular(texture).texture;
        scene.background = envMap;
        scene.environment = envMap;

        texture.dispose();
        pmremGenerator.dispose();

        // You can now add objects to your scene here
    });
	
// PMREMGenerator for generating a prefiltered, mipmapped radiance environment map (PMREM) from an equirectangular texture
var pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();



// Polycube configuration
function createPolycube() {
    var geometry = new THREE.BoxGeometry(); // Unit cube geometry
    var material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.5, // Adjust for metallic effect
        roughness: 0.1 // Adjust for surface roughness
    });

    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
                var cube = new THREE.Mesh(geometry, material);
                cube.position.set(x * 2, y * 2, z * 2);
                scene.add(cube);
            }
        }
    }
}

createPolycube();



// Render loop
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Only required if controls.enableDamping = true, or if controls.autoRotate = true
    renderer.render(scene, camera);
}

animate();

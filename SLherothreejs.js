// Initialize the scene and load the GLTF model
function init() {
  // Create a scene
  var scene = new THREE.Scene();

  // Create a camera
  var camera = new THREE.PerspectiveCamera(
    24,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 1); // Adjust the camera position as needed

  // Create a WebGL renderer
  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0xffffff); // Set the clear color to white and alpha to 0 (transparent)
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Append the renderer to the container element
  var container = document.getElementById("canvas-wrapper");
  container.appendChild(renderer.domElement);

  var light = new THREE.AmbientLight(0xffffff, 4); // soft white light
  scene.add(light);

  // Create directional lights
  var light1 = new THREE.DirectionalLight(0xffffff, 2);
  light1.position.set(-2, 1, 2); // Adjust the position as needed
  scene.add(light1);

  var light2 = new THREE.DirectionalLight(0xffffff, 5);
  light2.position.set(2, 0, 2); // Adjust the position as needed
  scene.add(light2);

  var light3 = new THREE.DirectionalLight(0xffffff, 5);
  light3.position.set(0, -0.1, 1); // Adjust the position as needed
  scene.add(light3);

  var light4 = new THREE.DirectionalLight(0xffffff, 3);
  light4.position.set(0, 0, -2); // Adjust the position as needed
  scene.add(light4);

  // Load the GLTF model
  var loader = new THREE.GLTFLoader();
  loader.load(
    "https://raw.githubusercontent.com/MRPH95/HicSum/main/SL%20Logo%20curves.gltf",
    function (gltf) {
      var model = gltf.scene;

      // Set the initial position, scale, and rotation of the model as desired
      model.position.set(0, 0, 0);
      model.scale.set(0.5, 0.5, 0.5);
      model.rotation.set(0, 0, 0);

      // Traverse the model and apply the textures
      model.traverse(function (child) {
        if (child.isMesh) {
          // Apply the base color texture
          var baseColorTexture = new THREE.TextureLoader().load(
            "https://raw.githubusercontent.com/MRPH95/HicSum/main/FabricLeatherBuffaloRustic001_COL_VAR2_1K.jpg"
          );
          child.material.map = baseColorTexture;
          // Tint the base color of the model
          var baseColor = new THREE.Color("#201c1e");
          child.material.color = baseColor;
          // Set the emissive color of the model
          var emissiveColor = new THREE.Color("#D6D4D3");
          child.material.emissive = emissiveColor;
          child.material.emissiveIntensity = 0.01; // Adjust the intensity as needed

          // Apply the bump map
          var bumpMap = new THREE.TextureLoader().load(
            "https://raw.githubusercontent.com/MRPH95/HicSum/main/FabricLeatherBuffaloRustic001_BUMP_1K.jpg"
          );
          child.material.bumpMap = bumpMap;

          // Apply the normal map
          var normalMap = new THREE.TextureLoader().load(
            "https://raw.githubusercontent.com/MRPH95/HicSum/main/FabricLeatherBuffaloRustic001_NRM_1K.jpg"
          );
          child.material.normalMap = normalMap;

          // Apply the roughness map
          var roughnessMap = new THREE.TextureLoader().load(
            "https://raw.githubusercontent.com/MRPH95/HicSum/main/FabricLeatherBuffaloRustic001_GLOSS_1K.jpg"
          );
          child.material.roughnessMap = roughnessMap;

          // Apply the reflection map
          var reflectionMap = new THREE.TextureLoader().load(
            "https://raw.githubusercontent.com/MRPH95/HicSum/main/FabricLeatherBuffaloRustic001_REFL_1K.jpg"
          );
          child.material.envMap = reflectionMap;
          
              // Apply the ambient occlusion (AO) map
    var aoMap = new THREE.TextureLoader().load(
      "https://raw.githubusercontent.com/MRPH95/HicSum/main/FabricLeatherBuffaloRustic001_AO_1K.jpg"
    );
    child.material.aoMap = aoMap;
    child.material.aoMapIntensity = 1; // Adjust the intensity as needed
        }
      });

      // Add the model to the scene
      scene.add(model);

      // Create particles
      var particleCount = 250;
      var particles = new THREE.Group();
      var particleGeometry = new THREE.SphereBufferGeometry(0.001, 6, 6);
      var particleMaterial = new THREE.MeshBasicMaterial({ color: 0xd8bfc3 });

      for (var i = 0; i < particleCount; i++) {
        var particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.set(
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          Math.random() * 2 - 1
        );
        particle.userData.velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.005, // Adjust the velocity range as needed
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005
        );
        particles.add(particle);
      }

      scene.add(particles);

      // Create a composer for post-processing
      var composer = new THREE.EffectComposer(renderer);
      composer.setSize(window.innerWidth, window.innerHeight);

      // Create a render pass
      var renderPass = new THREE.RenderPass(scene, camera);
      composer.addPass(renderPass);

      // Create a bokeh pass
      var bokehPass = new THREE.BokehPass(scene, camera, {
        focus: 20,
        aperture: 0.000001,
        maxblur: 5,
      });
      composer.addPass(bokehPass);

      // Track scroll position
      var scrollY = 0;

      // Update scroll position on scroll event
      window.addEventListener("scroll", function () {
        scrollY = window.scrollY;
      });
      
// Constants
var MOUSE_SENSITIVITY = 0.01; // Adjust the mouse sensitivity as needed
var TARGET_OFFSET_Y = 1; // Offset in the y-axis

// Variables
var targetRotationY = 0;
var targetRotationX = 0;

// Event listeners
document.addEventListener('mousemove', onDocumentMouseMove, false);

// Mouse move event handler
function onDocumentMouseMove(event) {
  var mouseX = (event.clientX - window.innerWidth / 2) * MOUSE_SENSITIVITY;
  var mouseY = (event.clientY - window.innerHeight / 2) * MOUSE_SENSITIVITY;
  targetRotationY = mouseX;
  targetRotationX = mouseY;
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update model rotation based on mouse movement
  model.rotation.y += (targetRotationY - model.rotation.y) * 0.05;
  model.rotation.x += (targetRotationX - model.rotation.x) * 0.05;

  // Update camera's lookAt with offset
  var targetPosition = model.position.clone();
  targetPosition.y += TARGET_OFFSET_Y;
  camera.lookAt(targetPosition);

  // Update particle positions
  particles.children.forEach(function (particle) {
    particle.position.add(particle.userData.velocity);

    if (
      particle.position.x < -1 ||
      particle.position.x > 1 ||
      particle.position.y < -1 ||
      particle.position.y > 1 ||
      particle.position.z < -1 ||
      particle.position.z > 1
    ) {
      particle.position.set(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      );
      particle.userData.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005
      );
    }
  });

  // Render the scene
  composer.render();
}

// Start the animation loop
animate();




    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
}

// Call the init function to start the application
init();

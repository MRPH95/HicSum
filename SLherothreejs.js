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
  camera.position.set(0, 0.1, 1); // Adjust the camera position as needed

  // Create a WebGL renderer
  var renderer = new THREE.WebGLRenderer({ antialias: "auto", alpha: true });
  renderer.setClearColor(0xffffff, 0); // Set the clear color to white and alpha to 0 (transparent)
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Append the renderer to the container element
  var container = document.getElementById("canvas-wrapper");
  container.appendChild(renderer.domElement);


  var light = new THREE.AmbientLight(0xffffff, 4); // soft white light
  scene.add(light);

  // Create a hemisphere light
  var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 3);
  hemisphereLight.position.set(0, 0, 1); // Adjust the position as needed
  scene.add(hemisphereLight);
  
  // Create directional lights
  var light1 = new THREE.DirectionalLight(0xffffff, 7);
  light1.position.set(-2, 1, 2); // Adjust the position as needed
  scene.add(light1);

  var light2 = new THREE.DirectionalLight(0xd8bfc3, 5);
  light2.position.set(2, 0, 2); // Adjust the position as needed
  scene.add(light2);

  var light3 = new THREE.DirectionalLight(0xffffff, 5);
  light3.position.set(-1, -0.1, 1); // Adjust the position as needed
  scene.add(light3);

  var light4 = new THREE.DirectionalLight(0xffffff, 3);
  light4.position.set(0, 0, 10); // Adjust the position as needed
  scene.add(light4);

  var light5 = new THREE.DirectionalLight(0xffffff, 3);
  light5.position.set(0, 0, 2); // Adjust the position as needed
  scene.add(light5);  
  
    var light6 = new THREE.DirectionalLight(0xffffff, 7);
  light5.position.set(-.3, -1, 1; // Adjust the position as needed
  scene.add(light6);  
  
  // Load the GLTF model
  var loader = new THREE.GLTFLoader();
  loader.load(
    "https://raw.githubusercontent.com/MRPH95/HicSum/main/SL%20Logo%20curves.gltf",
    function (gltf) {
      var model = gltf.scene;

      // Set the initial position, scale, and rotation of the model as desired
      model.position.set(0, 0, 0);
      model.scale.set(0.55, 0.55, 0.55);
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
          var emissiveColor = new THREE.Color("#201c1e");
          child.material.emissive = emissiveColor;
          child.material.emissiveIntensity = 0.05; // Adjust the intensity as needed

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
      var particleCount = 4;
      var particles = new THREE.Group();
      var particleGeometry = new THREE.SphereBufferGeometry(0.0001, 6, 6);
      var particleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

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
var MOUSE_SENSITIVITY = 0.003; // Adjust the mouse sensitivity as needed
var TARGET_OFFSET_Y = 0.11; // Offset in the y-axis
var TARGET_OFFSET_X = -.1; // Offset in the x-axis
var MAX_ROTATION_X = Math.PI / 12; // Maximum rotation in radians
var SPIN_SENSITIVITY = 0.005; // Adjust the spin sensitivity as needed

// Variables
var targetRotationY = 0;
var targetRotationX = 0;
var spinEnabled = false;
var spinSpeed = 0;

// Event listeners
document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('mouseup', onDocumentMouseUp, false);

// Mouse move event handler
function onDocumentMouseMove(event) {
  var mouseX = (event.clientX - window.innerWidth / 2) * MOUSE_SENSITIVITY;
  var mouseY = (event.clientY - window.innerHeight / 2) * MOUSE_SENSITIVITY;
  targetRotationY = mouseX;
  targetRotationX = Math.max(-MAX_ROTATION_X, Math.min(MAX_ROTATION_X, mouseY));
}

// Mouse down event handler
function onDocumentMouseDown(event) {
  spinEnabled = true;
}

// Mouse up event handler
function onDocumentMouseUp(event) {
  spinEnabled = false;
}

     // Animation loop
      function animate() {
        requestAnimationFrame(animate);

        // Rotate the model
        model.rotation.y += 0.01; // Adjust the rotation speed as desired
  
  // Update model rotation based on mouse movement
  model.rotation.y += (targetRotationY - model.rotation.y) * 0.05;
  model.rotation.x += (targetRotationX - model.rotation.x) * 0.05;

  // Spin the model if enabled
  if (spinEnabled) {
    model.rotation.y += spinSpeed;
  }

  // Update camera's lookAt with offset
  var targetPosition = model.position.clone();
  targetPosition.y += TARGET_OFFSET_Y;
  targetPosition.x +=  TARGET_OFFSET_X;
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

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Adjust model scale based on window width
  var modelScale = 0.55; // Initial model scale
  var targetOffsetX = 0; // Target offset in the X direction
  var targetPosition = new THREE.Vector3(0, 0, 0); // Target position for camera lookAt

  if (window.innerWidth < 840) {
    var scaleFactor = window.innerWidth / 840; // Calculate scale factor
    modelScale = 0.55 * scaleFactor; // Apply scale factor to initial scale

    // Smooth transition for camera offset in the X direction
    var currentOffsetX = camera.position.x; // Current offset in the X direction
    var offsetTransitionSpeed = 0.02; // Transition speed for the offset

    function animateOffset() {
      var dx = targetOffsetX - currentOffsetX; // Calculate the difference
      currentOffsetX += dx * offsetTransitionSpeed; // Update the current offset
      camera.position.x = currentOffsetX; // Set the camera offset

      // Smooth transition for camera target to (0, 0, 0)
      var currentPosition = new THREE.Vector3(
        model.position.x,
        model.position.y + TARGET_OFFSET_Y,
        model.position.z + TARGET_OFFSET_X
      ); // Current position for camera lookAt
      var positionTransitionSpeed = 0.02; // Transition speed for the position

      var dp = targetPosition.clone().sub(currentPosition); // Calculate the position difference
      currentPosition.add(dp.multiplyScalar(positionTransitionSpeed)); // Update the current position

      model.position.y = currentPosition.y - TARGET_OFFSET_Y; // Adjust model position in the Y direction
      model.position.x = currentPosition.z - TARGET_OFFSET_X; // Adjust model position in the X direction

      if (Math.abs(dx) > 0.001 || dp.length() > 0.001) {
        requestAnimationFrame(animateOffset);
      }
    }

    animateOffset();
  } else {
    // Set camera offset and model position directly if width is not less than 840
    camera.position.x = targetOffsetX;
    model.position.y = -TARGET_OFFSET_Y;
    model.position.x = -TARGET_OFFSET_X;
  }

  // Set the model scale
  model.scale.set(modelScale, modelScale, modelScale);
}

// Check the window width on page load
if (window.innerWidth < 840) {
  onWindowResize();
}

// Call onWindowResize when the window is resized
window.addEventListener("resize", onWindowResize);


  
  // Render the scene
  renderer.render(scene, camera);
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

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
  renderer.setClearColor(0x000000, 0); // Set the clear color to black and alpha to 0 (transparent)
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Append the renderer to the container element
  var container = document.getElementById("canvas-wrapper");
  container.appendChild(renderer.domElement);

  var light = new THREE.AmbientLight(0xffffff); // soft white light
  scene.add(light);

  // Create directional lights
  var light1 = new THREE.DirectionalLight(0xffffff, 1);
  light1.position.set(-2, 1, 2); // Adjust the position as needed
  scene.add(light1);

  var light2 = new THREE.DirectionalLight(0xd8bfc3, 2);
  light2.position.set(2, 0, 2); // Adjust the position as needed
  scene.add(light2);

  var light3 = new THREE.DirectionalLight(0xffffff, 1);
  light3.position.set(0, -0.1, 1); // Adjust the position as needed
  scene.add(light3);

  var light4 = new THREE.DirectionalLight(0xffffff, 1);
  light4.position.set(0, 0, -3); // Adjust the position as needed
  scene.add(light4);

  // Load the GLTF model
  var loader = new THREE.GLTFLoader();
  loader.load(
    "https://raw.githubusercontent.com/MRPH95/HicSum/main/SL%20Logo.gltf",
    function (gltf) {
      var model = gltf.scene;

      // Set the initial position, scale, and rotation of the model as desired
      model.position.set(0, -.1, 0);
      model.scale.set(.5, .5, .5);
      model.rotation.set(0, 0, 0);

      // Traverse the model and apply the textures
      model.traverse(function (child) {
        if (child.isMesh) {
          // Apply the base color texture
          var baseColorTexture = new THREE.TextureLoader().load(
            "https://raw.githubusercontent.com/MRPH95/HicSum/c8a3d8bceff9eb430fdbb5593c97daa73c5bcb36/FabricLeatherBuffaloRustic001_COL_VAR2_1K.jpg"
          );
          child.material.map = baseColorTexture;
          // Tint the base color of the model
          var baseColor = new THREE.Color("#201c1e");
          child.material.color = baseColor;
          // Set the emissive color of the model
          var emissiveColor = new THREE.Color("#D6D4D3");
          child.material.emissive = emissiveColor;
          child.material.emissiveIntensity = .01; // Adjust the intensity as needed

          // Apply the bump map
          var bumpMap = new THREE.TextureLoader().load(
            "https://raw.githubusercontent.com/MRPH95/HicSum/c8a3d8bceff9eb430fdbb5593c97daa73c5bcb36/FabricLeatherBuffaloRustic001_BUMP_1K.jpg"
          );
          child.material.bumpMap = bumpMap;

          // Apply the normal map
          var normalMap = new THREE.TextureLoader().load(
            "https://raw.githubusercontent.com/MRPH95/HicSum/c8a3d8bceff9eb430fdbb5593c97daa73c5bcb36/FabricLeatherBuffaloRustic001_NRM_1K.jpg"
          );
          child.material.normalMap = normalMap;

          // Apply the roughness map
          var roughnessMap = new THREE.TextureLoader().load(
            "https://raw.githubusercontent.com/MRPH95/HicSum/c8a3d8bceff9eb430fdbb5593c97daa73c5bcb36/FabricLeatherBuffaloRustic001_GLOSS_1K.jpg"
          );
          child.material.roughnessMap = roughnessMap;

          // Apply the reflection map
          var reflectionMap = new THREE.TextureLoader().load(
            "https://raw.githubusercontent.com/MRPH95/HicSum/c8a3d8bceff9eb430fdbb5593c97daa73c5bcb36/FabricLeatherBuffaloRustic001_REFL_1K.jpg"
          );
          child.material.envMap = reflectionMap;
        }
      });

      // Add the model to the scene
      scene.add(model);

      // Create particles
      var particleCount = 500;
      var particles = new THREE.Group();
      var particleGeometry = new THREE.SphereBufferGeometry(0.001, 6, 6);
      var particleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

      for (var i = 0; i < particleCount; i++) {
        var particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.set(
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          Math.random() * 2 - 1
        );
        particle.userData.velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.002, // Adjust the velocity range as needed
          (Math.random() - 0.5) * 0.002,
          (Math.random() - 0.5) * 0.002
        );
        particles.add(particle);
      }

      scene.add(particles);

      // Create a point light for particle illumination
      var particleLight = new THREE.PointLight(0xffffff, 1, 2); // Adjust the color and intensity as needed
      scene.add(particleLight);

      // Animate the model and particles
      function animate() {
        // Rotate the model counterclockwise on the vertical axis
        model.rotation.y += 0.01; // Adjust the rotation speed as needed

        // Render the scene with the camera
        renderer.render(scene, camera);

        // Update the particle positions and illuminate them
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
          }
        });

        // Update the particle light position
        particleLight.position.copy(camera.position);

        // Request the next frame
        requestAnimationFrame(animate);
      }

      // Start the animation
      animate();
    }
  );

  // Handle window resizing
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener("resize", onWindowResize, false);
}

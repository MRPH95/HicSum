// Initialize the scene and load the GLTF model
function init() {
  // Create a scene
  var scene = new THREE.Scene();

  // Create a camera
  var camera = new THREE.PerspectiveCamera(
    2,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 2); // Adjust the camera position as needed

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
  light3.position.set(0.3, 0.5, -1); // Adjust the position as needed
  scene.add(light3);

  var light4 = new THREE.DirectionalLight(0xffffff, 1);
  light4.position.set(0, 0, 1); // Adjust the position as needed
  scene.add(light4);

  // Load the GLTF model
  var loader = new THREE.GLTFLoader();
  loader.load(
    "https://raw.githubusercontent.com/MRPH95/HicSum/main/SL%20Logo.gltf",
    function (gltf) {
      var model = gltf.scene;

      // Set the initial position, scale, and rotation of the model as desired
      model.position.set(-.03, 0, 1);
      model.scale.set(.1, .1, .1);
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
          var baseColor = new THREE.Color("#D6D4D3");
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

      // Create the reflective floor
      var floorGeometry = new THREE.PlaneGeometry(100, 100, 100, 100);
      var floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x1F1D1D,
        metalness: 5,
        roughness: 1,
      });
      var floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = -Math.PI / 2; // Rotate the floor to be horizontal
      floor.position.y = -2; // Adjust the position as needed

      // Add grid pattern to the floor
      var gridTexture = new THREE.TextureLoader().load(
        "https://threejs.org/examples/textures/grid.png"
      );
      gridTexture.wrapS = THREE.RepeatWrapping;
      gridTexture.wrapT = THREE.RepeatWrapping;
      gridTexture.repeat.set(100, 100);
      floorMaterial.map = gridTexture;
      floorMaterial.transparent = true;
      floorMaterial.opacity = 0.3;

      scene.add(floor);

      // Function to handle scroll events
      function handleScroll() {
        scrollTarget = window.scrollY || window.pageYOffset;
      }

      // Variables to store the scroll position
      var scrollPos = 0;
      var scrollTarget = 0;

      // Function to handle scroll events
      function handleScroll() {
        scrollTarget = window.scrollY || window.pageYOffset;
      }

      // Animate the model
      function animate() {
        // Update the scroll position
        scrollPos += (scrollTarget - scrollPos) * 0.1; // Adjust the scroll factor for slower scrolling

        // Update the camera's position based on the scroll position
        camera.position.y = -scrollPos * 10; // Adjust the factor as needed

        // Rotate the model counterclockwise on the vertical axis
        model.rotation.y += 0.01; // Adjust the rotation speed as needed

        // Render the scene with the camera
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);

        // Call animate recursively
        requestAnimationFrame(animate);
      }

      // Start the animation loop
      animate();
    },
    undefined,
    function (error) {
      console.error("Error loading GLTF model:", error);
    }
  );

  // Function to handle window resize events
  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Listen for window resize events
  window.addEventListener("resize", handleResize);
}

// Initialize the scene after the Three.js library and GLTFLoader have been loaded
window.addEventListener("DOMContentLoaded", function () {
  init();
});
  </script>
</body>
</html>

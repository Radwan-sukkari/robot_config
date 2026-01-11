//هو المسؤول عن "الإضاءة، الكاميرا، والأرضية".
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { getThreeJSColor } from "../utils/themeLoader.js";

export class SceneManager {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.objects = {};

    this.init();
  }

  init() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(getThreeJSColor("background"));

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(3, 3, 3);
    this.camera.lookAt(0, 0, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 0.5, 0);
    this.controls.update();

    this.setupLights();

    this.addGrid();

    this.addFloor();

    window.addEventListener("resize", () => this.onWindowResize());

    // Start animation loop
    this.animate();

    console.log("✅ SceneManager initialized (Three.js 0.128)");
  }

  setupLights() {
    const ambientLight = new THREE.AmbientLight(
      getThreeJSColor("ambient"),
      0.8
    );
    this.scene.add(ambientLight);

    // 2. Directional Light: إضاءة الشمس (الأساسية)
    const directionalLight = new THREE.DirectionalLight(
      getThreeJSColor("directional"),
      1.2
    );
    directionalLight.position.set(10, 15, 10); // أبعدنا المصدر ليعطي ظلال أنعم
    directionalLight.castShadow = true;

    // تحسين جودة الظل
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    this.scene.add(directionalLight);

    // 3. Hemisphere Light: لإعطاء لون طبيعي للسماء والأرض
    // استخدم لون رمادي مزرق للسماء ورمادي غامق للأرض
    const hemisphereLight = new THREE.HemisphereLight(0xeeeeee, 0x333333, 0.5);
    this.scene.add(hemisphereLight);

    // 4. Point Light (إضافة جديدة): تعطي "لمعة" احترافية على المفاصل
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(-5, 5, -5);
    this.scene.add(pointLight);
  }
  addGrid() {
    const gridHelper = new THREE.GridHelper(
      10,
      20,
      getThreeJSColor("gridMain"),
      getThreeJSColor("gridSecondary")
    );
    gridHelper.position.y = 0.01;
    this.scene.add(gridHelper);
  }

  addFloor() {
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: getThreeJSColor("floor"), //
      roughness: 0.8,
      metalness: 0.2,
    });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.userData = { id: "floor", type: "floor", name: "Floor" };

    this.scene.add(floor);
    this.objects["floor"] = floor;

    console.log("✅ Floor added");
  }

  addObject(id, object3D, userData = {}) {
    object3D.userData = { id, ...userData };
    this.scene.add(object3D);
    this.objects[id] = object3D;

    console.log(`✅ Added object to scene: ${id}`);

    return object3D;
  }

  removeObject(id) {
    const object = this.objects[id];
    if (object) {
      this.scene.remove(object);
      delete this.objects[id];
      console.log(`🗑️ Removed object from scene: ${id}`);
    }
  }

  getObject(id) {
    return this.objects[id];
  }

  updateObjectTransform(id, transform) {
    const object = this.objects[id];
    if (!object) {
      console.warn(`⚠️ Object ${id} not found in scene`);
      return;
    }

    console.log(`🔄 Updating transform for ${id}:`, transform);

    if (transform.position) {
      object.position.set(
        transform.position.x || 0,
        transform.position.y || 0,
        transform.position.z || 0
      );
      console.log("  ✓ Position updated:", object.position);
    }

    if (transform.rotation) {
      object.rotation.set(
        THREE.MathUtils.degToRad(transform.rotation.x || 0),
        THREE.MathUtils.degToRad(transform.rotation.y || 0),
        THREE.MathUtils.degToRad(transform.rotation.z || 0)
      );
      console.log("  ✓ Rotation updated:", object.rotation);
    }

    if (transform.scale) {
      object.scale.set(
        transform.scale.x || 1,
        transform.scale.y || 1,
        transform.scale.z || 1
      );
    }

    // Force matrix update
    object.updateMatrix();
    object.updateMatrixWorld(true);

    console.log(`✅ Transform applied for: ${id}`);
  }

  onWindowResize() {
    this.camera.aspect =
      this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.controls.update();

    // Update robot if exists
    if (this.objects["robot"]) {
      this.objects["robot"].updateMatrixWorld(true);
    }

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.renderer.dispose();
    this.controls.dispose();
    window.removeEventListener("resize", () => this.onWindowResize());

    console.log("🗑️ SceneManager disposed");
  }
}

import { SceneManager } from "../../scene/SceneManager.js";
import { RobotLoader } from "../../scene/RobotLoader.js";
import { configState } from "../../state/configState.js";
import { addSceneObject } from "../../state/sceneState.js";
import * as THREE from "three";

// 🖼️ 3D Canvas Component
export class Canvas3D {
  constructor(container) {
    this.container = container;
    this.sceneManager = null;
    this.robotLoader = null;

    this.init();
  }

  async init() {
    try {
      console.log("🎬 Initializing Canvas3D...");

      // Create canvas container
      const canvas = document.createElement("div");
      canvas.id = "3d-canvas";
      canvas.className = "w-full h-full";
      this.container.appendChild(canvas);

      // Show loading
      this.showLoading("Initializing 3D scene...");

      // Initialize scene manager
      this.sceneManager = new SceneManager(canvas);

      // Initialize robot loader
      this.robotLoader = new RobotLoader(this.sceneManager);

      // Load robot from config
      await this.loadRobotFromConfig();

      // Load tool from config
      this.loadToolFromConfig();

      // Load camera from config
      this.loadCameraFromConfig();

      // Listen for updates
      this.setupEventListeners();

      this.hideLoading();

      console.log("✅ Canvas3D initialized");
    } catch (error) {
      console.error("❌ Canvas3D initialization failed:", error);
      this.hideLoading();
      this.showError(`Initialization failed: ${error.message}`);
    }
  }

  async loadRobotFromConfig() {
    if (!configState.robot.configured) {
      console.warn(" Robot not configured");
      return;
    }

    try {
      const robotConfig = configState.robot.data;

      console.log("🤖 Loading robot with config:", robotConfig);

      this.showLoading(`Loading ${robotConfig.type} robot...`);

      await this.robotLoader.loadRobot(robotConfig.type, robotConfig);

      // Add to scene state
      addSceneObject("robot", {
        type: "robot",
        name: robotConfig.name || `Robot ${robotConfig.type}`,
        robotType: robotConfig.type,
        brand: robotConfig.brand,
        position: robotConfig.translation,
        rotation: robotConfig.rotation,
      });

      this.hideLoading();

      console.log("✅ Robot loaded successfully");
    } catch (error) {
      console.error("❌ Failed to load robot:", error);
      this.hideLoading();
      this.showError(
        `Failed to load robot: ${error.message}<br><br>Check Console for details.`
      );
    }
  }

  loadToolFromConfig() {
    if (!configState.eoat.configured) {
      console.warn("⚠️ Tool not configured");
      return;
    }

    try {
      const toolConfig = configState.eoat.data;

      console.log("🔧 Loading tool with config:", toolConfig);

      let toolGeometry;
      let toolMaterial = new THREE.MeshStandardMaterial({
        color: 0x4ecca3,
        metalness: 0.5,
        roughness: 0.5,
      });

      if (toolConfig.shape === "cylinder") {
        toolGeometry = new THREE.CylinderGeometry(
          (toolConfig.radius || 50) / 1000,
          (toolConfig.radius || 50) / 1000,
          (toolConfig.height || 100) / 1000,
          32
        );
      } else if (toolConfig.shape === "cube") {
        toolGeometry = new THREE.BoxGeometry(
          (toolConfig.length || 50) / 1000,
          (toolConfig.height || 100) / 1000,
          (toolConfig.width || 50) / 1000
        );
      } else {
        toolGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 32);
      }

      const tool = new THREE.Mesh(toolGeometry, toolMaterial);
      tool.castShadow = true;
      tool.receiveShadow = true;
      tool.name = "tool";

      // Try to attach to robot end effector
      const endEffector = this.robotLoader.getEndEffector();
      if (endEffector) {
        // إزالة أداة قديمة إذا وجدت
        const oldTool = endEffector.getObjectByName("tool");
        if (oldTool) {
          endEffector.remove(oldTool);
        }

        endEffector.add(tool);
        tool.position.set(0, 0, 0.05);
        console.log("✅ Tool attached to end effector");
      } else {
        // Fallback: add to scene
        tool.position.set(0, 1.6, 0);
        this.sceneManager.addObject("tool", tool, {
          type: "tool",
          name: `Tool (${toolConfig.shape || "default"})`,
          shape: toolConfig.shape,
          ...toolConfig,
        });
      }

      // Add to scene state
      addSceneObject("tool", {
        type: "tool",
        name: `Tool (${toolConfig.shape || "default"})`,
        shape: toolConfig.shape,
        position: { x: 0, y: 1600, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        ...toolConfig,
      });

      console.log("✅ Tool loaded successfully");
    } catch (error) {
      console.error("❌ Failed to load tool:", error);
      this.showError(`Failed to load tool: ${error.message}`);
    }
  }

  loadCameraFromConfig() {
    if (!configState.camera.configured) {
      console.warn("⚠️ Camera not configured");
      return;
    }

    try {
      const cameraConfig = configState.camera.data;

      console.log("📷 Loading camera with config:", cameraConfig);

      // Create camera representation
      const cameraGroup = new THREE.Group();
      cameraGroup.name = "camera";

      // Camera body (main box)
      const bodyGeometry = new THREE.BoxGeometry(0.08, 0.05, 0.03);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c3e50,
        metalness: 0.6,
        roughness: 0.4,
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      cameraGroup.add(body);

      // Lens
      const lensGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.02, 16);
      const lensMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.8,
        roughness: 0.2,
      });
      const lens = new THREE.Mesh(lensGeometry, lensMaterial);
      lens.rotation.x = Math.PI / 2;
      lens.position.set(0, 0, 0.025);
      cameraGroup.add(lens);

      cameraGroup.castShadow = true;
      cameraGroup.receiveShadow = true;

      // Position camera
      cameraGroup.position.set(0, 2, 1);
      cameraGroup.rotation.x = -Math.PI / 6;

      // Add to scene
      this.sceneManager.addObject("camera", cameraGroup, {
        type: "camera",
        name: `Camera (${cameraConfig.type})`,
        cameraType: cameraConfig.type,
        ...cameraConfig,
      });

      // Add to scene state
      addSceneObject("camera", {
        type: "camera",
        name: `Camera (${cameraConfig.type})`,
        cameraType: cameraConfig.type,
        position: { x: 0, y: 2000, z: 1000 },
        rotation: { x: -30, y: 0, z: 0 },
        ...cameraConfig,
      });

      console.log("✅ Camera loaded successfully");
    } catch (error) {
      console.error("❌ Failed to load camera:", error);
      this.showError(`Failed to load camera: ${error.message}`);
    }
  }

  setupEventListeners() {
    // Reset camera
    window.addEventListener("resetCamera", () => {
      this.sceneManager.camera.position.set(3, 3, 3);
      this.sceneManager.controls.target.set(0, 0.5, 0);
      this.sceneManager.controls.update();
    });

    // Update object transform - معالجة خاصة للـ tool
    window.addEventListener("sceneObjectUpdated", (e) => {
      const { id, properties } = e.detail;

      console.log(" Scene object updated event:", id, properties);

      // معالجة خاصة للـ Tool
      if (id === "tool") {
        this.updateToolTransform(properties);
        return;
      }

      // معالجة عادية للكائنات الأخرى
      const transform = {
        position: properties.position
          ? {
              x: properties.position.x / 1000,
              y: properties.position.y / 1000,
              z: properties.position.z / 1000,
            }
          : null,
        rotation: properties.rotation,
      };

      this.sceneManager.updateObjectTransform(id, transform);
    });

    // Remove object from 3D scene
    window.addEventListener("removeObjectFrom3D", (e) => {
      const { id } = e.detail;

      console.log(" Removing from 3D scene:", id);

      if (this.sceneManager.getObject(id)) {
        this.sceneManager.removeObject(id);
      }

      // إذا كان أداة متصلة بالروبوت
      if (id === "tool" && this.robotLoader.robot) {
        const endEffector = this.robotLoader.getEndEffector();
        if (endEffector) {
          const toolMesh = endEffector.getObjectByName("tool");
          if (toolMesh) {
            endEffector.remove(toolMesh);
          }
        }
      }
    });

    // Reload tool when config changes
    window.addEventListener("reloadTool", () => {
      console.log("🔄 Reloading tool...");

      // Remove old tool
      const endEffector = this.robotLoader.getEndEffector();
      if (endEffector) {
        const oldTool = endEffector.getObjectByName("tool");
        if (oldTool) {
          endEffector.remove(oldTool);
        }
      } else if (this.sceneManager.getObject("tool")) {
        this.sceneManager.removeObject("tool");
      }

      // Load new tool
      this.loadToolFromConfig();
    });
  }

  // معالجة خاصة لتحديث Tool transform
  updateToolTransform(properties) {
    console.log(" Updating tool transform:", properties);

    const endEffector = this.robotLoader.getEndEffector();

    if (endEffector) {
      // Tool attached to robot
      const toolMesh = endEffector.getObjectByName("tool");

      if (toolMesh) {
        if (properties.position) {
          // Convert mm to m and apply offset
          toolMesh.position.set(
            (properties.position.x || 0) / 1000,
            (properties.position.y || 0) / 1000,
            (properties.position.z || 0) / 1000 + 0.05
          );
        }

        if (properties.rotation) {
          toolMesh.rotation.set(
            THREE.MathUtils.degToRad(properties.rotation.x || 0),
            THREE.MathUtils.degToRad(properties.rotation.y || 0),
            THREE.MathUtils.degToRad(properties.rotation.z || 0)
          );
        }

        console.log("✅ Tool transform updated (attached to robot)");
      } else {
        console.warn("⚠️ Tool mesh not found in end effector");
      }
    } else {
      // Tool is standalone in scene
      const transform = {
        position: properties.position
          ? {
              x: properties.position.x / 1000,
              y: properties.position.y / 1000,
              z: properties.position.z / 1000,
            }
          : null,
        rotation: properties.rotation,
      };

      this.sceneManager.updateObjectTransform("tool", transform);
      console.log("✅ Tool transform updated (standalone)");
    }
  }

  showLoading(message) {
    let loader = document.getElementById("canvas-loader");
    if (!loader) {
      loader = document.createElement("div");
      loader.id = "canvas-loader";
      loader.className =
        "absolute inset-0 flex items-center justify-center bg-black/70 z-50";
      loader.innerHTML = `
        <div class="text-center">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p class="text-white text-lg" id="loader-message">${message}</p>
        </div>
      `;
      this.container.appendChild(loader);
    } else {
      document.getElementById("loader-message").textContent = message;
      loader.classList.remove("hidden");
    }
  }

  hideLoading() {
    const loader = document.getElementById("canvas-loader");
    if (loader) {
      loader.classList.add("hidden");
    }
  }

  showError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className =
      "absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md";
    errorDiv.innerHTML = `
      <div class="flex items-start gap-3">
        <span class="text-2xl">⚠️</span>
        <div class="flex-1">
          <p class="font-semibold mb-1">Error</p>
          <p class="text-sm">${message}</p>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:text-gray-200">✕</button>
      </div>
    `;
    this.container.appendChild(errorDiv);

    setTimeout(() => {
      if (errorDiv.parentElement) {
        errorDiv.remove();
      }
    }, 10000);
  }

  dispose() {
    if (this.sceneManager) {
      this.sceneManager.dispose();
    }
  }
}

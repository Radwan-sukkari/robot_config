import {
  getSelectedObject,
  updateSceneObject,
  sceneState,
} from "../../state/sceneState.js";
import { configState, saveConfig } from "../../state/configState.js";

// 🎛️ Properties Panel Component
export class PropertiesPanel {
  constructor(container) {
    this.container = container;
    this.render();

    // Listen for selection changes
    window.addEventListener("objectSelected", () => this.render());
  }

  render() {
    const selectedId = sceneState.selectedObject;
    const selectedObject = selectedId ? sceneState.objects[selectedId] : null;

    this.container.innerHTML = /*html*/ `
      <div class="h-full bg-[#1a1a1a] border-l border-gray-700 flex flex-col">
        
        <!-- Header -->
        <div class="px-4 py-3 bg-primary border-b border-primary-dark">
          <h3 class="text-white font-semibold uppercase text-sm">Properties</h3>
        </div>
        
        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-4">
          ${
            selectedObject
              ? this.renderProperties(selectedId, selectedObject)
              : this.renderEmpty()
          }
        </div>
        
      </div>
    `;

    if (selectedObject) {
      this.attachEvents(selectedId);
    }
  }

  renderEmpty() {
    return /*html*/ `
      <div class="flex items-center justify-center h-full text-gray-500">
        <div class="text-center">
          <p class="text-4xl mb-2">👆</p>
          <p class="text-sm">Select an object to view properties</p>
        </div>
      </div>
    `;
  }

  renderProperties(id, obj) {
    // Get original config data if available
    let originalData = null;
    if (id === "robot" && configState.robot.configured) {
      originalData = configState.robot.data;
    } else if (id === "tool" && configState.eoat.configured) {
      originalData = configState.eoat.data;
    } else if (id === "camera" && configState.camera.configured) {
      originalData = configState.camera.data;
    }

    return /*html*/ `
      <div class="space-y-6">
        
        <!-- Object Info -->
        <div>
          <h4 class="text-white font-medium mb-2">Object Info</h4>
          <div class="bg-[#2a2a2a] rounded p-3 space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-400 text-sm">ID:</span>
              <span class="text-white text-sm">${id}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400 text-sm">Type:</span>
              <span class="text-white text-sm">${obj.type}</span>
            </div>
          </div>
        </div>

        <!-- Robot Specific Properties -->
        ${
          id === "robot" && originalData
            ? this.renderRobotProperties(originalData)
            : ""
        }

        <!-- Tool Specific Properties -->
        ${
          id === "tool" && originalData
            ? this.renderToolProperties(originalData)
            : ""
        }

        <!-- Camera Specific Properties -->
        ${
          id === "camera" && originalData
            ? this.renderCameraProperties(originalData)
            : ""
        }
        
        <!-- Position -->
        <div>
          <h4 class="text-white font-medium mb-2">Position (mm)</h4>
          <div class="grid grid-cols-3 gap-2">
            ${this.renderInput("position-x", "X", obj.position?.x || 0)}
            ${this.renderInput("position-y", "Y", obj.position?.y || 0)}
            ${this.renderInput("position-z", "Z", obj.position?.z || 0)}
          </div>
        </div>
        
        <!-- Rotation -->
        <div>
          <h4 class="text-white font-medium mb-2">Rotation (deg)</h4>
          <div class="grid grid-cols-3 gap-2">
            ${this.renderInput("rotation-rx", "RX", obj.rotation?.x || 0)}
            ${this.renderInput("rotation-ry", "RY", obj.rotation?.y || 0)}
            ${this.renderInput("rotation-rz", "RZ", obj.rotation?.z || 0)}
          </div>
        </div>
        
        <!-- Update & Delete Buttons -->
        <div class="space-y-2">
          <button 
            id="update-properties-btn"
            class="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-all font-medium"
          >
            ✓ Update
          </button>
          
          ${
            id !== "floor"
              ? `
            <button 
              id="delete-object-btn"
              class="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all font-medium"
            >
              🗑️ Delete
            </button>
          `
              : ""
          }
        </div>
        
      </div>
    `;
  }

  renderRobotProperties(robotData) {
    return /*html*/ `
      <div>
        <h4 class="text-white font-medium mb-2">Robot Configuration</h4>
        <div class="space-y-3">
          
          <!-- Robot Name -->
          <div>
            <label class="block text-gray-400 text-xs mb-1">Name</label>
            <input 
              type="text" 
              id="robot-prop-name"
              class="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-gray-600 text-sm"
              value="${robotData.name || ""}"
            />
          </div>

          <!-- Robot Brand -->
          <div>
            <label class="block text-gray-400 text-xs mb-1">Brand</label>
            <select 
              id="robot-prop-brand"
              class="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-gray-600 text-sm"
            >
              <option value="Universal Robots" ${
                robotData.brand === "Universal Robots" ? "selected" : ""
              }>Universal Robots</option>
              <option value="ABB" ${
                robotData.brand === "ABB" ? "selected" : ""
              }>ABB</option>
              <option value="KUKA" ${
                robotData.brand === "KUKA" ? "selected" : ""
              }>KUKA</option>
              <option value="Fanuc" ${
                robotData.brand === "Fanuc" ? "selected" : ""
              }>Fanuc</option>
            </select>
          </div>

          <!-- Robot Type -->
          <div>
            <label class="block text-gray-400 text-xs mb-1">Type</label>
            <select 
              id="robot-prop-type"
              class="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-gray-600 text-sm"
            >
              <option value="UR5" ${
                robotData.type === "UR5" ? "selected" : ""
              }>UR5</option>
              <option value="UR10" ${
                robotData.type === "UR10" ? "selected" : ""
              }>UR10</option>
              <option value="UR20" ${
                robotData.type === "UR20" ? "selected" : ""
              }>UR20</option>
              <option value="UR3" ${
                robotData.type === "UR3" ? "selected" : ""
              }>UR3</option>
            </select>
          </div>

          <!-- Robot IP -->
          <div>
            <label class="block text-gray-400 text-xs mb-1">Robot IP</label>
            <input 
              type="text" 
              id="robot-prop-ip"
              class="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-gray-600 text-sm"
              value="${robotData.ip || ""}"
            />
          </div>

          <!-- PC IP -->
          <div>
            <label class="block text-gray-400 text-xs mb-1">PC/Host IP</label>
            <input 
              type="text" 
              id="robot-prop-pcip"
              class="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-gray-600 text-sm"
              value="${robotData.pcIp || ""}"
            />
          </div>
          
        </div>
      </div>
    `;
  }

  renderToolProperties(toolData) {
    return /*html*/ `
      <div>
        <h4 class="text-white font-medium mb-2">Tool Configuration</h4>
        <div class="space-y-3">
          
          <!-- Shape -->
          <div>
            <label class="block text-gray-400 text-xs mb-1">Shape</label>
            <select 
              id="tool-prop-shape"
              class="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-gray-600 text-sm"
            >
              <option value="cylinder" ${
                toolData.shape === "cylinder" ? "selected" : ""
              }>Cylinder</option>
              <option value="cube" ${
                toolData.shape === "cube" ? "selected" : ""
              }>Cube</option>
            </select>
          </div>

          <!-- Dynamic fields based on shape -->
          <div id="tool-dynamic-fields">
            ${this.renderToolDynamicFields(toolData)}
          </div>
          
        </div>
      </div>
    `;
  }

  renderCameraProperties(cameraData) {
    return /*html*/ `
      <div>
        <h4 class="text-white font-medium mb-2">Camera Configuration</h4>
        <div class="space-y-3">
          
          <!-- Camera Type -->
          <div>
            <label class="block text-gray-400 text-xs mb-1">Type</label>
            <select 
              id="camera-prop-type"
              class="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-gray-600 text-sm"
            >
              <option value="Orbbec" ${
                cameraData.type === "Orbbec" ? "selected" : ""
              }>Orbbec</option>
              <option value="RealSense" ${
                cameraData.type === "RealSense" ? "selected" : ""
              }>Intel RealSense</option>
              <option value="Kinect" ${
                cameraData.type === "Kinect" ? "selected" : ""
              }>Microsoft Kinect</option>
            </select>
          </div>

          <!-- Resolution -->
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-gray-400 text-xs mb-1">Width (px)</label>
              <input 
                type="number" 
                id="camera-prop-width"
                class="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-gray-600 text-sm"
                value="${cameraData.width || 1920}"
              />
            </div>
            <div>
              <label class="block text-gray-400 text-xs mb-1">Height (px)</label>
              <input 
                type="number" 
                id="camera-prop-height"
                class="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-gray-600 text-sm"
                value="${cameraData.height || 1080}"
              />
            </div>
          </div>

          <!-- Focal Points -->
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-gray-400 text-xs mb-1">FX</label>
              <input 
                type="number" 
                id="camera-prop-fx"
                class="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-gray-600 text-sm"
                value="${cameraData.fx || 0}"
                step="0.001"
              />
            </div>
            <div>
              <label class="block text-gray-400 text-xs mb-1">FY</label>
              <input 
                type="number" 
                id="camera-prop-fy"
                class="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-gray-600 text-sm"
                value="${cameraData.fy || 0}"
                step="0.001"
              />
            </div>
          </div>

          <!-- Central Points -->
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-gray-400 text-xs mb-1">CX</label>
              <input 
                type="number" 
                id="camera-prop-cx"
                class="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-gray-600 text-sm"
                value="${cameraData.cx || 0}"
                step="0.001"
              />
            </div>
            <div>
              <label class="block text-gray-400 text-xs mb-1">CY</label>
              <input 
                type="number" 
                id="camera-prop-cy"
                class="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-gray-600 text-sm"
                value="${cameraData.cy || 0}"
                step="0.001"
              />
            </div>
          </div>
          
        </div>
      </div>
    `;
  }

  renderToolDynamicFields(toolData) {
    if (toolData.shape === "cylinder") {
      return /*html*/ `
        <div>
          <label class="block text-gray-400 text-xs mb-1">Radius (mm)</label>
          <input 
            type="number" 
            id="tool-prop-radius"
            class="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-gray-600 text-sm"
            value="${toolData.radius || 0}"
            step="0.1"
          />
        </div>
        <div class="mt-3">
          <label class="block text-gray-400 text-xs mb-1">Height (mm)</label>
          <input 
            type="number" 
            id="tool-prop-height"
            class="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-gray-600 text-sm"
            value="${toolData.height || 0}"
            step="0.1"
          />
        </div>
      `;
    } else if (toolData.shape === "cube") {
      return /*html*/ `
        <div>
          <label class="block text-gray-400 text-xs mb-1">Length (mm)</label>
          <input 
            type="number" 
            id="tool-prop-length"
            class="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-gray-600 text-sm"
            value="${toolData.length || 0}"
            step="0.1"
          />
        </div>
        <div class="mt-3">
          <label class="block text-gray-400 text-xs mb-1">Width (mm)</label>
          <input 
            type="number" 
            id="tool-prop-width"
            class="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-gray-600 text-sm"
            value="${toolData.width || 0}"
            step="0.1"
          />
        </div>
        <div class="mt-3">
          <label class="block text-gray-400 text-xs mb-1">Height (mm)</label>
          <input 
            type="number" 
            id="tool-prop-height"
            class="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-gray-600 text-sm"
            value="${toolData.height || 0}"
            step="0.1"
          />
        </div>
      `;
    }
    return "";
  }

  renderInput(id, label, value) {
    return /*html*/ `
      <div>
        <label class="block text-gray-400 text-xs mb-1 text-center">${label}</label>
        <input 
          type="number" 
          id="${id}"
          class="w-full bg-[#2a2a2a] text-white px-2 py-2 rounded border border-gray-600 text-center text-sm focus:border-primary outline-none"
          value="${value}"
          step="0.1"
        />
      </div>
    `;
  }

  attachEvents(selectedId) {
    const updateBtn = this.container.querySelector("#update-properties-btn");
    const deleteBtn = this.container.querySelector("#delete-object-btn");

    if (updateBtn) {
      updateBtn.addEventListener("click", () =>
        this.updateProperties(selectedId)
      );
    }

    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => this.deleteObject(selectedId));
    }

    // Handle tool shape change
    const shapeSelect = this.container.querySelector("#tool-prop-shape");
    if (shapeSelect) {
      shapeSelect.addEventListener("change", (e) => {
        const toolData = configState.eoat.data;
        toolData.shape = e.target.value;

        // Re-render dynamic fields
        const container = this.container.querySelector("#tool-dynamic-fields");
        if (container) {
          container.innerHTML = this.renderToolDynamicFields(toolData);
        }
      });
    }
  }

  updateProperties(id) {
    console.log("🔄 Updating properties for:", id);

    // Get position and rotation
    const properties = {
      position: {
        x: parseFloat(document.getElementById("position-x")?.value) || 0,
        y: parseFloat(document.getElementById("position-y")?.value) || 0,
        z: parseFloat(document.getElementById("position-z")?.value) || 0,
      },
      rotation: {
        x: parseFloat(document.getElementById("rotation-rx")?.value) || 0,
        y: parseFloat(document.getElementById("rotation-ry")?.value) || 0,
        z: parseFloat(document.getElementById("rotation-rz")?.value) || 0,
      },
    };

    // Update robot config if robot
    if (id === "robot") {
      const currentRobotData = configState.robot.data;

      const robotUpdates = {
        name: document.getElementById("robot-prop-name")?.value || "",
        brand: document.getElementById("robot-prop-brand")?.value || "",
        type: document.getElementById("robot-prop-type")?.value || "",
        ip: document.getElementById("robot-prop-ip")?.value || "",
        pcIp: document.getElementById("robot-prop-pcip")?.value || "",
        translation: properties.position,
        rotation: properties.rotation,
      };

      // Check if robot type changed
      const typeChanged = currentRobotData.type !== robotUpdates.type;

      // Save to configState
      saveConfig("robot", robotUpdates);

      // Update scene state
      updateSceneObject(id, {
        ...properties,
        name: robotUpdates.name,
        brand: robotUpdates.brand,
        robotType: robotUpdates.type,
      });

      // If type changed, reload robot model
      if (typeChanged) {
        console.log("🔄 Robot type changed, reloading model...");
        window.dispatchEvent(new CustomEvent("reloadRobot"));
      }

      console.log("✅ Robot config updated:", robotUpdates);
    }
    // Update tool config if tool
    else if (id === "tool") {
      const shape = document.getElementById("tool-prop-shape")?.value;
      const currentToolData = configState.eoat.data;

      // Check if shape changed
      const shapeChanged = currentToolData.shape !== shape;

      const toolUpdates = {
        shape: shape,
        ...(shape === "cylinder"
          ? {
              radius:
                parseFloat(
                  document.getElementById("tool-prop-radius")?.value
                ) || 0,
              height:
                parseFloat(
                  document.getElementById("tool-prop-height")?.value
                ) || 0,
            }
          : {
              length:
                parseFloat(
                  document.getElementById("tool-prop-length")?.value
                ) || 0,
              width:
                parseFloat(document.getElementById("tool-prop-width")?.value) ||
                0,
              height:
                parseFloat(
                  document.getElementById("tool-prop-height")?.value
                ) || 0,
            }),
      };

      // Check if dimensions changed
      const dimensionsChanged =
        (shape === "cylinder" &&
          (currentToolData.radius !== toolUpdates.radius ||
            currentToolData.height !== toolUpdates.height)) ||
        (shape === "cube" &&
          (currentToolData.length !== toolUpdates.length ||
            currentToolData.width !== toolUpdates.width ||
            currentToolData.height !== toolUpdates.height));

      // Save to configState
      saveConfig("eoat", toolUpdates);

      // Update scene state
      updateSceneObject(id, {
        ...properties,
        ...toolUpdates,
      });

      // If shape or dimensions changed, reload tool geometry
      if (shapeChanged || dimensionsChanged) {
        console.log("🔄 Tool geometry changed, reloading...");
        window.dispatchEvent(new CustomEvent("reloadTool"));
      }

      console.log("✅ Tool config updated:", toolUpdates);
    }
    // Update camera config if camera
    else if (id === "camera") {
      const cameraUpdates = {
        type: document.getElementById("camera-prop-type")?.value || "",
        width:
          parseFloat(document.getElementById("camera-prop-width")?.value) ||
          1920,
        height:
          parseFloat(document.getElementById("camera-prop-height")?.value) ||
          1080,
        fx: parseFloat(document.getElementById("camera-prop-fx")?.value) || 0,
        fy: parseFloat(document.getElementById("camera-prop-fy")?.value) || 0,
        cx: parseFloat(document.getElementById("camera-prop-cx")?.value) || 0,
        cy: parseFloat(document.getElementById("camera-prop-cy")?.value) || 0,
      };

      // Save to configState
      saveConfig("camera", cameraUpdates);

      // Update scene state
      updateSceneObject(id, {
        ...properties,
        ...cameraUpdates,
      });

      console.log("✅ Camera config updated:", cameraUpdates);
    }
    // Update other objects
    else {
      updateSceneObject(id, properties);
      console.log("✅ Object updated:", id);
    }
  }

  deleteObject(id) {
    if (confirm(`Delete ${id}?`)) {
      // Import removeSceneObject
      import("../../state/sceneState.js").then(({ removeSceneObject }) => {
        removeSceneObject(id);

        // Also remove from 3D scene
        window.dispatchEvent(
          new CustomEvent("removeObjectFrom3D", {
            detail: { id },
          })
        );
      });
    }
  }
}

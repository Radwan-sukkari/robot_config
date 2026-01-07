import {
  getSceneObjects,
  selectObject,
  removeSceneObject,
} from "../../state/sceneState.js";

// 📋 Class List Component
export class ClassList {
  constructor(container) {
    this.container = container;
    this.render();

    // Listen for updates
    window.addEventListener("sceneObjectsUpdated", () => this.render());
    window.addEventListener("objectSelected", () => this.render());
  }

  render() {
    const objects = getSceneObjects();

    this.container.innerHTML = /*html*/ `
      <div class="h-full bg-[#1a1a1a] border-r border-gray-700 flex flex-col">
        
        <!-- Header -->
        <div class="px-4 py-3 bg-primary border-b border-primary-dark">
          <h3 class="text-white font-semibold uppercase text-sm">Class List</h3>
        </div>
        
        <!-- List -->
        <div class="flex-1 overflow-y-auto p-2">
          ${
            objects.length === 0
              ? '<p class="text-gray-500 text-sm text-center py-4">No objects in scene</p>'
              : objects.map((obj) => this.renderObjectItem(obj)).join("")
          }
        </div>
        
        <!-- Actions -->
        
    `;

    this.attachEvents();
  }

  renderObjectItem(obj) {
    const icon = this.getObjectIcon(obj.type);
    const isSelected = obj.id === window.sceneState?.selectedObject;

    return /*html*/ `
      <div 
        class="object-item px-3 py-2 mb-1 rounded cursor-pointer transition-all ${
          isSelected
            ? "bg-primary text-white"
            : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
        }"
        data-object-id="${obj.id}"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-lg">${icon}</span>
            <span class="text-sm font-medium">${obj.name || obj.id}</span>
          </div>
          ${
            obj.type !== "floor"
              ? '<span class="text-xs opacity-60">' + obj.type + "</span>"
              : ""
          }
        </div>
      </div>
    `;
  }

  getObjectIcon(type) {
    const icons = {
      floor: "🟫",
      robot: "🤖",
      tool: "🔧",
      camera: "📷",
      cylinder: "🔵",
      cube: "📦",
      table: "🪑",
      sensorData: "📊",
    };

    return icons[type] || "📦";
  }

  attachEvents() {
    // Object selection
    this.container.querySelectorAll(".object-item").forEach((item) => {
      item.addEventListener("click", () => {
        const objectId = item.dataset.objectId;
        selectObject(objectId);
      });

      // Double click for edit
      item.addEventListener("dblclick", () => {
        const objectId = item.dataset.objectId;
        console.log(`✏️ Edit object: ${objectId}`);
        // Will open properties panel
      });
    });

    // Delete button
    const deleteBtn = this.container.querySelector("#delete-object-btn");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        const selectedId = window.sceneState?.selectedObject;
        if (selectedId && selectedId !== "floor") {
          if (confirm(`Delete ${selectedId}?`)) {
            removeSceneObject(selectedId);
          }
        }
      });
    }
  }
}

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
      <div class="h-full bg-gray-100 border-r-2 border-primary flex flex-col">
        
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
        class="object-item px-3 py-2.5 mb-1.5 rounded-lg cursor-pointer transition-all duration-200 border ${
          isSelected
            ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-[1.02]"
            : "bg-white text-gray-700 border-gray-200 hover:border-primary/40 hover:bg-gray-100 hover:shadow-sm"
        }"
        data-object-id="${obj.id}"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-xl ${
              isSelected ? "text-white" : "text-primary/70"
            }">${icon}</span>
            
            <div class="flex flex-col">
              <span class="text-sm font-semibold tracking-tight">${
                obj.name || obj.id
              }</span>
              ${
                obj.type !== "floor"
                  ? `<span class="text-[10px] uppercase font-bold ${
                      isSelected ? "text-white/70" : "text-gray-400"
                    }">${obj.type}</span>`
                  : ""
              }
            </div>
          </div>

          <div class="${isSelected ? "text-white/50" : "text-gray-300"}">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </div>
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

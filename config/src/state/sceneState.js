export const sceneState = {
  mode: "configuration",

  objects: {
    floor: {
      type: "floor",
      name: "Floor",
      visible: true,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 10, y: 0.1, z: 10 },
    },
    robot: null,
    tool: null,
    table: null,
    sensorData: null,
  },

  selectedObject: null,

  camera: {
    position: { x: 5, y: 5, z: 5 },
    target: { x: 0, y: 0, z: 0 },
  },
};

// Add object to scene
export function addSceneObject(id, object) {
  sceneState.objects[id] = object;
  console.log(` Added object: ${id}`, object);

  // Trigger UI update
  window.dispatchEvent(new CustomEvent("sceneObjectsUpdated"));
}

// Remove object from scene
export function removeSceneObject(id) {
  if (sceneState.objects[id]) {
    delete sceneState.objects[id];
    console.log(`Removed object: ${id}`);

    // Trigger UI update
    window.dispatchEvent(new CustomEvent("sceneObjectsUpdated"));
  }
}

// Update object properties
export function updateSceneObject(id, properties) {
  if (sceneState.objects[id]) {
    sceneState.objects[id] = {
      ...sceneState.objects[id],
      ...properties,
    };

    console.log(` Updated object: ${id}`, properties);

    // Trigger 3D scene update
    window.dispatchEvent(
      new CustomEvent("sceneObjectUpdated", {
        detail: { id, properties },
      })
    );
  }
}

// Select object
export function selectObject(id) {
  sceneState.selectedObject = id;

  console.log(` Selected object: ${id}`);

  // Trigger UI update
  window.dispatchEvent(
    new CustomEvent("objectSelected", {
      detail: { id },
    })
  );
}

// Get selected object
export function getSelectedObject() {
  return sceneState.objects[sceneState.selectedObject];
}

// Switch mode
export function switchMode(mode) {
  sceneState.mode = mode;
  localStorage.setItem("appMode", mode);

  console.log(` Switched to ${mode} mode`);

  // Trigger mode change
  window.dispatchEvent(
    new CustomEvent("modeChanged", {
      detail: { mode },
    })
  );
}

// Get all objects as array
export function getSceneObjects() {
  return Object.entries(sceneState.objects)
    .filter(([_, obj]) => obj !== null)
    .map(([id, obj]) => ({
      id,
      ...obj,
      selected: id === sceneState.selectedObject, // ← إضافة هذا السطر
    }));
}

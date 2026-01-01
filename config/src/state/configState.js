// 🗂️ State Management
export const configState = {
  robot: {
    configured: false,
    data: {
      name: "",
      brand: "",
      type: "",
      ip: "",
      pcIp: "",
      translation: { x: 0, y: 0, z: 0 },
      rotation: { rx: 0, ry: 0, rz: 0 },
    },
  },

  camera: {
    configured: false,
    data: {
      type: "",
      width: 0,
      height: 0,
      fx: 0,
      fy: 0,
      cx: 0,
      cy: 0,
    },
  },

  cameraConfig: {
    configured: false,
    data: {
      type: "",
      calibrationFile: "",
    },
  },

  eoat: {
    configured: false,
    data: {
      shape: "",
      radius: 0,
      height: 0,
      length: 0,
      width: 0,
    },
  },
};

// Check if all configurations are complete
export function isAllConfigured() {
  return (
    configState.robot.configured &&
    configState.camera.configured &&
    configState.cameraConfig.configured &&
    configState.eoat.configured
  );
}

// Save configuration
export function saveConfig(type, data) {
  if (configState[type]) {
    configState[type].data = { ...configState[type].data, ...data };
    configState[type].configured = true;

    // Save to localStorage
    localStorage.setItem("robotConfig", JSON.stringify(configState));

    // Update UI
    updateStartButton();
    updateSidebarIndicators();

    console.log(`✅ ${type} configuration saved:`, data);
  }
}

// Load saved configuration
export function loadConfig() {
  const saved = localStorage.getItem("robotConfig");
  if (saved) {
    try {
      const loaded = JSON.parse(saved);
      Object.assign(configState, loaded);
      updateStartButton();
      console.log("✅ Configuration loaded from localStorage");
    } catch (error) {
      console.error("❌ Failed to load configuration:", error);
    }
  }
}

// Reset configuration
export function resetConfig() {
  localStorage.removeItem("robotConfig");

  // Reset state
  Object.keys(configState).forEach((key) => {
    configState[key].configured = false;
    if (typeof configState[key].data === "object") {
      Object.keys(configState[key].data).forEach((prop) => {
        if (typeof configState[key].data[prop] === "object") {
          Object.keys(configState[key].data[prop]).forEach((subProp) => {
            configState[key].data[prop][subProp] = 0;
          });
        } else {
          configState[key].data[prop] =
            typeof configState[key].data[prop] === "number" ? 0 : "";
        }
      });
    }
  });

  updateStartButton();
  updateSidebarIndicators();

  console.log("🔄 Configuration reset");
}

// Update Start Simulation button
function updateStartButton() {
  const startBtn = document.getElementById("start-simulation-btn");
  if (startBtn) {
    if (isAllConfigured()) {
      startBtn.disabled = false;
      startBtn.classList.remove("opacity-50", "cursor-not-allowed");
      startBtn.classList.add("hover:bg-primary-dark", "cursor-pointer");
    } else {
      startBtn.disabled = true;
      startBtn.classList.add("opacity-50", "cursor-not-allowed");
      startBtn.classList.remove("hover:bg-primary-dark", "cursor-pointer");
    }
  }
}

// Update sidebar indicators
function updateSidebarIndicators() {
  // Re-render sidebar to show green checkmarks
  const event = new CustomEvent("updateSidebar");
  window.dispatchEvent(event);
}

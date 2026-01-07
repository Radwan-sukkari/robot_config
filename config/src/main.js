import "./style.css";
import { initHeader } from "./components/header.js";
import { initSidebar } from "./components/sidebar.js";
import { initScene } from "./components/scene.js";
import { ModalFactory } from "./components/modals/ModalFactory.js";
import { loadConfig, isAllConfigured } from "./state/configState.js";
import { sceneState } from "./state/sceneState.js";
import { LiveSimulation } from "./components/liveSimulation/LiveSimulation.js";
// 🚀 Application Entry Point
function init() {
  loadConfig();

  // فحص الرابط: هل المستخدم كان بالمحاكاة؟
  if (window.location.hash === "#simulation" && isAllConfigured()) {
    sceneState.mode = "simulation"; // تحديث الحالة يدوياً قبل الفحص
  }

  // الآن الفحص رح يشتغل صح بعد الـ Refresh
  if (sceneState.mode === "configuration") {
    initConfigurationMode();
  } else {
    // تشغيل المحاكاة فوراً
    initHeader(); // عشان الزر يضل موجود
    initScene();
    new LiveSimulation();
    console.log("🎬 Returned to Live Simulation via URL Hash");
  }
}
function initConfigurationMode() {
  console.log("⚙️ Configuration Mode");
  console.log("Please configure the robot before starting the simulation.");

  // Initialize UI components
  initHeader();
  initSidebar();
  initScene();

  // 🏭 Factory Pattern - Create all modals
  ModalFactory.createAll();
}

function initSimulationMode() {
  console.log("🎬 Live Simulation Mode");

  // Will be handled by LiveSimulation class
  // This mode is initialized when user clicks "Start Simulation"
}

// Make sceneState globally accessible for debugging
window.sceneState = sceneState;

// Start the application
init();

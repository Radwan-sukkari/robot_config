import "./style.css";
import { initHeader } from "./components/header.js";
import { initSidebar } from "./components/sidebar.js";
import { initScene } from "./components/scene.js";
import { ModalFactory } from "./components/modals/ModalFactory.js";
import { loadConfig } from "./state/configState.js";

// 🚀 Application Entry Point
function init() {
  console.log("🚀 Initializing Robot Configuration System...");

  // Load saved configuration
  loadConfig();

  // Initialize UI components
  initHeader();
  initSidebar();
  initScene();

  // Factory Pattern - Create all modals
  ModalFactory.createAll();

  console.log("✅ Application initialized successfully!");
}

// Start the application
init();

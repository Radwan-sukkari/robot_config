import { isAllConfigured, configState } from "../state/configState.js";
import { switchMode } from "../state/sceneState.js";
import { LiveSimulation } from "./liveSimulation/LiveSimulation.js";

let liveSimulation = null;

export function initHeader() {
  const header = document.getElementById("header-container");

  header.innerHTML = /*html*/ `
    <div class="bg-primary text-white py-4 px-6 flex justify-between items-center border-b border-primary-dark shadow-lg">
      <h1 class="text-2xl font-bold uppercase tracking-wider">Configuration Mode</h1>
      
      <button 
        id="start-simulation-btn"
        class="bg-primary border-2 border-white px-6 py-2 rounded-lg font-semibold uppercase transition-all opacity-50 cursor-not-allowed"
        disabled
      >
        ▶ Start Simulation
      </button>
    </div>
  `;

  // Event listener for Start Simulation button
  const startBtn = document.getElementById("start-simulation-btn");
  startBtn.addEventListener("click", () => {
    if (isAllConfigured()) {
      startLiveSimulation();
    }
  });
}

function startLiveSimulation() {
  console.log("🚀 Starting Live Simulation...");
  console.log("Configuration:", configState);

  // 1. تغيير الرابط ليحتوي على #simulation
  window.location.hash = "simulation";
  // Switch mode
  switchMode("simulation");

  // Initialize Live Simulation
  liveSimulation = new LiveSimulation();
}

import { resetConfig } from "../../state/configState.js";
import { switchMode } from "../../state/sceneState.js";

// Live Simulation Header
export class LiveSimHeader {
  constructor(container) {
    this.container = container;
    this.render();
  }

  render() {
    this.container.innerHTML = /*html*/ `
      <div class="bg-primary text-white py-4 px-6  mb-2 flex justify-between items-center border-b border-primary-dark shadow-lg">
        
        <!-- Title -->
        <h1 class="text-2xl font-bold uppercase tracking-wider">Live Simulation Mode</h1>
        
        <!-- Actions -->
        <div class="flex gap-3">
          <button 
            id="reset-view-btn"
            class="px-4 py-2 bg-primary border border-white rounded hover:bg-primary-dark transition-all font-medium text-sm"
          >
            🔄 Reset View
          </button>
          
          <button 
            id="new-simulation-btn"
            class="px-4 py-2 bg-red-600 border border-white rounded hover:bg-red-700 transition-all font-medium text-sm"
          >
            ⚙️ New Configuration
          </button>
        </div>
        
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    // Reset View
    document.getElementById("reset-view-btn").addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("resetCamera"));
      console.log("🔄 Camera reset");
    });

    // New Configuration
    document
      .getElementById("new-simulation-btn")
      .addEventListener("click", () => {
        if (
          confirm("⚠️ Start new configuration? Current scene will be cleared.")
        ) {
          this.startNewConfiguration();
        }
      });
  }

  startNewConfiguration() {
    // Reset configuration
    resetConfig();

    // Switch back to configuration mode
    switchMode("configuration");

    // Reload page
    window.location.reload();
  }
}

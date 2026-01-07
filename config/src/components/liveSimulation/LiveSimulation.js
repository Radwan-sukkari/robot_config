import { LiveSimHeader } from "./LiveSimHeader.js";
import { ClassList } from "./ClassList.js";
import { PropertiesPanel } from "./PropertiesPanel.js";
import { Canvas3D } from "./Canvas3D.js";

//  Live Simulation Mode Controller
export class LiveSimulation {
  constructor() {
    this.header = null;
    this.classList = null;
    this.propertiesPanel = null;
    this.canvas3D = null;

    this.init();
  }

  init() {
    // Clear existing content
    document.getElementById("app").innerHTML = /*html*/ `
      <div class="h-screen flex flex-col overflow-hidden">
        <!-- Header -->
        <div id="live-sim-header"></div>
        
        <!-- Main Content -->
        <div class="flex flex-1 overflow-hidden">
          <!-- Class List -->
          <aside id="class-list-container" class="w-64"></aside>
          
          <!-- 3D Canvas -->
          <main id="canvas-container" class="flex-1"></main>
          
          <!-- Properties Panel -->
          <aside id="properties-container" class="w-80"></aside>
        </div>
      </div>
    `;

    // Initialize components
    this.header = new LiveSimHeader(document.getElementById("live-sim-header"));
    this.classList = new ClassList(
      document.getElementById("class-list-container")
    );
    this.propertiesPanel = new PropertiesPanel(
      document.getElementById("properties-container")
    );
    this.canvas3D = new Canvas3D(document.getElementById("canvas-container"));

    console.log("✅ Live Simulation Mode initialized");
  }

  dispose() {
    if (this.canvas3D) {
      this.canvas3D.dispose();
    }
  }
}

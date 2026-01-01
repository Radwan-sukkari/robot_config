import { isAllConfigured, configState } from '../state/configState.js';

export function initHeader() {
  const header = document.getElementById('header-container');
  
  header.innerHTML = /*html*/`
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
  const startBtn = document.getElementById('start-simulation-btn');
  startBtn.addEventListener('click', () => {
    if (isAllConfigured()) {
      startLiveSimulation();
    }
  });
}

function startLiveSimulation() {
  console.log('🚀 Starting Live Simulation...');
  console.log('Configuration:', configState);
  
  // TODO: Transition to Live Simulation Mode
  alert('✅ Configuration Complete!\n\n🚀 Starting Live Simulation Mode...\n\n(This will be implemented next)');
  
  // Here you would:
  // 1. Hide configuration UI
  // 2. Show Live Simulation UI with 3D Canvas
  // 3. Load robot model based on config
  // 4. Initialize 3D scene
}
import { isAllConfigured, configState } from '../state/configState.js';

export function initHeader() {
const header = document.getElementById('header-container');
  
header.innerHTML = /*html*/`
    <div class="bg-[#004d40] text-white py-4 px-6 flex justify-between items-center border-b border-[#00332c] pr-10">
      <h1 class="text-2xl font-bold uppercase tracking-wider">Configuration Mode</h1>
      
      <button 
        id="start-simulation-btn"
        class="bg-[#004d40] border-2 border-white px-6 py-2 rounded-lg font-semibold uppercase transition-all opacity-50 cursor-not-allowed"
        disabled
      >
        Start Simulation
      </button>
    </div>
  `;
  
  // Event listener لزر Start Simulation
  const startBtn = document.getElementById('start-simulation-btn');
  startBtn.addEventListener('click', () => {
    if (isAllConfigured()) {
      startLiveSimulation();
    }
  });
}

function startLiveSimulation() {
  // الانتقال لوضع Live Simulation
  console.log('Starting Live Simulation...', configState);
  
  // هون بتحول الواجهة للـ Live Simulation Mode
  // (بنعملها بعدين)
  alert('Configuration Complete! Starting Live Simulation...');
}
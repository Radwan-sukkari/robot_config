
import { ModalFactory } from './modals/ModalFactory.js';
import { configState } from '../state/configState.js';

export function initSidebar() {
  renderSidebar();
  
  // Listen for state updates
  window.addEventListener('updateSidebar', () => {
    renderSidebar();
  });
}

function renderSidebar() {
  const sidebar = document.querySelector('#sidebar-container');
  
  sidebar.innerHTML = /* html */`
    <div class="flex flex-col h-full bg-primary w-24 py-6 items-center space-y-8 border-r border-primary-dark rounded-r-lg shadow-xl">
      
      <!-- Robot Button -->
      <div class="flex flex-col items-center group cursor-pointer hover:scale-105 transition-transform" data-modal="robot">
        <div class="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center mb-2 group-hover:bg-white/20 transition-all relative">
          <span class="text-2xl text-white font-bold">+</span>
          ${configState.robot.configured ? 
            '<div class="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-primary flex items-center justify-center"><span class="text-white text-xs">✓</span></div>' 
            : ''}
        </div>
        <span class="text-sm text-white uppercase font-medium">Robot</span>
      </div>
      
      <!-- Camera Button -->
      <div class="flex flex-col items-center group cursor-pointer hover:scale-105 transition-transform" data-modal="camera">
        <div class="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center mb-2 group-hover:bg-white/20 transition-all relative">
          <span class="text-2xl text-white font-bold">+</span>
          ${configState.camera.configured ? 
            '<div class="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-primary flex items-center justify-center"><span class="text-white text-xs">✓</span></div>' 
            : ''}
        </div>
        <span class="text-sm text-white uppercase font-medium text-center leading-tight">Camera</span>
      </div>
      
      <!-- Camera Config Button -->
      <div class="flex flex-col items-center group cursor-pointer text-center px-1 hover:scale-105 transition-transform" data-modal="cameraConfig">
        <div class="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center mb-2 group-hover:bg-white/20 transition-all relative">
          <span class="text-2xl text-white font-bold">+</span>
          ${configState.cameraConfig.configured ? 
            '<div class="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-primary flex items-center justify-center"><span class="text-white text-xs">✓</span></div>' 
            : ''}
        </div>
        <span class="text-[13px] text-white uppercase font-medium leading-tight">Camera<br>Config</span>
      </div>
      
      <!-- EOAT Button -->
      <div class="flex flex-col items-center group cursor-pointer hover:scale-105 transition-transform" data-modal="eoat">
        <div class="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center mb-2 group-hover:bg-white/20 transition-all relative">
          <span class="text-2xl text-white font-bold">+</span>
          ${configState.eoat.configured ? 
            '<div class="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-primary flex items-center justify-center"><span class="text-white text-xs">✓</span></div>' 
            : ''}
        </div>
        <span class="text-sm text-white uppercase font-medium">EOAT</span>
      </div>
      
    </div>
  `;
  
  // 🏭 Event listeners using Factory Pattern
  sidebar.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modalType = e.currentTarget.dataset.modal;
      ModalFactory.open(modalType);
    });
  });
}
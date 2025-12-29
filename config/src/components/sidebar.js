import { openRobotModal } from './modals/robotModal.js';
import { configState } from '../state/configState.js';

export function initSidebar() {
  const sidebar = document.querySelector('#sidebar-container');
  sidebar.innerHTML = /* html */`
    <div class="flex flex-col h-full bg-[#004d40] w-24 py-6 items-center space-y-8 border-r border-[#00332c] rounded-r-lg">
      
      <!-- Robot Button -->
      <div class="flex flex-col items-center group cursor-pointer" id="robot-btn">
        <div class="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center mb-2 pb-1 group-hover:bg-white/10 transition-all relative">
          <span class="text-2xl text-white">+</span>
          ${configState.robot.configured ? '<div class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#004d40]"></div>' : ''}
        </div>
        <span class="text-[15px] text-white uppercase font-medium">robot</span>
      </div>
      
      <!-- Camera Button -->
      <div class="flex flex-col items-center group cursor-pointer" id="camera-btn">
        <div class="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center mb-1 pb-1 group-hover:bg-white/10 transition-all relative">
          <span class="text-2xl text-white">+</span>
          ${configState.camera.configured ? '<div class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#004d40]"></div>' : ''}
        </div>
        <span class="text-[15px] text-white uppercase font-medium text-center leading-none">camera</span>
      </div>
      
      <!-- Camera Config Button -->
      <div class="flex flex-col items-center group cursor-pointer text-center px-1" id="camera-config-btn">
        <div class="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center mb-1 pb-1 group-hover:bg-white/10 transition-all relative">
          <span class="text-2xl text-white">+</span>
          ${configState.cameraConfig.configured ? '<div class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#004d40]"></div>' : ''}
        </div>
        <span class="text-[15px] text-white uppercase font-medium leading-tight">camera config</span>
      </div>
      
      <!-- EOAT Button -->
      <div class="flex flex-col items-center group cursor-pointer" id="eoat-btn">
        <div class="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center mb-1 pb-1 group-hover:bg-white/10 transition-all relative">
          <span class="text-2xl text-white">+</span>
          ${configState.eoat.configured ? '<div class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#004d40]"></div>' : ''}
        </div>
        <span class="text-[15px] text-white uppercase font-medium">eoat</span>
      </div>
      
    </div>
  `;
  
  // Event Listeners
  document.getElementById('robot-btn').addEventListener('click', openRobotModal);
  // بنضيف الباقي لاحقاً
}
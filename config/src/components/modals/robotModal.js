import { saveConfig, configState } from '../../state/configState.js';

export function createRobotModal() {
  const modal = document.createElement('div');
  modal.id = 'robot-modal';
  modal.className = 'fixed inset-0 bg-black/50 hidden items-center justify-center z-50';
  
  modal.innerHTML = /*html*/`
    <div class="bg-[#1a1a1a] rounded-lg w-[450px] max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="bg-[#004d40] text-white px-6 py-4 rounded-t-lg">
        <h2 class="text-xl font-bold uppercase">Robot Config</h2>
      </div>
      
      <!-- Content -->
      <div class="p-6 space-y-4">
        
        <!-- Robot Name -->
        <div>
          <label class="block text-white text-sm font-medium mb-2">Robot Name</label>
          <input 
            type="text" 
            id="robot-name"
            class="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-gray-600 focus:border-[#004d40] outline-none"
            placeholder="Enter robot name"
            value="${configState.robot.data.name || ''}"
          />
        </div>
        
        <!-- Robot Brand -->
        <div>
          <label class="block text-white text-sm font-medium mb-2">Robot Brand</label>
          <select 
            id="robot-brand"
            class="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-gray-600 focus:border-[#004d40] outline-none"
          >
            <option value="">Select brand</option>
            <option value="Universal Robots" ${configState.robot.data.brand === 'Universal Robots' ? 'selected' : ''}>Universal Robots</option>
            <option value="ABB" ${configState.robot.data.brand === 'ABB' ? 'selected' : ''}>ABB</option>
            <option value="KUKA" ${configState.robot.data.brand === 'KUKA' ? 'selected' : ''}>KUKA</option>
          </select>
        </div>
        
        <!-- Robot Type -->
        <div>
          <label class="block text-white text-sm font-medium mb-2">Robot Type</label>
          <select 
            id="robot-type"
            class="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-gray-600 focus:border-[#004d40] outline-none"
          >
            <option value="UR10" ${configState.robot.data.type === 'UR10' ? 'selected' : ''}>UR10</option>
            <option value="UR20" ${configState.robot.data.type === 'UR20' ? 'selected' : ''}>UR20</option>
          </select>
        </div>
        
        <!-- Robot IP -->
        <div>
          <label class="block text-white text-sm font-medium mb-2">Robot IP</label>
          <input 
            type="text" 
            id="robot-ip"
            class="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-gray-600 focus:border-[#004d40] outline-none"
            placeholder="192.168.1.100"
            value="${configState.robot.data.ip || ''}"
          />
        </div>
        
        <!-- PC/Host IP -->
        <div>
          <label class="block text-white text-sm font-medium mb-2">PC/Host IP</label>
          <input 
            type="text" 
            id="robot-pc-ip"
            class="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-gray-600 focus:border-[#004d40] outline-none"
            placeholder="192.168.1.10"
            value="${configState.robot.data.pcIp || ''}"
          />
        </div>
        
        <!-- Translation -->
        <div>
          <label class="block text-white text-sm font-medium mb-2">Translation</label>
          <div class="grid grid-cols-3 gap-2">
            <input 
              type="number" 
              id="robot-trans-x"
              class="bg-[#2a2a2a] text-white px-2 py-2 rounded border border-gray-600 text-center"
              placeholder="X"
              value="${configState.robot.data.translation.x || 0}"
            />
            <input 
              type="number" 
              id="robot-trans-y"
              class="bg-[#2a2a2a] text-white px-2 py-2 rounded border border-gray-600 text-center"
              placeholder="Y"
              value="${configState.robot.data.translation.y || 0}"
            />
            <input 
              type="number" 
              id="robot-trans-z"
              class="bg-[#2a2a2a] text-white px-2 py-2 rounded border border-gray-600 text-center"
              placeholder="Z"
              value="${configState.robot.data.translation.z || 0}"
            />
          </div>
        </div>
        
        <!-- Rotation -->
        <div>
          <label class="block text-white text-sm font-medium mb-2">Rotation</label>
          <div class="grid grid-cols-3 gap-2">
            <input 
              type="number" 
              id="robot-rot-rx"
              class="bg-[#2a2a2a] text-white px-2 py-2 rounded border border-gray-600 text-center"
              placeholder="RX"
              value="${configState.robot.data.rotation.rx || 0}"
            />
            <input 
              type="number" 
              id="robot-rot-ry"
              class="bg-[#2a2a2a] text-white px-2 py-2 rounded border border-gray-600 text-center"
              placeholder="RY"
              value="${configState.robot.data.rotation.ry || 0}"
            />
            <input 
              type="number" 
              id="robot-rot-rz"
              class="bg-[#2a2a2a] text-white px-2 py-2 rounded border border-gray-600 text-center"
              placeholder="RZ"
              value="${configState.robot.data.rotation.rz || 0}"
            />
          </div>
        </div>
        
      </div>
      
      <!-- Footer -->
      <div class="px-6 py-4 bg-[#1a1a1a] flex justify-end gap-3 border-t border-gray-700 rounded-b-lg">
        <button 
          id="robot-cancel-btn"
          class="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-all"
        >
          Cancel
        </button>
        <button 
          id="robot-ok-btn"
          class="px-6 py-2 bg-[#004d40] text-white rounded hover:bg-[#00332c] transition-all"
        >
          OK
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Event Listeners
  setupRobotModalEvents(modal);
}

function setupRobotModalEvents(modal) {
  const cancelBtn = modal.querySelector('#robot-cancel-btn');
  const okBtn = modal.querySelector('#robot-ok-btn');
  
  cancelBtn.addEventListener('click', () => {
    closeRobotModal();
  });
  
  okBtn.addEventListener('click', () => {
    saveRobotConfig();
  });
  
  // إغلاق عند النقر خارج المودال
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeRobotModal();
    }
  });
}

function saveRobotConfig() {
  const data = {
    name: document.getElementById('robot-name').value,
    brand: document.getElementById('robot-brand').value,
    type: document.getElementById('robot-type').value,
    ip: document.getElementById('robot-ip').value,
    pcIp: document.getElementById('robot-pc-ip').value,
    translation: {
      x: parseFloat(document.getElementById('robot-trans-x').value) || 0,
      y: parseFloat(document.getElementById('robot-trans-y').value) || 0,
      z: parseFloat(document.getElementById('robot-trans-z').value) || 0
    },
    rotation: {
      rx: parseFloat(document.getElementById('robot-rot-rx').value) || 0,
      ry: parseFloat(document.getElementById('robot-rot-ry').value) || 0,
      rz: parseFloat(document.getElementById('robot-rot-rz').value) || 0
    }
  };
  
  // Validation بسيطة
  if (!data.name || !data.brand || !data.type || !data.ip) {
    alert('Please fill all required fields!');
    return;
  }
  
  saveConfig('robot', data);
  closeRobotModal();
  
  alert('Robot configuration saved successfully!');
}

export function openRobotModal() {
  const modal = document.getElementById('robot-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

export function closeRobotModal() {
  const modal = document.getElementById('robot-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}
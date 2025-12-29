export const configState = {
robot: {
    configured: false,
    data: {
    name: '',
    brand: '',
     type: '',
      ip: '',
      pcIp: '',
      translation: { x: 0, y: 0, z: 0 },
      rotation: { rx: 0, ry: 0, rz: 0 }
    }
  },
  
  camera: {
    configured: false,
    data: {
      type: '',
      width: 0,
      height: 0,
      fx: 0,
      fy: 0,
      cx: 0,
      cy: 0
    }
  },
  
  cameraConfig: {
    configured: false,
    data: {
      type: '', // hand-in-eye or hand-to-eye
      calibrationFile: null
    }
  },
  
  eoat: {
    configured: false,
    data: {
      shape: '', // cylinder or cube
      radius: 0,
      height: 0,
      length: 0,
      width: 0
    }
  }
};

// دالة للتحقق إذا كل الإعدادات جاهزة
export function isAllConfigured() {
  return configState.robot.configured && 
         configState.camera.configured && 
         configState.cameraConfig.configured && 
         configState.eoat.configured;
}

// دالة لحفظ البيانات
export function saveConfig(type, data) {
  if (configState[type]) {
    configState[type].data = { ...configState[type].data, ...data };
    configState[type].configured = true;
    
    // حفظ في localStorage
    localStorage.setItem('robotConfig', JSON.stringify(configState));
    
    // تحديث زر Start Simulation
    updateStartButton();
  }
}

// دالة لتحميل البيانات المحفوظة
export function loadConfig() {
  const saved = localStorage.getItem('robotConfig');
  if (saved) {
    const loaded = JSON.parse(saved);
   // تقوم هذه الدالة بـ "دمج" القيم المحملة من المتصفح فوق القيم الموجودة حالياً.
    Object.assign(configState, loaded);
    updateStartButton();
  }
}

// تحديث زر Start Simulation
function updateStartButton() {
  const startBtn = document.getElementById('start-simulation-btn');
  if (startBtn) {
    if (isAllConfigured()) {
      startBtn.disabled = false;
      startBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      startBtn.classList.add('hover:bg-[#00332c]');
    } else {
      startBtn.disabled = true;
      startBtn.classList.add('opacity-50', 'cursor-not-allowed');
      startBtn.classList.remove('hover:bg-[#00332c]');
    }
  }
}
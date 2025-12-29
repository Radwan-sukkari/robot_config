import './style.css';
import { initHeader } from './components/header.js';
import { initSidebar } from './components/sidebar.js';
import { createRobotModal } from './components/modals/robotModal.js';
import { loadConfig } from './state/configState.js';
import { initScene } from './components/scene.js';

// Initialize App
function init() {
  // تحميل البيانات المحفوظة
  loadConfig();
  
  // إنشاء المكونات
  initHeader();
  initSidebar();
  
  // إنشاء المودالات
  createRobotModal();
  // createCameraModal();
  // createCameraConfigModal();
  // createEOATModal();
  
  // إنشاء المشهد 3D
  initScene();
}



// Start App
init();
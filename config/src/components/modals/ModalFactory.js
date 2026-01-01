
import { BaseModal } from './BaseModal.js';
import { robotConfig } from './configs/robotConfig.js';
import { cameraConfig } from './configs/cameraConfig.js';
import { cameraConfigConfig } from './configs/cameraConfigConfig.js';
import { eoatConfig } from './configs/eoatConfig.js';

// 🏭 Modal Factory - Factory Pattern Implementation
export class ModalFactory {
  static configs = {
    robot: robotConfig,
    camera: cameraConfig,
    cameraConfig: cameraConfigConfig,
    eoat: eoatConfig
  };
  
  static modals = {};
  
  /**
   * Create a modal instance
   * @param {string} type - Modal type (robot, camera, cameraConfig, eoat)
   * @returns {BaseModal} Modal instance
   */
  static create(type) {
    const config = this.configs[type];
    
    if (!config) {
      throw new Error(`❌ Modal type "${type}" not found!`);
    }
    
    console.log(`🏭 Creating modal: ${type}`);
    
    const modal = new BaseModal(config);
    modal.create();
    
    this.modals[type] = modal;
    
    return modal;
  }
  
  /**
   * Open a modal (creates if doesn't exist)
   * @param {string} type - Modal type
   */
  static open(type) {
    if (!this.modals[type]) {
      this.create(type);
    }
    
    console.log(`📂 Opening modal: ${type}`);
    this.modals[type].open();
  }
  
  /**
   * Close a modal
   * @param {string} type - Modal type
   */
  static close(type) {
    if (this.modals[type]) {
      console.log(`📁 Closing modal: ${type}`);
      this.modals[type].close();
    }
  }
  
  /**
   * Create all modals at once
   */
  static createAll() {
    console.log('🏭 Creating all modals...');
    Object.keys(this.configs).forEach(type => {
      this.create(type);
    });
    console.log('✅ All modals created');
  }
  
  /**
   * Get a modal instance
   * @param {string} type - Modal type
   * @returns {BaseModal|null} Modal instance or null
   */
  static get(type) {
    return this.modals[type] || null;
  }
  
  /**
   * Check if a modal exists
   * @param {string} type - Modal type
   * @returns {boolean}
   */
  static exists(type) {
    return !!this.modals[type];
  }
}


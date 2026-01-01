import { configState } from '../../../state/configState.js';
import { validateIP, validateRequired } from '../../../utils/validators.js';

export const robotConfig = {
  id: 'robot',
  title: 'Robot Config',
  stateKey: 'robot',
  
  fields: [
    {
      type: 'text',
      id: 'name',
      label: 'Robot Name',
      placeholder: 'Enter robot name',
      value: configState.robot.data.name,
      required: true
    },
    {
      type: 'select',
      id: 'brand',
      label: 'Robot Brand',
      required: true,
      options: [
        { value: '', label: 'Select brand' },
        { 
          value: 'Universal Robots', 
          label: 'Universal Robots', 
          selected: configState.robot.data.brand === 'Universal Robots' 
        },
        { 
          value: 'ABB', 
          label: 'ABB', 
          selected: configState.robot.data.brand === 'ABB' 
        },
        { 
          value: 'KUKA', 
          label: 'KUKA', 
          selected: configState.robot.data.brand === 'KUKA' 
        },
        { 
          value: 'Fanuc', 
          label: 'Fanuc', 
          selected: configState.robot.data.brand === 'Fanuc' 
        }
      ]
    },
    {
      type: 'select',
      id: 'type',
      label: 'Robot Type',
      required: true,
      options: [
        { value: '', label: 'Select type' },
        { 
          value: 'UR10', 
          label: 'UR10', 
          selected: configState.robot.data.type === 'UR10' 
        },
        { 
          value: 'UR20', 
          label: 'UR20', 
          selected: configState.robot.data.type === 'UR20' 
        },
        { 
          value: 'UR5', 
          label: 'UR5', 
          selected: configState.robot.data.type === 'UR5' 
        }
      ]
    },
    {
      type: 'text',
      id: 'ip',
      label: 'Robot IP Address',
      placeholder: '192.168.1.100',
      value: configState.robot.data.ip,
      required: true
    },
    {
      type: 'text',
      id: 'pcIp',
      label: 'PC/Host IP Address',
      placeholder: '192.168.1.10',
      value: configState.robot.data.pcIp,
      required: true
    },
    {
      type: 'grid',
      id: 'translation',
      label: 'Translation (mm)',
      columns: 3,
      inputs: [
        { 
          id: 'translation-x', 
          placeholder: 'X', 
          value: configState.robot.data.translation?.x || 0,
          step: '0.1'
        },
        { 
          id: 'translation-y', 
          placeholder: 'Y', 
          value: configState.robot.data.translation?.y || 0,
          step: '0.1'
        },
        { 
          id: 'translation-z', 
          placeholder: 'Z', 
          value: configState.robot.data.translation?.z || 0,
          step: '0.1'
        }
      ]
    },
    {
      type: 'grid',
      id: 'rotation',
      label: 'Rotation (degrees)',
      columns: 3,
      inputs: [
        { 
          id: 'rotation-rx', 
          placeholder: 'RX', 
          value: configState.robot.data.rotation?.rx || 0,
          step: '0.1'
        },
        { 
          id: 'rotation-ry', 
          placeholder: 'RY', 
          value: configState.robot.data.rotation?.ry || 0,
          step: '0.1'
        },
        { 
          id: 'rotation-rz', 
          placeholder: 'RZ', 
          value: configState.robot.data.rotation?.rz || 0,
          step: '0.1'
        }
      ]
    }
  ],
  
  validate: (data) => {
    // Check required fields
    if (!validateRequired(data.name)) {
      alert('❌ Robot name is required');
      return false;
    }
    if (!validateRequired(data.brand)) {
      alert('❌ Robot brand is required');
      return false;
    }
    if (!validateRequired(data.type)) {
      alert('❌ Robot type is required');
      return false;
    }
    
    // Validate IPs
    if (!validateIP(data.ip)) {
      alert('❌ Invalid Robot IP address');
      return false;
    }
    if (!validateIP(data.pcIp)) {
      alert('❌ Invalid PC/Host IP address');
      return false;
    }
    
    return true;
  }
};
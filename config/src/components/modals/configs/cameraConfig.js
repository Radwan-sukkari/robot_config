import { configState } from '../../../state/configState.js';
import { validateRequired, validatePositiveNumber } from '../../../utils/validators.js';

export const cameraConfig = {
  id: 'camera',
  title: 'Camera Configuration',
  stateKey: 'camera',
  
  fields: [
    {
      type: 'select',
      id: 'type',
      label: 'Camera Type',
      required: true,
      options: [
        { value: '', label: 'Select camera type' },
        { 
          value: 'Orbbec', 
          label: 'Orbbec', 
          selected: configState.camera.data.type === 'Orbbec' 
        },
        { 
          value: 'RealSense', 
          label: 'Intel RealSense', 
          selected: configState.camera.data.type === 'RealSense' 
        },
        { 
          value: 'Kinect', 
          label: 'Microsoft Kinect', 
          selected: configState.camera.data.type === 'Kinect' 
        }
      ]
    },
    {
      type: 'number',
      id: 'width',
      label: 'Width (pixels)',
      placeholder: '1920',
      value: configState.camera.data.width,
      required: true
    },
    {
      type: 'number',
      id: 'height',
      label: 'Height (pixels)',
      placeholder: '1080',
      value: configState.camera.data.height,
      required: true
    },
    {
      type: 'number',
      id: 'fx',
      label: 'Focal Point X (FX)',
      placeholder: 'e.g., 615.123',
      value: configState.camera.data.fx,
      required: true,
      step: '0.001'
    },
    {
      type: 'number',
      id: 'fy',
      label: 'Focal Point Y (FY)',
      placeholder: 'e.g., 615.456',
      value: configState.camera.data.fy,
      required: true,
      step: '0.001'
    },
    {
      type: 'number',
      id: 'cx',
      label: 'Central Point X (CX)',
      placeholder: 'e.g., 320.5',
      value: configState.camera.data.cx,
      required: true,
      step: '0.001'
    },
    {
      type: 'number',
      id: 'cy',
      label: 'Central Point Y (CY)',
      placeholder: 'e.g., 240.5',
      value: configState.camera.data.cy,
      required: true,
      step: '0.001'
    }
  ],
  
  validate: (data) => {
    if (!validateRequired(data.type)) {
      alert('❌ Camera type is required');
      return false;
    }
    
    if (!validatePositiveNumber(data.width) || !validatePositiveNumber(data.height)) {
      alert('❌ Width and height must be positive numbers');
      return false;
    }
    
    if (!validatePositiveNumber(data.fx) || !validatePositiveNumber(data.fy)) {
      alert('❌ Focal points (FX, FY) must be positive numbers');
      return false;
    }
    
    if (!validatePositiveNumber(data.cx) || !validatePositiveNumber(data.cy)) {
      alert('❌ Central points (CX, CY) must be positive numbers');
      return false;
    }
    
    return true;
  }
};
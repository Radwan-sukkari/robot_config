# 🤖 Robot Configuration & Simulation System

> A comprehensive web-based platform for industrial robot configuration and real-time 3D simulation

![Project Status](https://img.shields.io/badge/status-Production%20Ready-success)
![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Demo](#demo)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Project Architecture](#project-architecture)
- [Configuration Guide](#configuration-guide)
- [Live Simulation](#live-simulation)
- [Technologies](#technologies)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

This system provides an end-to-end solution for configuring and simulating industrial robots in a browser environment. Whether you're setting up a new robotic workcell or testing different configurations, this tool streamlines the entire workflow from initial setup to live 3D visualization.

### What Makes This Different?

- **Zero Installation Required** - Runs entirely in the browser
- **Real URDF Support** - Load actual robot models (UR5, UR10, UR20)
- **Live 3D Simulation** - See changes in real-time
- **Persistent Configuration** - Your settings are automatically saved
- **Industrial Grade** - Built with real-world robotics workflows in mind

---

## ✨ Key Features

### 🔧 Configuration Mode

**Robot Setup**
- Support for major brands (Universal Robots, ABB, KUKA, Fanuc)
- Multiple robot types (UR5, UR10, UR20)
- Network configuration (Robot IP, Host PC IP)
- Precise positioning (X, Y, Z translation + RX, RY, RZ rotation)

**Vision System Setup**
- Multiple camera types (Orbbec, RealSense, Kinect)
- Resolution configuration (width, height)
- Camera intrinsics (focal points, principal points)
- Calibration file support (.yml, .yaml, .json, .toml)
- Teaching modes (Hand-in-eye / Hand-to-eye)

**End Effector Tools**
- Flexible geometry (Cylinder, Cube)
- Parametric dimensions (radius, height, length, width)
- Visual 3D representation
- Dynamic form generation

**Smart Validation**
- Real-time field validation
- IP address format checking
- Required field enforcement
- Clear error messaging

### 🎬 Live Simulation Mode

**3D Visualization**
- Full 3D scene with professional lighting
- Orbit controls (pan, zoom, rotate)
- Shadow rendering
- Grid floor reference

**Object Management**
- Class list sidebar showing all scene objects
- Object selection and highlighting
- Properties panel for detailed control
- Real-time transform updates

**Interactive Editing**
- Modify object positions (X, Y, Z in millimeters)
- Adjust rotations (RX, RY, RZ in degrees)
- Update robot configuration on-the-fly
- Change tool geometry dynamically
- Edit camera parameters

**Scene Control**
- Add/remove objects
- Reset camera view
- Clear scene
- Start new configuration

---

## 🎥 Demo

### Configuration Flow
1. Click **Robot** → Fill in brand, type, IPs, and position
2. Click **Camera** → Set type, resolution, and intrinsics
3. Click **Camera Config** → Choose teaching method and upload calibration
4. Click **EOAT** → Define tool shape and dimensions
5. Click **▶ Start Simulation** → Enter live mode

### Simulation Workflow
1. View all objects in **Class List** sidebar
2. Click any object to select it
3. Edit properties in **Properties Panel**
4. See changes applied instantly in 3D view
5. Export configuration when ready

---

## 📸 Screenshots

> Note: Screenshots are stored in the docs/images/ directory

### Configuration Mode
![Configuration Overview](config/docs/images/config.png)
*Main configuration interface with sidebar*

### Robot Configuration Modal
![Robot Config](config/docs/images/robot_config.png)
*Robot configuration dialog*

### Camera Configuration
![Camera Config](config/docs/images/camera_config.png)
*Camera setup interface*

### EOAT Configuration
![EOAT Config](config/docs/images/EoAT_config.png)
*End-of-arm tool configuration with dynamic fields*


---
## 🚀 Installation

### Prerequisites

```bash
Node.js >= 16.x
npm >= 8.x
Modern browser (Chrome, Firefox, Edge, Safari)
```

### Clone and Install

```bash
# Clone repository
git clone https://github.com/Radwan-sukkari/robot_config.git
cd robot_config/config

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The optimized build will be in `dist/` directory.

---

## 🎮 Quick Start

### First Time Setup

1. **Start the application**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:5173`

2. **Configure your robot**
   - Click the **Robot** button in sidebar
   - Enter robot details and click **OK**
   - Green checkmark appears when saved

3. **Set up your camera**
   - Click **Camera** button
   - Fill in camera specifications
   - Configure teaching method in **Camera Config**

4. **Define your tool**
   - Click **EOAT** button
   - Select shape and enter dimensions

5. **Launch simulation**
   - Click **▶ Start Simulation**
   - Your configuration loads in 3D space

### Using the Simulator

**Navigate the scene:**
- Left-click + drag: Rotate view
- Right-click + drag: Pan
- Scroll wheel: Zoom in/out

**Edit objects:**
- Select object from Class List
- Modify values in Properties Panel
- Click **Update** to apply changes

**Keyboard shortcuts:**
- `Esc`: Close modal
- Double-click: Quick edit object

---

## 📐 Project Architecture

```
config/
├── public/
│   └── urdfs/               # Robot URDF models
│       ├── ur10/
│       ├── ur20/
│       └── ur5/
│
├── src/
│   ├── components/
│   │   ├── modals/          # Configuration dialogs
│   │   │   ├── BaseModal.js
│   │   │   ├── ModalFactory.js
│   │   │   └── configs/
│   │   │       ├── robotConfig.js
│   │   │       ├── cameraConfig.js
│   │   │       ├── cameraConfigConfig.js
│   │   │       └── eoatConfig.js
│   │   │
│   │   ├── liveSimulation/  # 3D simulation mode
│   │   │   ├── LiveSimulation.js
│   │   │   ├── LiveSimHeader.js
│   │   │   ├── Canvas3D.js
│   │   │   ├── ClassList.js
│   │   │   └── PropertiesPanel.js
│   │   │
│   │   ├── header.js
│   │   ├── sidebar.js
│   │   └── scene.js
│   │
│   ├── scene/               # 3D scene management
│   │   ├── SceneManager.js
│   │   └── RobotLoader.js
│   │
│   ├── state/               # State management
│   │   ├── configState.js
│   │   └── sceneState.js
│   │
│   ├── utils/
│   │   └── validators.js
│   │
│   ├── main.js
│   └── style.css
│
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

### Design Patterns

**Factory Pattern**
- `ModalFactory` creates configuration modals on demand
- Reduces code duplication
- Easy to extend with new configuration types

**State Management**
- Centralized state in `configState` and `sceneState`
- Automatic localStorage persistence
- Event-driven updates across components

**Component Architecture**
- Self-contained, reusable components
- Clear separation of concerns
- Easy to test and maintain

---

## ⚙️ Configuration Guide

### Robot Configuration

| Parameter | Type | Range/Format | Example |
|-----------|------|--------------|---------|
| Name | String | Any text | "Cell 1 Robot" |
| Brand | Select | UR, ABB, KUKA, Fanuc | Universal Robots |
| Type | Select | UR5, UR10, UR20 | UR10 |
| Robot IP | String | IPv4 format | 192.168.1.100 |
| PC IP | String | IPv4 format | 192.168.1.10 |
| X Position | Number | mm | 0 - 5000 |
| Y Position | Number | mm | 0 - 5000 |
| Z Position | Number | mm | 0 - 5000 |
| RX Rotation | Number | degrees | -180 to 180 |
| RY Rotation | Number | degrees | -180 to 180 |
| RZ Rotation | Number | degrees | -180 to 180 |

### Camera Configuration

| Parameter | Type | Description | Typical Range |
|-----------|------|-------------|---------------|
| Camera Type | Select | Device model | Orbbec, RealSense, Kinect |
| Width | Integer | Image width in pixels | 640 - 1920 |
| Height | Integer | Image height in pixels | 480 - 1080 |
| FX | Float | Focal length X | 500 - 1000 |
| FY | Float | Focal length Y | 500 - 1000 |
| CX | Float | Principal point X | Width/2 ± 50 |
| CY | Float | Principal point Y | Height/2 ± 50 |

### Teaching Configuration

| Parameter | Description |
|-----------|-------------|
| Hand-in-eye | Camera mounted on robot (moves with end effector) |
| Hand-to-eye | Camera fixed in workspace (stationary) |
| Calibration File | Camera-to-robot transformation matrix |

### EOAT Configuration

**Cylinder Tool**
- Radius: Tool radius in mm (e.g., 50)
- Height: Tool height in mm (e.g., 100)

**Cube Tool**
- Length: X dimension in mm
- Width: Y dimension in mm
- Height: Z dimension in mm

---

## 🎬 Live Simulation

### Scene Objects

The simulation manages these object types:

**Floor**
- 10m x 10m grid plane
- Non-deletable reference surface
- Receives shadows

**Robot**
- Full URDF model with accurate kinematics
- Configured brand/type displayed
- Position and orientation editable
- Can attach tools to end effector

**Camera**
- 3D representation (body + lens)
- Shows configured type
- Positioning adjustable
- Visual indicator for FOV (future feature)

**Tool (EOAT)**
- Attached to robot end effector or standalone
- Geometry updates when dimensions change
- Shape can be swapped (cylinder ↔ cube)

### Properties Panel

For any selected object, you can modify:

**Transform Properties**
- Position (X, Y, Z) in millimeters
- Rotation (RX, RY, RZ) in degrees
- Updates applied in real-time

**Object-Specific Properties**
- Robot: Name, Brand, Type, IPs
- Camera: Type, Resolution, Intrinsics
- Tool: Shape, Dimensions

**Actions**
- **Update**: Apply changes to scene
- **Delete**: Remove object (except floor)

### Scene Navigation

**Mouse Controls**
- Left drag: Orbit around center
- Right drag: Pan left/right/up/down
- Scroll: Zoom in/out
- Double-click: Focus on object (future)

**Reset View**
- Click "🔄 Reset View" in header
- Returns camera to default position (3, 3, 3)
- Resets orbit target to origin

---

## 🛠️ Technologies

### Core Stack
- **Vite 4** - Build tool and dev server
- **Three.js r128** - 3D graphics engine
- **urdf-loader** - URDF file parsing for robots
- **Tailwind CSS 3** - Utility-first styling
- **Vanilla JavaScript (ES6+)** - No framework overhead

### Libraries
- **OrbitControls** - 3D camera controls
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

### Development Tools
- **ESLint** - Code linting (optional)
- **Prettier** - Code formatting (optional)

---

## 📚 API Reference

### Configuration State

```javascript
import { configState, saveConfig, loadConfig } from './state/configState.js';

// Save configuration
saveConfig('robot', {
  name: 'Robot 1',
  brand: 'Universal Robots',
  type: 'UR10',
  ip: '192.168.1.100',
  pcIp: '192.168.1.10',
  translation: { x: 0, y: 0, z: 0 },
  rotation: { rx: 0, ry: 0, rz: 0 }
});

// Load configuration
loadConfig();

// Check if all configured
import { isAllConfigured } from './state/configState.js';
if (isAllConfigured()) {
  // Ready to start simulation
}
```

### Scene State

```javascript
import { 
  addSceneObject, 
  removeSceneObject, 
  updateSceneObject,
  selectObject 
} from './state/sceneState.js';

// Add object to scene
addSceneObject('tool', {
  type: 'tool',
  name: 'Gripper',
  position: { x: 0, y: 1600, z: 0 },
  rotation: { x: 0, y: 0, z: 0 }
});

// Update object
updateSceneObject('tool', {
  position: { x: 100, y: 1600, z: 50 }
});

// Remove object
removeSceneObject('tool');

// Select object
selectObject('robot');
```

### Modal Factory

```javascript
import { ModalFactory } from './components/modals/ModalFactory.js';

// Open configuration modal
ModalFactory.open('robot');

// Close modal
ModalFactory.close('robot');

// Get modal instance
const modal = ModalFactory.get('robot');
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/my-new-feature
   ```
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
   ```bash
   git commit -m "Add support for custom tool shapes"
   ```
6. Push to your fork
   ```bash
   git push origin feature/my-new-feature
   ```
7. Open a Pull Request

### Code Guidelines

- Use ES6+ modern JavaScript
- Follow existing code style
- Add comments for complex logic
- Update documentation
- Test in multiple browsers

### Adding New Robot Types

1. Add URDF files to `public/urdfs/[robot-name]/`
2. Update `RobotLoader.js` paths
3. Add to `robotConfig.js` options
4. Test loading in simulation

---

## 🐛 Troubleshooting

### Common Issues

**"Robot not loading in 3D"**
- Check that URDF files exist in `public/urdfs/`
- Verify mesh files (.stl, .dae) are present
- Check browser console for errors

**"Configuration not saving"**
- Ensure localStorage is enabled in browser
- Clear cache and try again
- Check browser console for errors

**"Start Simulation button disabled"**
- Verify all four configurations are complete
- Look for green checkmarks on all sidebar buttons
- Check console for validation errors

**"3D scene is black"**
- Check WebGL support in browser
- Update graphics drivers
- Try a different browser

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 👨‍💻 Author

**Radwan Sukkari**
- GitHub: [@Radwan-sukkari](https://github.com/Radwan-sukkari)
- Email: radwansukkari123@gmail.com
- LinkedIn: [Radwan Sukkari](https://linkedin.com/in/radwan-sukkari)

---

## 🙏 Acknowledgments

- Three.js team for the amazing 3D library
- Universal Robots for URDF model specifications
- Open-source robotics community
- Tailwind CSS for making styling enjoyable

---

## 🔮 Roadmap

### Upcoming Features
- [ ] Joint angle control for robot
- [ ] Trajectory planning and visualization
- [ ] Collision detection
- [ ] Multiple robot support
- [ ] Export scene as URDF
- [ ] Import existing configurations
- [ ] Camera FOV visualization
- [ ] Touch controls for mobile
- [ ] Dark/light theme toggle
- [ ] Multi-language support

### Long-term Vision
- Real robot connection via ROS
- Cloud configuration storage
- Collaborative editing
- AR preview mode
- Physics simulation

---

**Built with ❤️ for the robotics community**

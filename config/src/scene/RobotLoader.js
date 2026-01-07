//هو المسؤول عن "قراءة ملف الـ URDF وتحويله لمجسم".
import * as THREE from "three";
import URDFLoader from "urdf-loader";

//  Robot Loader - يستخدم URDF Loader الحقيقي
export class RobotLoader {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.loader = new URDFLoader();
    this.robot = null;
  }

  async loadRobot(robotType, config) {
    console.log(` Loading robot: ${robotType}...`);

    try {
      // Get URDF path
      const urdfPath = this.getURDFPath(robotType);

      console.log(" URDF Path:", urdfPath);

      // Load URDF
      const robot = await this.loadURDF(urdfPath);

      // Apply configuration
      this.applyConfig(robot, config);

      // Add to scene
      this.sceneManager.addObject("robot", robot, {
        type: "robot",
        name: `Robot ${robotType}`,
        robotType: robotType,
      });

      this.robot = robot;

      console.log(`✅ Robot loaded: ${robotType}`);

      return robot;
    } catch (error) {
      console.error("❌ Failed to load robot:", error);
      console.error("Error stack:", error.stack);
      throw error;
    }
  }

  getURDFPath(robotType) {
    // مسارات الـ URDF files
    const paths = {
      UR10: "/urdfs/ur10/urdf/ur10_robot.urdf",
      UR3: "/urdfs/ur3/urdf/ur3_robot.urdf",
      UR5: "/urdfs/ur5/urdf/ur5_robot.urdf",
      UR20: "/urdfs/ur20/urdf/ur20_robot.urdf",
    };

    return paths[robotType] || paths["UR10"];
  }

  loadURDF(path) {
    return new Promise((resolve, reject) => {
      console.log("⏳ Starting URDF load from:", path);

      this.loader.load(
        path,
        (robot) => {
          console.log(" URDF loaded successfully!");
          console.log("Robot details:", {
            name: robot.robotName,
            joints: robot.joints ? Object.keys(robot.joints) : [],
            links: robot.links ? Object.keys(robot.links) : [],
          });

          // تحسين المظهر
          robot.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true; // الروبوت يرمي ظل على الأرض
              child.receiveShadow = true; // الروبوت يستقبل ظلالاً عليه

              if (child.material) {
                child.material.metalness = 0.3; // إعطاء لمعة معدنية خفيفة
                child.material.roughness = 0.4; // التحكم بمدى نعومة السطح
              }
            }
          });

          resolve(robot);
        },
        (xhr) => {
          if (xhr && xhr.lengthComputable) {
            const percent = ((xhr.loaded / xhr.total) * 100).toFixed(0);
            console.log(`⏳ Loading: ${percent}%`);
          }
        },
        (error) => {
          console.error("❌ URDF Loader Error:", error);
          console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            path: path,
          });

          // رسالة مساعدة
          console.error(`
 URDF Loading Checklist:
1. File exists at: public${path}
2. All mesh files (.stl, .dae) in meshes folder
3. URDF uses relative paths (e.g., package://robot/meshes/base.stl)
4. Vite dev server is running (not file://)
5. Check browser Network tab for failed requests
          `);

          reject(error);
        }
      );
    });
  }

  applyConfig(robot, config) {
    if (!config) return;

    console.log("⚙️ Applying robot configuration:", config);

    // Position (convert mm to m)
    if (config.translation) {
      robot.position.set(
        (config.translation.x || 0) / 1000,
        (config.translation.y || 0) / 1000,
        (config.translation.z || 0) / 1000
      );
    }

    // Rotation (convert degrees to radians)
    if (config.rotation) {
      robot.rotation.set(
        THREE.MathUtils.degToRad(config.rotation.rx || 0),
        THREE.MathUtils.degToRad(config.rotation.ry || 0),
        THREE.MathUtils.degToRad(config.rotation.rz || 0)
      );
    }

    // Scale adjustment for UR10
    const bbox = new THREE.Box3().setFromObject(robot);
    const size = bbox.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    console.log("📏 Robot size:", { size, maxDim });

    if (maxDim < 0.1) {
      console.log("📏 Scaling up small robot");
      robot.scale.set(3, 3, 3);
    } else if (maxDim > 10) {
      console.log("📏 Scaling down large robot");
      robot.scale.set(0.1, 0.1, 0.1);
    }

    console.log(" Robot configuration applied");
  }

  // Get end effector
  getEndEffector() {
    if (!this.robot || !this.robot.links) return null;

    // Common end effector names
    const possibleNames = [
      "ee_link",
      "tool0",
      "tcp",
      "wrist_3_link",
      "flange",
      "tool_frame",
      "end_effector",
    ];

    for (const name of possibleNames) {
      if (this.robot.links[name]) {
        console.log(`✅ Found end-effector: ${name}`);
        return this.robot.links[name];
      }
    }

    // Use last link as fallback
    const linkNames = Object.keys(this.robot.links);
    if (linkNames.length > 0) {
      const lastLink = linkNames[linkNames.length - 1];
      console.log(`⚠️ Using last link as end-effector: ${lastLink}`);
      return this.robot.links[lastLink];
    }

    return null;
  }

  setJointAngles(angles) {
    if (!this.robot || !this.robot.joints) return;

    const jointNames = Object.keys(this.robot.joints);

    angles.forEach((angle, index) => {
      if (jointNames[index]) {
        const joint = this.robot.joints[jointNames[index]];
        if (joint && joint.setJointValue) {
          joint.setJointValue(angle);
        }
      }
    });
  }

  getJointAngles() {
    if (!this.robot || !this.robot.joints) return [];

    return Object.values(this.robot.joints).map((joint) => joint.angle || 0);
  }

  dispose() {
    if (this.robot) {
      this.sceneManager.removeObject("robot");
      this.robot = null;
    }
  }
}

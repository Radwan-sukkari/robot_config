import * as THREE from "three";

// three js take (meter and radians)

// Convert mm to meters
export function mmToMeters(mm) {
  return mm / 1000;
}

// Convert meters to mm
export function metersToMm(m) {
  return m * 1000;
}

// Convert degrees to radians
export function degToRad(deg) {
  return THREE.MathUtils.degToRad(deg);
}

// Convert radians to degrees
export function radToDeg(rad) {
  return THREE.MathUtils.radToDeg(rad);
}

// Create transformation matrix from pose
export function poseToMatrix(pose) {
  const matrix = new THREE.Matrix4();

  // Position
  const position = new THREE.Vector3(
    mmToMeters(pose.x || 0),
    mmToMeters(pose.y || 0),
    mmToMeters(pose.z || 0)
  );

  // Rotation (Euler angles)
  const rotation = new THREE.Euler(
    degToRad(pose.rx || 0),
    degToRad(pose.ry || 0),
    degToRad(pose.rz || 0),
    "XYZ"
  );

  matrix.makeRotationFromEuler(rotation);
  matrix.setPosition(position);

  return matrix;
}

// Extract pose from matrix
export function matrixToPose(matrix) {
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();

  matrix.decompose(position, quaternion, scale);

  const euler = new THREE.Euler().setFromQuaternion(quaternion, "XYZ");

  return {
    x: metersToMm(position.x),
    y: metersToMm(position.y),
    z: metersToMm(position.z),
    rx: radToDeg(euler.x),
    ry: radToDeg(euler.y),
    rz: radToDeg(euler.z),
  };
}

// Homogeneous transformation matrix
export function createHTM(rotation, translation) {
  const matrix = new THREE.Matrix4();

  // Set rotation part (3x3)
  matrix.set(
    rotation[0][0],
    rotation[0][1],
    rotation[0][2],
    translation.x,
    rotation[1][0],
    rotation[1][1],
    rotation[1][2],
    translation.y,
    rotation[2][0],
    rotation[2][1],
    rotation[2][2],
    translation.z,
    0,
    0,
    0,
    1
  );

  return matrix;
}

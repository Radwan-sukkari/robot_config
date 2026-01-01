// 🔍 Validation Utilities

export function validateIP(ip) {
  const pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!pattern.test(ip)) return false;

  return ip.split(".").every((num) => {
    const n = parseInt(num);
    return n >= 0 && n <= 255;
  });
}

export function validateRequired(value) {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  if (typeof value === "number") {
    return !isNaN(value) && value > 0;
  }
  return !!value;
}

export function validatePositiveNumber(value) {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
}

export function validateFileExtension(filename, allowedExtensions) {
  const ext = filename.split(".").pop().toLowerCase();
  return allowedExtensions.includes(ext);
}

// Theme Loader - Load and apply theme from JSON

let currentTheme = null;

/**
 * Load theme from JSON file
 * @returns {Promise<Object>} Theme object
 */
export async function loadTheme() {
  try {
    console.log("🎨 Loading theme...");

    const response = await fetch("/src/config/theme.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const theme = await response.json();
    currentTheme = theme;

    // Apply theme to CSS variables
    applyThemeToCSS(theme);

    console.log("✅ Theme loaded:", theme.name);
    return theme;
  } catch (error) {
    console.error("❌ Failed to load theme:", error);
    console.warn("⚠️ Using fallback theme");
    return getFallbackTheme();
  }
}

/**
 * Apply theme to CSS variables
 * @param {Object} theme - Theme object
 */
function applyThemeToCSS(theme) {
  const root = document.documentElement;

  // Apply colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });

  // Apply fonts
  root.style.setProperty("--font-family", theme.fonts.family);

  Object.entries(theme.fonts.sizes).forEach(([key, value]) => {
    root.style.setProperty(`--font-size-${key}`, value);
  });

  Object.entries(theme.fonts.weights).forEach(([key, value]) => {
    root.style.setProperty(`--font-weight-${key}`, value);
  });

  Object.entries(theme.fonts.lineHeights).forEach(([key, value]) => {
    root.style.setProperty(`--line-height-${key}`, value);
  });

  // Apply spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, value);
  });

  // Apply border radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    root.style.setProperty(`--radius-${key}`, value);
  });

  // Apply shadows
  Object.entries(theme.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value);
  });

  console.log("✅ Theme applied to CSS variables");
}

/**
 * Get current theme
 * @returns {Object|null} Current theme object
 */
export function getTheme() {
  return currentTheme;
}

/**
 * Get theme color value
 * @param {string} colorName - Color name (e.g., 'primary', 'background')
 * @returns {string} Color hex value
 */
export function getThemeColor(colorName) {
  if (currentTheme && currentTheme.colors[colorName]) {
    return currentTheme.colors[colorName];
  }

  // Fallback: try to get from CSS variable
  const cssValue = getComputedStyle(document.documentElement)
    .getPropertyValue(`--color-${colorName}`)
    .trim();

  return cssValue || "#000000";
}

/**
 * Get Three.js color as number
 * @param {string} colorName - Three.js color name
 * @returns {number} Color as hex number
 */
export function getThreeJSColor(colorName) {
  if (!currentTheme || !currentTheme.threeJS[colorName]) {
    return 0x000000;
  }

  const hexString = currentTheme.threeJS[colorName].replace("0x", "");
  return parseInt(hexString, 16);
}

/**
 * Get fallback theme (in case JSON fails to load)
 * @returns {Object} Fallback theme object
 */
function getFallbackTheme() {
  return {
    name: "Fallback Theme",
    version: "1.0.0",
    colors: {
      primary: "#4ECCA3",
      primaryDark: "#3da88a",
      background: "#1a1a1a",
      backgroundLight: "#2a2a2a",
      surface: "#232931",
      text: "#ffffff",
      textSecondary: "#9ca3af",
      border: "#374151",
      error: "#ef4444",
      success: "#22c55e",
    },
    threeJS: {
      primary: "0x4ECCA3",
      background: "0x232931",
      floor: "0x1a1d23",
      gridMain: "0x004d40",
      gridSecondary: "0x003329",
    },
    fonts: {
      family: "system-ui, sans-serif",
      sizes: { base: "1rem", sm: "0.875rem", lg: "1.125rem" },
      weights: { normal: "400", medium: "500", bold: "700" },
    },
    spacing: { sm: "0.5rem", md: "1rem", lg: "1.5rem" },
    borderRadius: { sm: "0.25rem", md: "0.5rem", lg: "0.75rem" },
  };
}

/**
 * Update theme dynamically
 * @param {Object} newTheme - New theme object
 */
export function updateTheme(newTheme) {
  currentTheme = { ...currentTheme, ...newTheme };
  applyThemeToCSS(currentTheme);
  console.log("✅ Theme updated");
}

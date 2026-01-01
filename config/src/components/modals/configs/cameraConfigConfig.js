import { configState } from "../../../state/configState.js";
import {
  validateRequired,
  validateFileExtension,
} from "../../../utils/validators.js";

export const cameraConfigConfig = {
  id: "camera-config",
  title: "Camera Configuration",
  stateKey: "cameraConfig",

  fields: [
    {
      type: "select",
      id: "type",
      label: "Teaching Type",
      required: true,
      options: [
        { value: "", label: "Select type" },
        {
          value: "Hand-in-eye",
          label: "Hand-in-eye (Camera moves with robot)",
          selected: configState.cameraConfig.data.type === "Hand-in-eye",
        },
        {
          value: "Hand-to-eye",
          label: "Hand-to-eye (Fixed camera)",
          selected: configState.cameraConfig.data.type === "Hand-to-eye",
        },
      ],
    },
    {
      type: "file",
      id: "calibrationFile",
      label: "Calibration File",
      placeholder: "No file selected",
      value: configState.cameraConfig.data.calibrationFile,
      accept: ".yml,.yaml,.json,.toml",
      hint: "Accepted formats: .yml, .yaml, .json, .toml",
      required: false,
    },
  ],

  validate: (data) => {
    if (!validateRequired(data.type)) {
      alert("❌ Teaching type is required");
      return false;
    }

    // Calibration file is optional but if provided, validate extension
    if (
      data.calibrationFile &&
      !validateFileExtension(data.calibrationFile, [
        "yml",
        "yaml",
        "json",
        "toml",
      ])
    ) {
      alert(
        "❌ Invalid calibration file format. Use .yml, .yaml, .json, or .toml"
      );
      return false;
    }

    return true;
  },
};

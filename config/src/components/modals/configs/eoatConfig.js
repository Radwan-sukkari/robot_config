import { configState } from "../../../state/configState.js";
import {
  validateRequired,
  validatePositiveNumber,
} from "../../../utils/validators.js";

export const eoatConfig = {
  id: "eoat",
  title: "End of Arm Tool Configuration",
  stateKey: "eoat",

  fields: [
    {
      type: "select",
      id: "shape",
      label: "Tool Shape",
      required: true,
      onChange: true, // Enable dynamic fields
      options: [
        //{ value: '', label: 'Select shape' },
        {
          value: "cylinder",
          label: "Cylinder",
          selected: configState.eoat.data.shape === "cylinder",
        },
        {
          value: "cube",
          label: "Cube",
          selected: configState.eoat.data.shape === "cube",
        },
      ],
    },
    {
      type: "dynamic",
    },
  ],

  // Dynamic fields based on shape selection
  dynamicFields: (shape) => {
    if (shape === "cylinder") {
      return [
        {
          type: "number",
          id: "radius",
          label: "Radius (mm)",
          placeholder: "Enter radius",
          value: configState.eoat.data.radius || 0,
          required: true,
          step: "0.1",
        },
        {
          type: "number",
          id: "height",
          label: "Height (mm)",
          placeholder: "Enter height",
          value: configState.eoat.data.height || 0,
          required: true,
          step: "0.1",
        },
      ];
    } else if (shape === "cube") {
      return [
        {
          type: "number",
          id: "length",
          label: "Length (mm)",
          placeholder: "Enter length",
          value: configState.eoat.data.length || 0,
          required: true,
          step: "0.1",
        },
        {
          type: "number",
          id: "width",
          label: "Width (mm)",
          placeholder: "Enter width",
          value: configState.eoat.data.width || 0,
          required: true,
          step: "0.1",
        },
        {
          type: "number",
          id: "height",
          label: "Height (mm)",
          placeholder: "Enter height",
          value: configState.eoat.data.height || 0,
          required: true,
          step: "0.1",
        },
      ];
    }
    return [];
  },

  validate: (data) => {
    if (!validateRequired(data.shape)) {
      alert("❌ Tool shape is required");
      return false;
    }

    if (data.shape === "cylinder") {
      if (!validatePositiveNumber(data.radius)) {
        alert("❌ Radius must be a positive number");
        return false;
      }
      if (!validatePositiveNumber(data.height)) {
        alert("❌ Height must be a positive number");
        return false;
      }
    } else if (data.shape === "cube") {
      if (!validatePositiveNumber(data.length)) {
        alert("❌ Length must be a positive number");
        return false;
      }
      if (!validatePositiveNumber(data.width)) {
        alert("❌ Width must be a positive number");
        return false;
      }
      if (!validatePositiveNumber(data.height)) {
        alert("❌ Height must be a positive number");
        return false;
      }
    }

    return true;
  },
};

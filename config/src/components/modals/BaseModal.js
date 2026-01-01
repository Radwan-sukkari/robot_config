import { saveConfig } from "../../state/configState.js";

// 🏗️ Base Modal Class
export class BaseModal {
  constructor(config) {
    this.id = config.id;
    this.title = config.title;
    this.fields = config.fields;
    //المكان الذي ستُخزن فيه بيانات هذه النافذة داخل الـ State الخاص بالتطبيق
    this.stateKey = config.stateKey;
    this.validate = config.validate;
    this.onSave = config.onSave;
    this.dynamicFields = config.dynamicFields;
  }

  create() {
    const modal = document.createElement("div");
    modal.id = `${this.id}-modal`;
    modal.className =
      "fixed inset-0 bg-black/70 hidden items-center justify-center z-50";

    modal.innerHTML = /*html*/ `
      <div class="modal-content bg-[#1a1a1a] rounded-lg w-[450px] max-h-[90vh] overflow-y-auto shadow-2xl">
        <!-- Header -->
        <div class="bg-primary text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h2 class="text-xl font-bold uppercase tracking-wide">${
            this.title
          }</h2>
          <button class="text-white hover:text-gray-300 text-2xl" id="${
            this.id
          }-close-x">&times;</button>
        </div>
        
        <!-- Content -->
        <div class="p-6 space-y-4" id="${this.id}-content">
          ${this.renderFields()}
        </div>
        
        <!-- Footer -->
        <div class="px-6 py-4 bg-[#1a1a1a] flex justify-end gap-3 border-t border-gray-700 rounded-b-lg">
          <button 
            id="${this.id}-cancel-btn"
            class="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-all font-medium"
          >
            Cancel
          </button>
          <button 
            id="${this.id}-ok-btn"
            class="px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-all font-medium"
          >
            OK
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.attachEvents(modal);

    return modal;
  }

  renderFields() {
    return this.fields.map((field) => this.renderField(field)).join("");
  }

  renderField(field) {
    // نستخدم switch لفحص "نوع" الحقل المرسل (field.type) وبناء الـ HTML المناسب له
    switch (field.type) {
      // في حال كان النوع نص (text) أو رقم (number)
      case "text":
      case "number":
        // استدعاء دالة رسم مربعات الإدخال العادية
        return this.renderInput(field);
      // في حال كان النوع قائمة منسدلة (select)
      case "select":
        // استدعاء دالة رسم القائمة التي تحتوي على خيارات متعددة
        return this.renderSelect(field);
      // في حال كان النوع شبكة (grid) - مثل وضع 3 مربعات أرقام بجانب بعضها
      case "grid":
        // استدعاء دالة رسم الحقول الموزعة على أعمدة
        return this.renderGrid(field);
      // في حال كان النوع ملف (file) لرفع الصور أو المستندات
      case "file":
        // استدعاء دالة رسم واجهة اختيار الملفات (الزر والمربع النصي)
        return this.renderFileInput(field);

      // في حال كان النوع "ديناميكي" (dynamic)
      case "dynamic":
        // هنا لا نرسم حقولاً فوراً، بل نضع "وعاء فارغ" (Container)
        // لنتمكن من حقن بيانات فيه لاحقاً عبر البرمجة بناءً على اختيار المستخدم
        return `<div id="${this.id}-dynamic-container"></div>`;
      // إذا كان النوع غير معروف أو غير مدعوم
      default:
        // نرجع نصاً فارغاً حتى لا يظهر خطأ في الواجهة
        return "";
    }
  }

  renderInput(field) {
    return /*html*/ `
      <div>
        <label class="block text-white text-sm font-medium mb-2">
          ${field.label}
          ${field.required ? '<span class="text-red-500">*</span>' : ""}
        </label>
        <input 
          type="${field.type}" 
          id="${this.id}-${field.id}"
          class="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          placeholder="${field.placeholder || ""}"
          value="${field.value || ""}"
          ${field.required ? "required" : ""}
          ${field.step ? `step="${field.step}"` : ""}
        />
      </div>
    `;
  }

  renderSelect(field) {
    const options = field.options
      .map(
        (opt) =>
          `<option value="${opt.value}" ${opt.selected ? "selected" : ""}>${
            opt.label
          }</option>`
      )
      .join("");

    return /*html*/ `
      <div>
        <label class="block text-white text-sm font-medium mb-2">
          ${field.label}
          ${field.required ? '<span class="text-red-500">*</span>' : ""}
        </label>
        <select 
          id="${this.id}-${field.id}"
          class="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          ${field.required ? "required" : ""}
        >
          ${options}
        </select>
      </div>
    `;
  }

  renderGrid(field) {
    const inputs = field.inputs
      .map(
        (input) =>
          `<div>
        <label class="block text-gray-400 text-xs mb-1 text-center">${
          input.placeholder
        }</label>
        <input 
          type="number" 
          id="${this.id}-${input.id}"
          class="w-full bg-[#2a2a2a] text-white px-2 py-2 rounded border border-gray-600 text-center focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          placeholder="${input.placeholder}"
          value="${input.value || 0}"
          step="${input.step || "0.1"}"
        />
      </div>`
      )
      .join("");

    return /*html*/ `
      <div>
        <label class="block text-white text-sm font-medium mb-2">${
          field.label
        }</label>
        <div class="grid grid-cols-${field.columns || 3} gap-3">
          ${inputs}
        </div>
      </div>
    `;
  }

  renderFileInput(field) {
    return /*html*/ `
      <div>
        <label class="block text-white text-sm font-medium mb-2">
          ${field.label}
          ${field.required ? '<span class="text-red-500">*</span>' : ""}
        </label>
        <div class="flex gap-2">
          <input 
            type="text" 
            id="${this.id}-${field.id}-display"
            class="flex-1 bg-[#2a2a2a] text-white px-3 py-2 rounded border border-gray-600 outline-none"
            placeholder="${field.placeholder || "No file selected"}"
            value="${field.value || ""}"
            readonly
          />
          <button
            type="button"
            id="${this.id}-${field.id}-btn"
            class="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-all"
          >
            Browse
          </button>
        </div>
        <input 
          type="file" 
          id="${this.id}-${field.id}"
          class="hidden"
          accept="${field.accept || "*"}"
        />
        <p class="text-gray-400 text-xs mt-1">${field.hint || ""}</p>
      </div>
    `;
  }

  attachEvents(modal) {
    const cancelBtn = modal.querySelector(`#${this.id}-cancel-btn`);
    const okBtn = modal.querySelector(`#${this.id}-ok-btn`);
    const closeX = modal.querySelector(`#${this.id}-close-x`);

    cancelBtn.addEventListener("click", () => this.close());
    okBtn.addEventListener("click", () => this.save());
    closeX.addEventListener("click", () => this.close());

    // Close on backdrop click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) this.close();
    });

    // Handle file inputs
    this.fields.forEach((field) => {
      if (field.type === "file") {
        const fileInput = modal.querySelector(`#${this.id}-${field.id}`);
        const displayInput = modal.querySelector(
          `#${this.id}-${field.id}-display`
        );
        const browseBtn = modal.querySelector(`#${this.id}-${field.id}-btn`);

        browseBtn.addEventListener("click", () => fileInput.click());
        fileInput.addEventListener("change", (e) => {
          if (e.target.files[0]) {
            displayInput.value = e.target.files[0].name;
          }
        });
      }

      // Handle dynamic fields (like EOAT shape selection)
      if (field.onChange && this.dynamicFields) {
        const element = modal.querySelector(`#${this.id}-${field.id}`);
        element.addEventListener("change", (e) => {
          this.updateDynamicFields(e.target.value);
        });
      }
    });

    // Initialize dynamic fields if exist
    if (this.dynamicFields) {
      const shapeSelect = modal.querySelector(`#${this.id}-shape`);
      if (shapeSelect && shapeSelect.value) {
        this.updateDynamicFields(shapeSelect.value);
      }
    }
  }

  updateDynamicFields(value) {
    if (!this.dynamicFields) return;

    const container = document.getElementById(`${this.id}-dynamic-container`);
    if (!container) return;

    const dynamicFields = this.dynamicFields(value);
    container.innerHTML = dynamicFields
      .map((field) => this.renderField(field))
      .join("");
  }

  save() {
    console.log("OK Clicked");
    const data = this.collectData();

    // Validation
    if (this.validate && !this.validate(data)) {
      alert("❌ Please fill all required fields correctly!");
      return;
    }

    // Save to state
    saveConfig(this.stateKey, data);

    // Custom save callback
    if (this.onSave) {
      this.onSave(data);
    }

    this.close();
  }

  collectData() {
    const data = {};

    this.fields.forEach((field) => {
      if (field.type === "grid") {
        const gridData = {};
        field.inputs.forEach((input) => {
          const element = document.getElementById(`${this.id}-${input.id}`);
          gridData[input.id.split("-").pop()] = parseFloat(element.value) || 0;
        });
        data[field.id] = gridData;
      } else if (field.type === "file") {
        const fileInput = document.getElementById(`${this.id}-${field.id}`);
        const displayInput = document.getElementById(
          `${this.id}-${field.id}-display`
        );
        data[field.id] = displayInput.value || "";
      } else if (field.type === "dynamic") {
        // Skip, will be collected from dynamic fields
      } else {
        const element = document.getElementById(`${this.id}-${field.id}`);
        if (element) {
          data[field.id] =
            field.type === "number"
              ? parseFloat(element.value) || 0
              : element.value;
        }
      }
    });

    // Collect dynamic fields
    if (this.dynamicFields) {
      const shapeSelect = document.getElementById(`${this.id}-shape`);
      if (shapeSelect) {
        const shape = shapeSelect.value;
        const dynamicFields = this.dynamicFields(shape);

        dynamicFields.forEach((field) => {
          const element = document.getElementById(`${this.id}-${field.id}`);
          if (element) {
            data[field.id] =
              field.type === "number"
                ? parseFloat(element.value) || 0
                : element.value;
          }
        });
      }
    }

    return data;
  }

  open() {
    const modal = document.getElementById(`${this.id}-modal`);
    if (modal) {
      modal.classList.remove("hidden");
      modal.classList.add("flex");

      // Re-render dynamic fields if needed
      if (this.dynamicFields) {
        const shapeSelect = modal.querySelector(`#${this.id}-shape`);
        if (shapeSelect && shapeSelect.value) {
          this.updateDynamicFields(shapeSelect.value);
        }
      }
    }
  }

  close() {
    const modal = document.getElementById(`${this.id}-modal`);
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  }
}

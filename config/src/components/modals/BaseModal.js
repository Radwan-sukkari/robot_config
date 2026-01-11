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
    // جعلنا الـ Overlay (الخلفية خلف المودال) أفتح قليلاً لإبراز التصميم الجديد
    modal.className =
      "fixed inset-0 bg-gray-900/50 hidden items-center justify-center z-50 backdrop-blur-sm";

    modal.innerHTML = /*html*/ `
      <div class="modal-content bg-white rounded-xl w-[480px] max-h-[90vh] overflow-hidden shadow-2xl border border-gray-100">
        <div class="bg-primary text-white px-6 py-5 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <h2 class="text-lg font-semibold tracking-tight">${this.title}</h2>
          </div>
          <button class="text-white/80 hover:text-white transition-colors text-3xl leading-none" id="${
            this.id
          }-close-x">&times;</button>
        </div>
        
        <div class="p-6 space-y-5 overflow-y-auto max-h-[60vh] custom-scrollbar" id="${
          this.id
        }-content">
          ${this.renderFields()}
        </div>
        
        <div class="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
          <button 
            id="${this.id}-cancel-btn"
            class="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm"
          >
            Cancel
          </button>
          <button 
            id="${this.id}-ok-btn"
            class="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark shadow-md shadow-primary/20 transition-all font-medium text-sm"
          >
            Save Configuration
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
      <div class="space-y-1.5">
        <label class="block text-gray-700 text-sm font-semibold ml-0.5">
          ${field.label}
          ${field.required ? '<span class="text-error ml-1">*</span>' : ""}
        </label>
        
        <input 
          type="${field.type}" 
          id="${this.id}-${field.id}"
          class="w-full bg-gray-50 text-gray-900 px-4 py-2.5 rounded-lg border border-gray-200 
          
                 placeholder:text-gray-400
                 hover:bg-gray-100 hover:border-gray-300
                 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 
                 outline-none transition-all duration-200 shadow-inner"
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
          `<option value="${opt.value}" ${
            opt.selected ? "selected" : ""
          } class="text-gray-900">
          ${opt.label}
        </option>`
      )
      .join("");

    return /*html*/ `
    <div class="space-y-1.5">
      <label class="block text-gray-700 text-sm font-semibold ml-0.5">
        ${field.label}
        ${field.required ? '<span class="text-error ml-1">*</span>' : ""}
      </label>
      
      <div class="relative">
        <select 
          id="${this.id}-${field.id}"
          class="w-full bg-gray-50 text-gray-900 px-4 py-2.5 rounded-lg border border-gray-200 
                 appearance-none hover:bg-gray-100 hover:border-gray-300
                 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 
                 outline-none transition-all duration-200 cursor-pointer shadow-inner"
          ${field.required ? "required" : ""}
        >
          ${options}
        </select>
        
        <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>
  `;
  }
  renderGrid(field) {
    const inputs = field.inputs
      .map(
        (input) =>
          `<div>
        <label class="block text-gray-500 text-[10px] uppercase font-bold mb-1 text-center tracking-wider">
          ${input.placeholder}
        </label>
        <input 
          type="number" 
          id="${this.id}-${input.id}"
          class="w-full bg-gray-50 text-gray-900 px-2 py-2 rounded-lg border border-gray-200 
                 text-center font-mono text-sm
                 hover:bg-gray-100 hover:border-gray-300
                 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 
                 outline-none transition-all duration-200 shadow-inner"
          placeholder="${input.placeholder}"
          value="${input.value || 0}"
          step="${input.step || "0.1"}"
        />
      </div>`
      )
      .join("");

    return /*html*/ `
      <div class="py-2">
        <label class="block text-gray-700 text-sm font-semibold mb-3 ml-0.5">${
          field.label
        }</label>
        
        <div class="grid grid-cols-${
          field.columns || 3
        } gap-3 bg-gray-50/50 p-3 rounded-xl border border-dashed border-gray-200">
          ${inputs}
        </div>
      </div>
    `;
  }

  renderFileInput(field) {
    return /*html*/ `
      <div class="space-y-1.5">
        <label class="block text-gray-700 text-sm font-semibold ml-0.5">
          ${field.label}
          ${field.required ? '<span class="text-error ml-1">*</span>' : ""}
        </label>
        
        <div class="flex gap-2">
          <input 
            type="text" 
            id="${this.id}-${field.id}-display"
            class="flex-1 bg-gray-50 text-gray-800 px-3 py-2 rounded-lg border border-gray-200 outline-none text-sm shadow-inner"
            placeholder="${field.placeholder || "No file selected"}"
            value="${field.value || ""}"
            readonly
          />
          <button
            type="button"
            id="${this.id}-${field.id}-btn"
            class="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all shadow-md shadow-primary/20 text-sm font-medium whitespace-nowrap"
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
        
        ${
          field.hint
            ? `<p class="text-gray-400 text-[11px] mt-1 ml-1">ℹ️ ${field.hint}</p>`
            : ""
        }
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

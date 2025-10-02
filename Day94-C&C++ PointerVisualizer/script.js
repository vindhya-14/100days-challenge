// Data structures to hold our variables, pointers, and references
let variables = {};
let pointers = {};
let references = {};
let memoryBlocks = {};
let nextStackAddress = 0x1000;
let nextHeapAddress = 0x5000;

// DOM elements
const varTypeSelect = document.getElementById("varType");
const varNameInput = document.getElementById("varName");
const varValueInput = document.getElementById("varValue");
const pointerVarSelect = document.getElementById("pointerVar");
const pointerNameInput = document.getElementById("pointerName");
const refVarSelect = document.getElementById("refVar");
const refNameInput = document.getElementById("refName");
const createVarBtn = document.getElementById("createVarBtn");
const createHeapVarBtn = document.getElementById("createHeapVarBtn");
const createPtrBtn = document.getElementById("createPtrBtn");
const derefPtrBtn = document.getElementById("derefPtrBtn");
const createRefBtn = document.getElementById("createRefBtn");
const freeHeapBtn = document.getElementById("freeHeapBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const copyCodeBtn = document.getElementById("copyCodeBtn");
const stackMemoryDiv = document.getElementById("stackMemory");
const heapMemoryDiv = document.getElementById("heapMemory");
const codeOutput = document.getElementById("codeOutput");
const explanationText = document.getElementById("explanationText");

// Initialize the application
function init() {
  createVarBtn.addEventListener("click", () => createVariable("stack"));
  createHeapVarBtn.addEventListener("click", () => createVariable("heap"));
  createPtrBtn.addEventListener("click", createPointer);
  derefPtrBtn.addEventListener("click", dereferencePointer);
  createRefBtn.addEventListener("click", createReference);
  freeHeapBtn.addEventListener("click", freeHeapMemory);
  clearAllBtn.addEventListener("click", clearAll);
  copyCodeBtn.addEventListener("click", copyCodeToClipboard);

  updatePointerSelects();
  updateCodePreview();

  // Add some example variables to start with
  setTimeout(() => {
    createExample();
  }, 1000);
}

// Generate a memory address
function generateAddress(memoryType) {
  if (memoryType === "heap") {
    const address = `0x${nextHeapAddress.toString(16).toUpperCase()}`;
    nextHeapAddress += 4;
    return address;
  } else {
    const address = `0x${nextStackAddress.toString(16).toUpperCase()}`;
    nextStackAddress += 4;
    return address;
  }
}

// Create a new variable
function createVariable(memoryType) {
  const type = varTypeSelect.value;
  const name = varNameInput.value.trim();
  let value = varValueInput.value.trim();

  if (!name) {
    showNotification("Please enter a variable name", "error");
    return;
  }

  if (variables[name] || pointers[name] || references[name]) {
    showNotification(`Name '${name}' is already in use`, "error");
    return;
  }

  // Validate value based on type
  let validatedValue = validateValue(type, value);
  if (validatedValue === null) return;

  const address = generateAddress(memoryType);

  // Store the variable
  variables[name] = {
    type: type,
    value: validatedValue,
    address: address,
    memoryType: memoryType,
    isPointer: false,
    isReference: false,
  };

  // Create memory block
  createMemoryBlock(
    name,
    type,
    validatedValue,
    address,
    memoryType,
    "variable"
  );

  // Update UI
  updatePointerSelects();
  updateCodePreview();
  updateExplanation(
    `Created ${memoryType} variable '${name}' of type ${type} with value ${validatedValue} at address ${address}`
  );

  // Clear inputs
  varNameInput.value = "";
  varValueInput.value = "";

  showNotification(`Created ${memoryType} variable '${name}'`, "success");
}

// Validate value based on type
function validateValue(type, value) {
  if (!value) {
    // Set default values if empty
    switch (type) {
      case "int":
        return "0";
      case "float":
        return "0.0f";
      case "double":
        return "0.0";
      case "char":
        return "' '";
      case "string":
        return '""';
    }
  }

  try {
    switch (type) {
      case "int":
        if (isNaN(parseInt(value))) {
          showNotification("Please enter a valid integer value", "error");
          return null;
        }
        return parseInt(value).toString();
      case "float":
        if (isNaN(parseFloat(value))) {
          showNotification("Please enter a valid float value", "error");
          return null;
        }
        return parseFloat(value).toString() + "f";
      case "double":
        if (isNaN(parseFloat(value))) {
          showNotification("Please enter a valid double value", "error");
          return null;
        }
        return parseFloat(value).toString();
      case "char":
        if (
          value.length > 1 &&
          !(value.startsWith("'") && value.endsWith("'"))
        ) {
          showNotification(
            "Please enter a valid char value (e.g., 'A')",
            "error"
          );
          return null;
        }
        if (value.length === 1) return `'${value}'`;
        return value;
      case "string":
        if (!value.startsWith('"') && !value.endsWith('"')) {
          return `"${value}"`;
        }
        return value;
    }
  } catch (error) {
    showNotification("Invalid value for the selected type", "error");
    return null;
  }

  return value;
}

// Create a pointer to a variable
function createPointer() {
  const varName = pointerVarSelect.value;
  const ptrName = pointerNameInput.value.trim();

  if (!varName) {
    showNotification("Please select a variable to point to", "error");
    return;
  }

  if (!ptrName) {
    showNotification("Please enter a pointer name", "error");
    return;
  }

  if (pointers[ptrName] || variables[ptrName] || references[ptrName]) {
    showNotification(`Name '${ptrName}' is already in use`, "error");
    return;
  }

  const varData = variables[varName];
  const ptrAddress = generateAddress("stack");

  // Store the pointer
  pointers[ptrName] = {
    pointsTo: varName,
    address: ptrAddress,
    type: varData.type + "*",
    memoryType: "stack",
  };

  // Create memory block for the pointer
  createMemoryBlock(
    ptrName,
    varData.type + "*",
    varData.address,
    ptrAddress,
    "stack",
    "pointer"
  );

  // Update UI
  updatePointerSelects();
  updateCodePreview();
  updateExplanation(
    `Created pointer '${ptrName}' pointing to '${varName}' at address ${varData.address}. The pointer itself is stored at address ${ptrAddress}.`
  );

  // Clear inputs
  pointerNameInput.value = "";

  showNotification(`Created pointer '${ptrName}'`, "success");
}

// Create a reference to a variable
function createReference() {
  const varName = refVarSelect.value;
  const refName = refNameInput.value.trim();

  if (!varName) {
    showNotification("Please select a variable to reference", "error");
    return;
  }

  if (!refName) {
    showNotification("Please enter a reference name", "error");
    return;
  }

  if (references[refName] || variables[refName] || pointers[refName]) {
    showNotification(`Name '${refName}' is already in use`, "error");
    return;
  }

  const varData = variables[varName];

  // Store the reference
  references[refName] = {
    refersTo: varName,
    type: varData.type + "&",
    memoryType: varData.memoryType,
  };

  // Create memory block for the reference (shares address with the variable)
  createMemoryBlock(
    refName,
    varData.type + "&",
    varData.value,
    varData.address,
    varData.memoryType,
    "reference"
  );

  // Update UI
  updatePointerSelects();
  updateCodePreview();
  updateExplanation(
    `Created reference '${refName}' as an alias for '${varName}'. Both refer to the same memory location at address ${varData.address}.`
  );

  // Clear inputs
  refNameInput.value = "";

  showNotification(`Created reference '${refName}'`, "success");
}

// Dereference a pointer
function dereferencePointer() {
  const pointersList = Object.keys(pointers);
  if (pointersList.length === 0) {
    showNotification("No pointers available to dereference", "error");
    return;
  }

  // For simplicity, we'll dereference the first pointer
  const ptrName = pointersList[0];
  const ptr = pointers[ptrName];
  const varData = variables[ptr.pointsTo];

  updateExplanation(
    `Dereferencing pointer '${ptrName}' gives value ${varData.value} from address ${varData.address}`
  );

  // Highlight the value in the memory visualization
  highlightMemoryBlock(ptr.pointsTo);
  highlightMemoryBlock(ptrName);

  showNotification(
    `Dereferenced pointer '${ptrName}' → ${varData.value}`,
    "info"
  );
}

// Free heap memory
function freeHeapMemory() {
  const heapVariables = Object.keys(variables).filter(
    (name) => variables[name].memoryType === "heap"
  );

  if (heapVariables.length === 0) {
    showNotification("No heap variables to free", "warning");
    return;
  }

  heapVariables.forEach((name) => {
    // Mark as freed but keep for demonstration
    variables[name].freed = true;
    const block = document.getElementById(`block-${name}`);
    if (block) {
      block.classList.add("freed-memory");
    }
  });

  updateExplanation(
    `Freed ${heapVariables.length} heap variable(s). Note: In real C++, you would use 'delete' for each allocation.`
  );
  updateCodePreview();

  showNotification(`Freed ${heapVariables.length} heap variable(s)`, "info");
}

// Clear all memory
function clearAll() {
  if (
    Object.keys(variables).length === 0 &&
    Object.keys(pointers).length === 0 &&
    Object.keys(references).length === 0
  ) {
    showNotification("Nothing to clear", "warning");
    return;
  }

  if (
    !confirm(
      "Are you sure you want to clear all variables, pointers, and references?"
    )
  ) {
    return;
  }

  variables = {};
  pointers = {};
  references = {};
  memoryBlocks = {};
  nextStackAddress = 0x1000;
  nextHeapAddress = 0x5000;

  stackMemoryDiv.innerHTML = "";
  heapMemoryDiv.innerHTML = "";
  updatePointerSelects();
  updateCodePreview();
  updateExplanation(
    "Cleared all variables, pointers, and references. Memory has been reset."
  );

  showNotification("Cleared all memory", "info");
}

// Create a visual memory block
function createMemoryBlock(name, type, value, address, memoryType, blockType) {
  const memoryContainer =
    memoryType === "stack" ? stackMemoryDiv : heapMemoryDiv;

  const block = document.createElement("div");
  block.className = `memory-block ${blockType} ${memoryType}`;
  block.id = `block-${name}`;
  block.dataset.name = name;
  block.dataset.type = blockType;

  block.innerHTML = `
        <div class="memory-address">${address}</div>
        <div class="memory-value">${value}</div>
        <div class="variable-name">${name}</div>
        <div class="variable-type">${type}</div>
        ${blockType === "pointer" ? '<div class="pointer-arrow">↓</div>' : ""}
    `;

  // Add click event for pointers to show what they point to
  if (blockType === "pointer") {
    block.addEventListener("click", () => {
      const ptr = pointers[name];
      if (ptr) {
        highlightMemoryBlock(ptr.pointsTo);
        updateExplanation(
          `Pointer '${name}' points to '${ptr.pointsTo}' at address ${
            variables[ptr.pointsTo].address
          }`
        );
      }
    });
  }

  memoryContainer.appendChild(block);
  memoryBlocks[name] = block;

  // Add animation
  block.style.animation = "fadeIn 0.5s ease";
}

// Highlight a memory block
function highlightMemoryBlock(name) {
  // Remove highlights from all blocks
  Object.values(memoryBlocks).forEach((block) => {
    block.style.boxShadow = "none";
    block.classList.remove("highlight");
  });

  // Highlight the specified block
  const block = memoryBlocks[name];
  if (block) {
    block.classList.add("highlight");
    block.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

// Update the pointer/reference select dropdowns
function updatePointerSelects() {
  const varNames = Object.keys(variables);

  // Clear and repopulate pointerVarSelect
  pointerVarSelect.innerHTML =
    '<option value="">-- Select a variable --</option>';
  varNames.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = `${name} (${variables[name].type})`;
    pointerVarSelect.appendChild(option);
  });

  // Clear and repopulate refVarSelect
  refVarSelect.innerHTML = '<option value="">-- Select a variable --</option>';
  varNames.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = `${name} (${variables[name].type})`;
    refVarSelect.appendChild(option);
  });
}

// Update the code preview
function updateCodePreview() {
  let code = "// C++ Code Representation\n\n";

  // Add variable declarations
  const stackVars = Object.keys(variables).filter(
    (name) => variables[name].memoryType === "stack" && !variables[name].freed
  );
  const heapVars = Object.keys(variables).filter(
    (name) => variables[name].memoryType === "heap" && !variables[name].freed
  );

  if (stackVars.length > 0) {
    code += "// Stack variables\n";
    stackVars.forEach((name) => {
      const varData = variables[name];
      code += `${varData.type} ${name} = ${varData.value};\n`;
    });
    code += "\n";
  }

  if (heapVars.length > 0) {
    code += "// Heap variables (dynamic allocation)\n";
    heapVars.forEach((name) => {
      const varData = variables[name];
      code += `${varData.type}* ${name} = new ${
        varData.type
      }(${varData.value.replace(/f$/, "")});\n`;
    });
    code += "\n";
  }

  // Add pointer declarations
  const ptrNames = Object.keys(pointers);
  if (ptrNames.length > 0) {
    code += "// Pointers\n";
    ptrNames.forEach((name) => {
      const ptrData = pointers[name];
      code += `${ptrData.type} ${name} = &${ptrData.pointsTo};\n`;
    });
    code += "\n";
  }

  // Add reference declarations
  const refNames = Object.keys(references);
  if (refNames.length > 0) {
    code += "// References\n";
    refNames.forEach((name) => {
      const refData = references[name];
      code += `${refData.type} ${name} = ${refData.refersTo};\n`;
    });
    code += "\n";
  }

  // Add memory management for heap variables
  const freedVars = Object.keys(variables).filter(
    (name) => variables[name].memoryType === "heap" && variables[name].freed
  );
  if (freedVars.length > 0) {
    code += "// Memory cleanup (for heap variables)\n";
    freedVars.forEach((name) => {
      code += `// delete ${name};  // Memory was freed\n`;
    });
  }

  codeOutput.textContent = code || "// Create variables to see code here";
}

// Update the explanation text
function updateExplanation(text) {
  explanationText.innerHTML = `<p>${text}</p>`;
}

// Show notification
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notification) => notification.remove());

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;

  switch (type) {
    case "success":
      notification.style.background = "var(--success-color)";
      break;
    case "error":
      notification.style.background = "var(--danger-color)";
      break;
    case "warning":
      notification.style.background = "var(--warning-color)";
      break;
    default:
      notification.style.background = "var(--primary-color)";
  }

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Copy code to clipboard
function copyCodeToClipboard() {
  const code = codeOutput.textContent;
  navigator.clipboard
    .writeText(code)
    .then(() => {
      showNotification("Code copied to clipboard!", "success");
    })
    .catch(() => {
      showNotification("Failed to copy code", "error");
    });
}

// Create example variables for demonstration
function createExample() {
  // Create some example variables
  const examples = [
    { type: "int", name: "x", value: "42" },
    { type: "float", name: "y", value: "3.14" },
    { type: "char", name: "c", value: "'A'" },
  ];

  examples.forEach((example) => {
    variables[example.name] = {
      type: example.type,
      value: example.value,
      address: generateAddress("stack"),
      memoryType: "stack",
      isPointer: false,
      isReference: false,
    };

    createMemoryBlock(
      example.name,
      example.type,
      example.value,
      variables[example.name].address,
      "stack",
      "variable"
    );
  });

  updatePointerSelects();
  updateCodePreview();
  updateExplanation(
    "Welcome! Example variables created. Try creating pointers, references, or heap variables to see how they work in memory."
  );
}

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }
`;
document.head.appendChild(style);

// Initialize the application when the page loads
document.addEventListener("DOMContentLoaded", init);

// @ts-nocheck
export const generateCodeFile = (variables, functions) => {
    let stringCount = 0;
    let mappingCount = 0;
    let vectorCount = 0;
    for (let index = 0; index < variables.length; index++) {
        const variable = variables[index];
        if (variable.isMapping) mappingCount++;
        if (variable.isVector) vectorCount++;
        if (variable.type == "String") stringCount++;
    }

    let code = `#![cfg_attr(not(feature = "std"), no_std, no_main)]\n\n`;
    code += `#[ink::contract]\n`;
    code += `mod test {\n`;
    if (vectorCount != 0 || stringCount != 0) {
        code += `use ink::prelude::{`;
        if (stringCount != 0) code += `string::String`;
        if (vectorCount != 0 && stringCount != 0) code += `, `; 
        if (vectorCount != 0) code += `vec::Vec}`;
        code += `;\n`;
    }
    if (mappingCount != 0) code += `use ink::storage::Mapping;\n`;
    code+= `\n`;
    code += `    #[ink(storage)]\n`;
    code += `    pub struct Test {\n`;

    variables.forEach((variable) => {
      code += `        ${variable.name}: `;
      if (variable.isMapping) {
        if (variable.isVector) {
            code += `Mapping<${variable.type}, ink_prelude::vec::Vec<${variable.mappingTo}>>,\n`;
        } else {
        code += `Mapping<${variable.type}, ${variable.mappingTo}>,\n`;
        }
      } else {
        if (variable.isVector) {
            code += `Vec<${variable.type}>,\n`;
        } else {
        code += `${variable.type},\n`;
        }
      }
    });

    code += `    }\n\n`;
    code += `    impl Test {\n`;
    code += `        #[ink(constructor)]\n`;
    code += `        pub fn new(`;

    let withoutDefaultValueCount = 0;
    variables.forEach((variable, index) => {
      if (variable.defaultValue == '' && !variable.isMapping && !variable.isVector) {
        code += `${variable.name}: ${variable.type}, `;
        withoutDefaultValueCount++;
      }
    });

    if (variables.length != 0 && withoutDefaultValueCount != 0) code = code.slice(0, -2); 

    code += `) -> Self {\n`;
    code += `            Self {\n`;

    variables.forEach(variable => {
    if (variable.isMapping) {
        code += `                ${variable.name}: Mapping::new(),\n`;
    } else if (variable.isVector) {
        code += `                ${variable.name}: Vec::new(),\n`;
    } else {
      if (variable.defaultValue != '') {
        if(variable.type == "String") {
            code += `                ${variable.name}: `;
            code += `String::from(\n`;
            code += `                "`;
            code += `${variable.defaultValue}",\n`;
            code += `                ),\n`;
        } else {
        code += `                ${variable.name}: ${variable.defaultValue},\n`;
        }
      }
      if (variable.defaultValue == '') code += `                ${variable.name}: ${variable.name},\n`;
    }
    });

    code += `            }\n`;
    code += `        }\n`;

    variables.forEach(variable => {
        if (variable.getter) {
          code += `\n        #[ink(message)]\n`;
          code += `        pub fn ${variable.name}(&self`;
          if (variable.isMapping) code += `, id: ${variable.type}`;
          code += `) -> `;
          if (variable.isMapping) code += `Option<`;
          if (variable.isVector) code += `Vec<`;
          if (!variable.isMapping) code += `${variable.type}`;
          if (variable.isMapping) code += `${variable.mappingTo}`;
          if (variable.isVector) code += `>`;
          if (variable.isMapping) code += `>`;
          code += ` {\n`;
          code += `            self.${variable.name}`;
          if (variable.isMapping) code += `.get(&id)`;
          if ((variable.type == "String") || (!variable.isMapping && variable.isVector)) code += `.clone()`;
          code += `\n        }\n`;
        }
      });

    // Iterate over the functions array
    functions.forEach((func) => {
      console.log(func.nodes.length)
      // Generate code for the function
      code += `\n        #[ink(message)]\n`;
      code += `        pub fn ${func.name}(&self`;
      // Add function parameters, if any
      func.nodes.forEach((param) => {
          if (param.type == "textUpdater" && param.data.variable_type != "" && param.data.variable_type) code += `, ${param.data.label}: ${param.data.variable_type}`;
      });
      // Close the function signature
      code += `) {\n`;
      // Close the function body
      code += `            // Function body goes here\n`;
      code += `        }\n`;
  });

    code += `    }\n`;
    code += `}\n`;

    console.log(code, " -> ");
    return code;
  };
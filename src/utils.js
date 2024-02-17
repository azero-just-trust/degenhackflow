export const generateCodeFile = (variables) => {
    let code = `#![cfg_attr(not(feature = "std"), no_std, no_main)]\n\n`;
    code += `#[ink::contract]\n`;
    code += `mod test {\n`;
    code += `use ink::prelude::{string::String, vec::Vec};\n\n`;
    code += `    #[ink(storage)]\n`;
    code += `    pub struct Test {\n`;

    variables.forEach((variable) => {
      code += `        ${variable.name}: ${variable.type},\n`;
    });

    code += `    }\n\n`;
    code += `    impl Test {\n`;
    code += `        #[ink(constructor)]\n`;
    code += `        pub fn new(`;

    let withoutDefaultValueCount = 0;
    variables.forEach((variable, index) => {
        console.log(variable.defaultValue)
      if (variable.defaultValue == '') {
        code += `${variable.name}: ${variable.type}, `;
        withoutDefaultValueCount++;
      }
    });

    if (variables.length != 0 && withoutDefaultValueCount != 0) code = code.slice(0, -2); 

    code += `) -> Self {\n`;
    code += `            Self {\n`;

    variables.forEach(variable => {
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
    });

    code += `            }\n`;
    code += `        }\n`;

    variables.forEach(variable => {
        if (variable.getter) {
          code += `\n        #[ink(message)]\n`;
          code += `        pub fn ${variable.name}(&self) -> ${variable.type} {\n`;
          code += `            self.${variable.name}`;
          if (variable.type == "String") code += `.clone()`;
          code += `\n        }\n`;
        }
      });

    code += `    }\n`;
    code += `}\n`;

    console.log(code, " -> ");
    return code;
  };
// @ts-nocheck
import React, { useState } from "react";
import { generateCodeFile } from "../utils";

const SideMenu = ({
  apiKey,
  handleApiKeyChange,
  noCodeMode,
  handleToggle,
  variables,
  setVariables,
  newVariable,
  setNewVariable,
  editIndex,
  setEditIndex,
  addFunction,
  removeFunction,
  functions,
  newFunction,
  setNewFunction,
  selectedFunction,
  setSelectedFunction,
  updatePosition
}) => {
  const handleAddVariable = () => {
    const exists = variables.some(
      (variable) => variable.name === newVariable.name
    );
    if (exists) {
      alert("Variable with the same name already exists!");
      return;
    }

    if (newVariable.name && newVariable.type && (!newVariable.isMapping || (newVariable.isMapping && newVariable.mappingTo))) {
      if (editIndex !== -1) {
        const updatedVariables = [...variables];
        updatedVariables[editIndex] = newVariable;
        setVariables(updatedVariables);
        setEditIndex(-1);
      } else {
        setVariables([...variables, newVariable]);
      }
      setNewVariable({ name: "", type: "", defaultValue: "" });
    }
  };

  const handleEditVariable = (index) => {
    setNewVariable(variables[index]);
    setEditIndex(index);
  };

  const handleRemoveVariable = (index) => {
    const updatedVariables = [...variables];
    updatedVariables.splice(index, 1);
    setVariables(updatedVariables);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 w-80 bg-[#2d2d2d] absolute left-0 z-40 border-r border-teal-400 px-4 h-screen overflow-y-scroll">
      <div className="text-gray-200 text-lg font-bold absolute top-2 left-2 px-4 py-2 rounded-lg border border-teal-400">
        <span className="text-teal-400">Azero</span>
        <span className="text-purple-500">Ink</span>
        <span className="text-teal-400">Box</span>
      </div>
      <div className="mt-16 mb-8">
        <label className="flex items-center cursor-pointer">
          <div className="relative ">
            <input
              type="checkbox"
              className="hidden"
              checked={noCodeMode}
              onChange={handleToggle}
            />
            <div className="mx-auto w-full flex flex-row h-16 w-fit absolute">
              {/* <div className="w-10 h-4 bg-teal-400 rounded-full shadow-inner fixed mt-1"></div> */}
              <div
                className={`absolute w-6 h-6 bg-white rounded-full shadow border border-gray-400 mb-4 ${
                  noCodeMode ? "transform translate-x-full bg-green-400" : ""
                }`}
              ></div>
            </div>
          </div>
          <div className="ml-3 mb-8 text-gray-200 font-medium">
            {/* Toggle State: {noCodeMode ? "ON" : "OFF"} */}
            No-Code Mode
          </div>
        </label>
      </div>
      <div className="ml-3 text-gray-200 font-medium">Contract</div>
      <input
        type="text"
        placeholder="Contract Name"
        className="w-full border border-[#343434] rounded-md px-3 py-2 mb-2 bg-[#2d2d2d] "
        value={apiKey}
        onChange={handleApiKeyChange}
      />

      <div className="h-screen w-full py-4 rounded-md">
        <div className="mb-4">
          <h2 className="ml-3 font-medium mb-2">Add New Variable</h2>
          <input
            type="text"
            placeholder="Variable Name"
            className="w-full border border-[#343434] rounded-md px-3 py-2 mb-2 bg-[#2d2d2d]"
            value={newVariable.name}
            onChange={(e) =>
              setNewVariable({ ...newVariable, name: e.target.value })
            }
          />
          <select
            className="w-full border border-[#343434] rounded-md px-3 py-2 mb-2 bg-[#2d2d2d]"
            value={newVariable.type}
            onChange={(e) =>
              setNewVariable({ ...newVariable, type: e.target.value })
            }
          >
            <option value="">Variable Type</option>
            <option value="String">String</option>
            <option value="AccountId">AccountId</option>
            <option value="bool">Boolean</option>
            <option value="u64">u64</option>
            <option value="u128">u128</option>
          </select>
          <input
            type="text"
            placeholder="Default Value"
            className="w-full border border-[#343434] rounded-md px-3 py-2 mb-2 bg-[#2d2d2d]"
            value={newVariable.defaultValue}
            onChange={(e) =>
              setNewVariable({ ...newVariable, defaultValue: e.target.value })
            }
          />
          <select
            className="w-full border border-[#343434] rounded-md px-3 py-2 mb-2 bg-[#2d2d2d]"
            value={newVariable.mappingTo}
            onChange={(e) =>
              setNewVariable({ ...newVariable, mappingTo: e.target.value })
            }
          >
            <option value="">Mapping To Type (if mapping enabled)</option>
            <option value="String">String</option>
            <option value="AccountId">AccountId</option>
            <option value="bool">Boolean</option>
            <option value="u64">u64</option>
            <option value="u128">u128</option>
          </select>
          <div className="mb-2">
            <label className="flex items-center cursor-pointer">
              <div className="relative ">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={newVariable.getter}
                  onChange={(e) =>
                    setNewVariable({ ...newVariable, getter: !newVariable.getter })
                  }
                />
                <div className="mx-auto w-full flex flex-row h-16 w-fit absolute">
                  {/* <div className="w-10 h-4 bg-teal-400 rounded-full shadow-inner fixed mt-1"></div> */}
                  <div
                    className={`absolute w-6 h-6 bg-white rounded-full shadow border border-gray-400 mb-4 ${
                      newVariable.getter ? "transform translate-x-full bg-green-400" : ""
                    }`}
                  ></div>
                </div>
              </div>
              <div className="ml-3 mb-8 text-gray-200 font-medium">
                Add Getter
              </div>
            </label>
      </div>
      <div className="mb-2">
            <label className="flex items-center cursor-pointer">
              <div className="relative ">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={newVariable.isVector}
                  onChange={(e) =>
                    setNewVariable({ ...newVariable, isVector: !newVariable.isVector })
                  }
                />
                <div className="mx-auto w-full flex flex-row h-16 w-fit absolute">
                  {/* <div className="w-10 h-4 bg-teal-400 rounded-full shadow-inner fixed mt-1"></div> */}
                  <div
                    className={`absolute w-6 h-6 bg-white rounded-full shadow border border-gray-400 mb-4 ${
                      newVariable.isVector ? "transform translate-x-full bg-green-400" : ""
                    }`}
                  ></div>
                </div>
              </div>
              <div className="ml-3 mb-8 text-gray-200 font-medium">
                Vector
              </div>
            </label>
      </div>
      <div className="mb-2">
            <label className="flex items-center cursor-pointer">
              <div className="relative ">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={newVariable.isMapping}
                  onChange={(e) =>
                    setNewVariable({ ...newVariable, isMapping: !newVariable.isMapping })
                  }
                />
                <div className="mx-auto w-full flex flex-row h-16 w-fit absolute">
                  {/* <div className="w-10 h-4 bg-teal-400 rounded-full shadow-inner fixed mt-1"></div> */}
                  <div
                    className={`absolute w-6 h-6 bg-white rounded-full shadow border border-gray-400 mb-4 ${
                      newVariable.isMapping ? "transform translate-x-full bg-green-400" : ""
                    }`}
                  ></div>
                </div>
              </div>
              <div className="ml-3 mb-8 text-gray-200 font-medium">
                Mapping
              </div>
            </label>
      </div>
          <button
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md"
            onClick={handleAddVariable}
          >
            Add Variable
          </button>
        </div>

        <div>
          <h2 className="font-medium mb-2">Variable List</h2>
          {variables.map((variable, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <div className="bg-teal-400 hover:bg-teal-600 rounded-md px-2 py-1 text-gray-800 font-semibold text-sm">
                {variable.name}: {variable.defaultValue}
              </div>
              <div>
                <button
                  className="text-teal-400 font-medium mr-2"
                  onClick={async () => {
                    await updatePosition();
                    handleEditVariable(index)
                  }}
                >
                  Edit
                </button>
                <button
                  className="text-purple-300 font-extrabold ml-2"
                  onClick={async () => {
                    await updatePosition();
                    handleRemoveVariable(index)
                  }}
                >
                  X
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <h2 className="font-medium mb-2">Custom Functions</h2>
          </div>
      </div>

      <div>
        <h2>Add New Function</h2>
        <input
          className="w-full border border-[#343434] rounded-md px-3 py-2 mb-2 bg-[#2d2d2d]"
          type="text"
          placeholder="Function Name"
          value={newFunction.name}
          onChange={(e) => { setNewFunction({ ...newFunction, name: e.target.value })}}
        />
        <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md" onClick={async() => {
          await updatePosition();
          addFunction()
        }}>
          Add Function
        </button>
      </div>

      <div>
        <h2>Function List</h2>
        {functions.map((func, index) => (
          <div key={index}>
            <span>{func.name}</span>
            <button onClick={async () => {
              await updatePosition();
              setSelectedFunction(index)
            }}>
              Open
            </button>
            <button onClick={() => removeFunction(index)}>Delete</button>
          </div>
        ))}
      </div>

      <div className="mt-4">
      <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md mr-2" onClick={addFunction}>Compile WASM</button>
      <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md" onClick={addFunction}>Download</button>
      </div>
    </div>
  );
};

export default SideMenu;

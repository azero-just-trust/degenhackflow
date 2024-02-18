// @ts-nocheck
import { useState, useEffect, useCallback } from "react";
import "./index.css";
import MonacoEditor from "react-monaco-editor";
import "./userWorker";
import SideMenu from "./components/SideMenu";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  MiniMap,
  removeElements,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
} from "reactflow";
import Select from "react-select";
import {generateCodeFile} from "./utils.js"
import "reactflow/dist/style.css";

const selectOptions = [
  { value: "new_function", label: "new function" },
  { value: "if", label: "if" },
  { value: "variable_getter", label: "variable getter" },
  { value: "variable_setter", label: "variable setter" },
];

const initNodes = [
  {
    id: "a",
    data: { label: "Node A" },
    position: { x: 250, y: 0 },
  },
  {
    id: "b",
    data: { label: "Node B" },
    position: { x: 100, y: 100 },
  },
  {
    id: "c",
    data: { label: "Node" },
    position: { x: 350, y: 100 },
  },
];

const initEdges = [
  {
    id: "a-b",
    source: "a",
    target: "b",
  },
];

interface Function {
  name: string;
  parameters: string[];
}

function App() {
  const [apiKey, setApiKey] = useState("");
  const [textValue, setTextValue] = useState(``);
  const [noCodeMode, setNoCodeMode] = useState(true);
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
  const [variables, setVariables] = useState([]);
  const [newVariable, setNewVariable] = useState({
    name: "",
    type: "",
    defaultValue: "",
    getter: false,
    isVector: false,
    isMapping: false,
    mappingTo: ""
  });
  const [functions, setFunctions] = useState<Function[]>([]);
  const [newFunction, setNewFunction] = useState<Function>({ name: '', parameters: [], nodes: [], edges: [] });
  const [selectedFunction, setSelectedFunction] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [cargoValue, setCargoValue] = useState(`# Cargo.toml

[package]
name = ${apiKey}
version = "0.1.0"
authors = ["[your_name] <[your_email]>"]
edition = "2021"

[dependencies]
ink = { version = "4.2.0", default-features = false }
ink_prelude = { version = "~4.3.0", default-features = false }

scale = { package = "parity-scale-codec", version = "3", default-features = false, features = ["derive"] }
scale-info = { version = "2.6", default-features = false, features = ["derive"], optional = true }

[dev-dependencies]
ink_e2e = "4.2.0"

[lib]
path = "lib.rs"

[features]
default = ["std"]
std = [
    "ink/std",
    "scale/std",
    "scale-info/std",
]
ink-as-dependency = []
e2e-tests = []

`);

  useEffect(() => {
    setTextValue(
      `/// lib.rs

#![cfg_attr(not(feature = "std"), no_std, no_main)]

    #[ink::contract]
    mod test {
    
        #[ink(storage)]
        pub struct Test {
            value: bool,
        }
    
        impl Test {
            #[ink(constructor)]
            pub fn new(init_value: bool) -> Self {
                Self { value: init_value }
            }
    
            #[ink(constructor)]
            pub fn default() -> Self {
                Self::new(Default::default())
            }
    
            #[ink(message)]
            pub fn flip(&mut self) {
                self.value = !self.value;
            }
    
            #[ink(message)]
            pub fn get(&self) -> bool {
                self.value
            }
        }
    }
    
    `
    );
  }, []);

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
    setCargoValue(`# Cargo.toml

[package]
name = ${apiKey}
version = "0.1.0"
authors = ["[your_name] <[your_email]>"]
edition = "2021"

[dependencies]
ink = { version = "4.2.0", default-features = false }

scale = { package = "parity-scale-codec", version = "3", default-features = false, features = ["derive"] }
scale-info = { version = "2.6", default-features = false, features = ["derive"], optional = true }

[dev-dependencies]
ink_e2e = "4.2.0"

[lib]
path = "lib.rs"

[features]
default = ["std"]
std = [
    "ink/std",
    "scale/std",
    "scale-info/std",
]
ink-as-dependency = []
e2e-tests = []

`);
  };

  const onCodeChange = async (newValue, e) => {
    console.log("onChange", newValue, e);
    setTextValue(newValue);
  };

  const onCargoChange = async (newValue, e) => {
    console.log("onChange", newValue, e);
    setCargoValue(newValue);
  };

  const options = {
    renderSideBySide: false,
    automaticLayout: true,
    minimap: {
      enabled: false,
    },
    fontFamily: "monospace",
    wordWrap: true,
  };

  const addFunction = () => {
    if (newFunction.name != "" && newFunction.name != " " && newFunction.name) {
      let index = functions.length;
      let tempNewFunction = newFunction;
      tempNewFunction.nodes.push({
        id: `${functions.length.toString()}-${tempNewFunction.nodes.length.toString()}`,
        type: 'input',
        data: { label: tempNewFunction.name.toString() },
        position: { x: 200, y: 0 },
      })
      tempNewFunction.nodes.push({
        id: `${functions.length.toString()}-${tempNewFunction.nodes.length.toString()}`,
        data: { label: `Example Step` },
        position: { x: 150, y: 100 },
      })
      tempNewFunction.nodes.push({
        id: `${functions.length.toString()}-${tempNewFunction.nodes.length.toString()}`,
        type: 'output',
        data: { label: `return` },
        position: { x: 250, y: 200 },
      })
      tempNewFunction.edges.push({ id: 'e0-1', source: `${index}-0`, target: `${index}-1`, animated: true })
      tempNewFunction.edges.push({ id: 'e0-2', source: `${index}-1`, target: `${index}-2`, animated: true })
      setFunctions([...functions, newFunction]);
      setNewFunction({ name: '', parameters: [], nodes: [], edges: [] });
      setSelectedFunction(index)
    }
  };

  const removeFunction = (index: number) => {
    const updatedFunctions = [...functions];
    updatedFunctions.splice(index, 1);
    setFunctions(updatedFunctions);
  };

  const handleToggle = () => {
    setNoCodeMode(!noCodeMode);
    setTextValue(generateCodeFile(variables));
  };

  useEffect(() => {
    (async () => {
      console.log(functions[selectedFunction].nodes)
      setNodes(functions[selectedFunction].nodes)
      setEdges(functions[selectedFunction].edges)
    })();
  }, [selectedFunction]);

  const onConnect = useCallback((params) => setEdges(addEdge(params, edges)), [edges]);
  const onNodesDelete = useCallback(
    (deleted) => {
      setEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter((edge) => !connectedEdges.includes(edge));

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({ id: `${source}->${target}`, source, target }))
          );

          return [...remainingEdges, ...createdEdges];
        }, edges)
      );
    },
    [nodes, edges]
  );

  return (
    <div className="w-screen bg-[#2d2d2d] text-gray-200 flex flex-row w-view h-max">
      <SideMenu
        apiKey={apiKey}
        handleApiKeyChange={handleApiKeyChange}
        noCodeMode={noCodeMode}
        handleToggle={handleToggle}
        variables={variables}
        setVariables={setVariables}
        newVariable={newVariable}
        setNewVariable={setNewVariable}
        editIndex={editIndex}
        setEditIndex={setEditIndex}
        addFunction={addFunction}
        removeFunction={removeFunction}
        functions={functions}
        newFunction={newFunction}
        setNewFunction={setNewFunction}
        selectedFunction={selectedFunction}
        setSelectedFunction={setSelectedFunction}
      />
      <div className="flex flex-row gap-y-40 overflow-hidden justify-start items-end self-end text-gray-200 ml-80 mx-4 w-4/5 bg-[#2d2d2d] h-full">
      {!noCodeMode ? (
          <div className="w-full h-screen flex flex-row">
            <div className="w-1/2 h-screen z-50 border-r border-[#343434]">
              <div className="w-full h-8 bg-[#2d2d2d]/60 border-[#343434] border-b-2 text-gray-400 font-medium text-center z-10">
                lib.rs
              </div>
              <MonacoEditor
                language="rust"
                original="..."
                value={textValue}
                options={options}
                theme="vs-dark"
                onChange={onCodeChange}
              />
            </div>
            <div className="w-1/2 h-screen">
              <div className="w-full h-8 bg-[#2d2d2d]/60 border-[#343434] border-b-2 text-gray-400 font-medium text-center z-10">
                Cargo.toml
              </div>
              <MonacoEditor
                language="markdown"
                original="..."
                value={cargoValue}
                options={options}
                theme="vs-dark"
                onChange={onCargoChange}
              />
            </div>
          </div>
        ) : (
          <div style={{ width: "100vw", height: "100vh" }} className="flex">
            <div style={{ width: "90vw", height: "100vh" }}>
              <ReactFlow
                nodes={nodes}
                onNodesChange={onNodesChange}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onNodesDelete={onNodesDelete}
                onConnect={onConnect}
                fitView
              >
                <Background />
                <Controls />
                {/* <MiniMap /> */}
              </ReactFlow>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

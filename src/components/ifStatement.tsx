import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';

const handleStyle = { left: 10 };
const firstArgStyle = { top: 45 }
const secondArgStyle = { top: 140 }

function IfStatement({ id, data, isConnectable, updateLabel }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
    // updateLabel(id, evt.target.value)
    data.label = evt.target.value
  }, []);

  return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div>
        <label htmlFor="text">IF: </label>
        {/* <input className="w-full border border-[#565656] rounded-md px-3 py-2 mb-2 bg-[#2d2d2d] nodrag" id="text" name="text" onChange={onChange} defaultValue={data.label} /> */}
      </div>
      <select
            className="w-full border border-[#565656] rounded-md px-3 py-2 mb-2 bg-[#2d2d2d]"
            value={data.variable_type}
            onChange={(e) =>
              data.variable_type = e.target.value
            }
          >
            <option value="">Left-side Argument</option>
            <option value="self.env().caller()">tx sender</option>
            <option value="parameter">Function parameter</option>
            <option value="state">Public State</option>
      </select>

      <select
            className="w-full border border-[#565656] rounded-md px-3 py-2 mb-2 bg-[#2d2d2d]"
            value={data.variable_type}
            onChange={(e) =>
              data.variable_type = e.target.value
            }
          >
            <option value="">Operation Type</option>
            <option value="==">==</option>
            <option value="!=">!=</option>
            <option value="<">`${"<"}`</option>
            <option value=">">`${">"}`</option>
            <option value="<=">`${"<="}`</option>
            <option value=">=">`${">="}`</option>
      </select>

      <select
            className="w-full border border-[#565656] rounded-md px-3 py-2 mb-2 bg-[#2d2d2d]"
            value={data.variable_type}
            onChange={(e) =>
              data.variable_type = e.target.value
            }
          >
            <option value="">Right-side Argument</option>
            <option value="self.env().caller()">tx sender</option>
            <option value="parameter">Function parameter</option>
            <option value="state">Public State</option>
      </select>
      <Handle type="source" position={Position.Left} id="c" style={firstArgStyle} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Left} id="d" style={secondArgStyle} isConnectable={isConnectable} />
      {/* <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={handleStyle}
        isConnectable={isConnectable}
      /> */}
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
    </div>
  );
}

export default IfStatement;

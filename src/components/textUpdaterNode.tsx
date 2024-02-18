import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';

const handleStyle = { left: 10 };

function TextUpdaterNode({ id, data, isConnectable, updateLabel }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
    // updateLabel(id, evt.target.value)
    data.label = evt.target.value
  }, []);

  return (
    <div className="text-updater-node">
      {/* <Handle type="target" position={Position.Top} isConnectable={isConnectable} /> */}
      <div>
        <label htmlFor="text">Parameter:</label>
        <input className="w-full border border-[#565656] rounded-md px-3 py-2 mb-2 bg-[#2d2d2d] nodrag" id="text" name="text" onChange={onChange} defaultValue={data.label} />
      </div>
      <select
            className="w-full border border-[#565656] rounded-md px-3 py-2 mb-2 bg-[#2d2d2d]"
            value={data.variable_type}
            onChange={(e) =>
              data.variable_type = e.target.value
            }
          >
            <option value="">Variable Type</option>
            <option value="String">String</option>
            <option value="AccountId">AccountId</option>
            <option value="bool">Boolean</option>
            <option value="u64">u64</option>
            <option value="u128">u128</option>
          </select>
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

export default TextUpdaterNode;

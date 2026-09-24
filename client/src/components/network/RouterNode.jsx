import { Handle, Position } from "@xyflow/react";

function RouterNode({ data }) {
  return (
    <div className="router-node">

      {/* Top input */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
      />

      {/* Router */}
      <div className="router-icon">
        {data.label}
      </div>

      {/* Bottom output */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
      />

      {/* Left input */}
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
      />

      {/* Right output */}
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
      />

    </div>
  );
}

export default RouterNode;
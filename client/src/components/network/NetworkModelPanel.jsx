import { useEffect, useState } from "react";

function NetworkModelPanel({
  selectedNode,
  selectedEdge,
  onUpdateNode,
  onUpdateEdge,
  onClearSelection,
}) {
  const [nodeForm, setNodeForm] = useState(null);
  const [edgeForm, setEdgeForm] = useState(null);  

  useEffect(() => {
    setNodeForm(
      selectedNode
        ? {
            label: selectedNode.data?.label || selectedNode.id,
            role: selectedNode.data?.role || "Router",
            ipAddress: selectedNode.data?.ipAddress || "",
            priority: selectedNode.data?.priority ?? 1,
            failed: Boolean(selectedNode.data?.failed),
          }
        : null
    );
  }, [selectedNode]);

  useEffect(() => {
    setEdgeForm(
      selectedEdge
        ? {
            direction: selectedEdge.data?.direction || "bidirectional",
            linkType: selectedEdge.data?.linkType || "ethernet",
            failed: Boolean(selectedEdge.data?.failed),
          }
        : null
    );
  }, [selectedEdge]);

  const updateNode = (key, value) => {
    setNodeForm((current) => ({ ...current, [key]: value }));
  };

  const updateEdge = (key, value) => {
    setEdgeForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="netviz-feature-panel network-model-panel">
      <div className="feature-panel-header">
        <div>
          <h3>Network Modeling</h3>
          <span>Router identity and link characteristics</span>
        </div>
        {(selectedNode || selectedEdge) && (
          <button type="button" className="feature-button secondary" onClick={onClearSelection}>
            Clear
          </button>
        )}
      </div>

      {!selectedNode && !selectedEdge && (
        <div className="feature-empty-state">
          Select a router or link on the canvas to edit its network model.
          <div className="model-hints">
            <span>Router: name · IP address · role · priority · operational state</span>
            <span>Link: direction · medium · operational state</span>
          </div>
        </div>
      )}

      {selectedNode && nodeForm && (
        <div className="model-form">
          <div className="model-selection-title">Router {selectedNode.id}</div>

          <label>Display Name<input value={nodeForm.label} onChange={(e) => updateNode("label", e.target.value)} /></label>
          <label>IP Address<input value={nodeForm.ipAddress} onChange={(e) => updateNode("ipAddress", e.target.value)} placeholder="10.0.0.1" /></label>
          <label>Role<select value={nodeForm.role} onChange={(e) => updateNode("role", e.target.value)}><option>Router</option><option>Core Router</option><option>Edge Router</option><option>Gateway</option></select></label>
          <label>Priority<input type="number" min="1" max="255" value={nodeForm.priority} onChange={(e) => updateNode("priority", Number(e.target.value) || 1)} /></label>

          <label className="model-checkbox"><input type="checkbox" checked={nodeForm.failed} onChange={(e) => updateNode("failed", e.target.checked)} /> Router failed</label>

          <button
            type="button"
            className="feature-button"
            onClick={() => onUpdateNode({ ...selectedNode, data: { ...selectedNode.data, ...nodeForm } })}
          >
            Apply Router Model
          </button>
        </div>
      )}

      {selectedEdge && edgeForm && (
        <div className="model-form">
          <div className="model-selection-title">Link {selectedEdge.source} → {selectedEdge.target}</div>

          <label>Direction<select value={edgeForm.direction} onChange={(e) => updateEdge("direction", e.target.value)}>
            <option value="bidirectional">Bidirectional</option>
            <option value="forward">Forward only</option>
            <option value="reverse">Reverse only</option>
          </select></label>

          <label>Link Type<select value={edgeForm.linkType} onChange={(e) => updateEdge("linkType", e.target.value)}>
            <option value="ethernet">Ethernet</option>
            <option value="fiber">Fiber</option>
            <option value="wireless">Wireless</option>
            <option value="serial">Serial</option>
          </select></label>

          <label className="model-checkbox"><input type="checkbox" checked={edgeForm.failed} onChange={(e) => updateEdge("failed", e.target.checked)} /> Link failed</label>

          <button
            type="button"
            className="feature-button"
            onClick={() => onUpdateEdge({ ...selectedEdge, data: { ...selectedEdge.data, ...edgeForm } })}
          >
            Apply Link Model
          </button>
        </div>
      )}

      <div className="feature-panel-note">
        <strong>Existing link simulation</strong>
        <span>Cost, delay, bandwidth and packet-loss values remain controlled by Link Properties.</span>
      </div>
    </div>
  );
}

export default NetworkModelPanel;

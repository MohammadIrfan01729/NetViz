const makeNode = (id, x, y) => ({
  id,
  type: "router",
  position: { x, y },
  data: {
    label: id,
    role: "Router",
    ipAddress: `10.0.0.${id.slice(1)}`,
    priority: 1,
    failed: false,
  },
});

const makeEdge = (source, target, index, overrides = {}) => ({
  id: `${source}-${target}-preset-${index}`,
  source,
  target,
  type: "default",
  label: "1",
  data: {
    cost: 1,
    delay: 10,
    bandwidth: 100,
    packetLoss: 0,
    failed: false,
    direction: "bidirectional",
    linkType: "ethernet",
    ...overrides,
  },
  style: { stroke: "#58a6ff", strokeWidth: 2 },
});

export const topologyPresets = {
  line: {
    name: "Linear Network",
    description: "Four routers connected in a simple chain.",
    nodes: [
      makeNode("R1", 100, 170), makeNode("R2", 300, 170),
      makeNode("R3", 500, 170), makeNode("R4", 700, 170),
    ],
    edges: [
      makeEdge("R1", "R2", 1), makeEdge("R2", "R3", 2), makeEdge("R3", "R4", 3),
    ],
  },
  ring: {
    name: "Ring Network",
    description: "Five routers with a closed redundant path.",
    nodes: [
      makeNode("R1", 380, 60), makeNode("R2", 650, 160), makeNode("R3", 550, 390),
      makeNode("R4", 210, 390), makeNode("R5", 110, 160),
    ],
    edges: [
      makeEdge("R1", "R2", 1), makeEdge("R2", "R3", 2), makeEdge("R3", "R4", 3),
      makeEdge("R4", "R5", 4), makeEdge("R5", "R1", 5),
    ],
  },
  mesh: {
    name: "Mesh Network",
    description: "Five routers with multiple alternate routes.",
    nodes: [
      makeNode("R1", 120, 180), makeNode("R2", 360, 70), makeNode("R3", 620, 180),
      makeNode("R4", 500, 390), makeNode("R5", 230, 390),
    ],
    edges: [
      makeEdge("R1", "R2", 1), makeEdge("R2", "R3", 2), makeEdge("R3", "R4", 3),
      makeEdge("R4", "R5", 4), makeEdge("R5", "R1", 5), makeEdge("R2", "R5", 6),
      makeEdge("R2", "R4", 7), makeEdge("R1", "R4", 8),
    ],
  },
  redundant: {
    name: "Redundant Core",
    description: "Two access routers with dual paths through a core pair.",
    nodes: [
      makeNode("R1", 100, 220), makeNode("R2", 360, 100),
      makeNode("R3", 360, 340), makeNode("R4", 650, 220),
    ],
    edges: [
      makeEdge("R1", "R2", 1, { cost: 2, bandwidth: 1000 }),
      makeEdge("R1", "R3", 2, { cost: 2, bandwidth: 1000 }),
      makeEdge("R2", "R4", 3, { cost: 2, bandwidth: 1000 }),
      makeEdge("R3", "R4", 4, { cost: 2, bandwidth: 1000 }),
      makeEdge("R2", "R3", 5, { cost: 1, delay: 5, bandwidth: 1000 }),
    ],
  },
};

function TopologyPresetsPanel({ onLoadPreset, disabled = false }) {
  return (
    <div className="netviz-feature-panel topology-presets-panel">
      <div className="feature-panel-header">
        <div>
          <h3>Topology Presets</h3>
          <span>Load ready-made network structures for testing</span>
        </div>
      </div>

      <div className="preset-grid">
        {Object.entries(topologyPresets).map(([id, preset]) => (
          <div className="preset-card" key={id}>
            <div>
              <strong>{preset.name}</strong>
              <p>{preset.description}</p>
              <small>{preset.nodes.length} routers · {preset.edges.length} links</small>
            </div>
            <button
              type="button"
              className="feature-button"
              disabled={disabled}
              onClick={() => onLoadPreset(id, preset)}
            >
              Load
            </button>
          </div>
        ))}
      </div>

      <div className="feature-panel-note">
        <strong>Note</strong>
        <span>Loading a preset replaces the current topology and clears the current packet simulation.</span>
      </div>
    </div>
  );
}

export default TopologyPresetsPanel;

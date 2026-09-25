import {
  Plus,
  GitBranch,
  Trash2,
  Play,
} from "lucide-react";


function Sidebar({
  onAddRouter,
  onAddLink,
  onClearNetwork,
  onStartSimulation,
  linkMode,
  isSimulating,
  hasPackets,
}) {
  return (
    <aside className="sidebar">
      <section className="sidebar-section">
        <h3>Network</h3>

        <button
          type="button"
          className="sidebar-button"
          onClick={onAddRouter}
        >
          <Plus size={18} />
          <span>Add Router</span>
        </button>

        <button
          type="button"
          className={`sidebar-button ${
            linkMode ? "active-link-mode" : ""
          }`}
          onClick={onAddLink}
        >
          <GitBranch size={18} />
          <span>
            {linkMode ? "Cancel Link" : "Add Link"}
          </span>
        </button>

        <button
          type="button"
          className="sidebar-button danger"
          onClick={onClearNetwork}
        >
          <Trash2 size={18} />
          <span>Clear Network</span>
        </button>
      </section>

      <section className="sidebar-section">
        <h3>Simulation</h3>

        <button
          type="button"
          className="sidebar-button primary"
          onClick={onStartSimulation}
          disabled={
            isSimulating ||
            !hasPackets
          }
        >
          <Play size={18} />

          <span>
            {isSimulating
              ? "Simulation Running..."
              : "Start Simulation"}
          </span>
        </button>

        {!hasPackets && !isSimulating && (
          <p className="sidebar-hint">
            Generate packets first.
          </p>
        )}
      </section>
    </aside>
  );
}

export default Sidebar;

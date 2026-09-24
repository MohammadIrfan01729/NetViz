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
  linkMode,
}) {

  return (

    <aside className="sidebar">

      {/* Network */}

      <section className="sidebar-section">

        <h3>Network</h3>


        <button
          className="sidebar-button"
          onClick={onAddRouter}
        >
          <Plus size={18} />

          Add Router
        </button>


        <button
          className={`sidebar-button ${
            linkMode ? "active-link-mode" : ""
          }`}
          onClick={onAddLink}
        >

          <GitBranch size={18} />

          {linkMode ? "Cancel Link" : "Add Link"}

        </button>


        <button
          className="sidebar-button danger"
          onClick={onClearNetwork}
        >

          <Trash2 size={18} />

          Clear Network

        </button>

      </section>


      {/* Simulation */}

      <section className="sidebar-section">

        <h3>Simulation</h3>


        <button className="sidebar-button primary">

          <Play size={18} />

          Start Simulation

        </button>

      </section>

    </aside>

  );
}

export default Sidebar;
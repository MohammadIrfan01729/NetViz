function Sidebar({
  onAddRouter,
  onAddLink,
  onClearNetwork,
  onStartSimulation,
  onModuleSelect,

  activeModule,

  linkMode,
  isSimulating,
  hasPackets,
}) {
  const modules = [
    {
      id: "overview",
      icon: "▦",
      label: "Overview",
      description: "Network overview",
    },
    {
      id: "routing",
      icon: "⇄",
      label: "Routing",
      description: "Calculate routes",
    },
    {
      id: "packet-generator",
      icon: "＋",
      label: "Packet Generator",
      description: "Create packets",
    },
    {
      id: "packet-status",
      icon: "◉",
      label: "Packet Status",
      description: "Live packet state",
    },
    {
      id: "event-log",
      icon: "☷",
      label: "Event Log",
      description: "Simulation events",
    },
    {
      id: "statistics",
      icon: "▥",
      label: "Statistics",
      description: "Network metrics",
    },
    {
      id: "packet-inspector",
      icon: "⌕",
      label: "Packet Inspector",
      description: "Inspect packets",
    },
    {
      id: "link-properties",
      icon: "⌁",
      label: "Link Properties",
      description: "Selected link",
    },
  ];

  return (
    <aside className="sidebar">

      <div className="sidebar-section">

        <h3>
          Network
        </h3>

        <button
          type="button"
          className="sidebar-button"
          onClick={onAddRouter}
        >
          <span className="sidebar-button-icon">
            +
          </span>

          <span>
            Add Router
          </span>
        </button>


        <button
          type="button"
          className={`sidebar-button ${
            linkMode
              ? "active-link-mode"
              : ""
          }`}
          onClick={onAddLink}
        >
          <span className="sidebar-button-icon">
            ⛓
          </span>

          <span>
            {linkMode
              ? "Select Routers..."
              : "Add Link"}
          </span>
        </button>

      </div>


      <div className="sidebar-section">

        <h3>
          Simulation
        </h3>

        <button
          type="button"
          className="sidebar-button primary"
          onClick={onStartSimulation}
          disabled={
            isSimulating ||
            !hasPackets
          }
        >
          <span className="sidebar-button-icon">
            {isSimulating
              ? "●"
              : "▶"}
          </span>

          <span>
            {isSimulating
              ? "Simulation Running"
              : "Start Simulation"}
          </span>
        </button>


        {!hasPackets && (
          <div className="sidebar-hint">
            Generate packets before
            starting a simulation.
          </div>
        )}

      </div>


      <div className="sidebar-section sidebar-modules-section">

        <div className="sidebar-section-heading-row">

          <h3>
            Modules
          </h3>

          <span className="sidebar-module-count">
            {modules.length}
          </span>

        </div>


        <div className="sidebar-module-list">

          {modules.map((module) => {

            const isActive =
              activeModule ===
              module.id;

            const isDisabled =
              module.id ===
                "packet-inspector" &&
              !hasPackets;

            return (
              <button
                key={module.id}
                type="button"
                className={`sidebar-module-button ${
                  isActive
                    ? "active"
                    : ""
                } ${
                  isDisabled
                    ? "disabled"
                    : ""
                }`}
                onClick={() => {
                  if (
                    !isDisabled
                  ) {
                    onModuleSelect?.(
                      module.id
                    );
                  }
                }}
                disabled={
                  isDisabled
                }
                title={
                  isDisabled
                    ? "Generate packets first"
                    : module.description
                }
              >

                <span className="sidebar-module-icon">
                  {module.icon}
                </span>

                <span className="sidebar-module-content">

                  <span className="sidebar-module-label">
                    {module.label}
                  </span>

                  <span className="sidebar-module-description">
                    {module.description}
                  </span>

                </span>

                {isActive && (
                  <span className="sidebar-module-active-indicator">
                    ›
                  </span>
                )}

              </button>
            );
          })}

        </div>

      </div>


      <div className="sidebar-section">

        <h3>
          Actions
        </h3>

        <button
          type="button"
          className="sidebar-button danger"
          onClick={onClearNetwork}
        >
          <span className="sidebar-button-icon">
            ×
          </span>

          <span>
            Clear Network
          </span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;

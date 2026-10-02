import RoutingPanel from "../routing/RoutingPanel";
import RouteResult from "../routing/RouteResult";
import RoutingTable from "../routing/RoutingTable";

import LinkProperties from "../network/LinkProperties";

import StatisticsPanel from "../statistics/StatisticsPanel";

import PacketGenerator from "../packet/PacketGenerator";
import PacketStatus from "../packet/PacketStatus";
import PacketEventLog from "../packet/PacketEventLog";

import PacketInspector from "../packet/PacketInspector";


function DashboardModulePanel({
  activeModule,

  nodes,
  edges,

  packets,
  isSimulating,

  eventLog,

  selectedPacket,
  selectedPacketId,

  selectedEdge,

  routeRequest,

  onFindPath,
  onGeneratePackets,

  onSelectPacket,

  onUpdateEdge,
  onDeleteEdge,

  onClose,
}) {

  const moduleMeta = {
    overview: [
      "▦",
      "Network Overview",
      "Current network and simulation overview",
    ],

    routing: [
      "⇄",
      "Routing",
      "Calculate and inspect network routes",
    ],

    "packet-generator": [
      "+",
      "Packet Generator",
      "Create packets for simulation",
    ],

    "packet-status": [
      "◉",
      "Packet Status",
      "Monitor packets in real time",
    ],

    "event-log": [
      "☷",
      "Packet Event Log",
      "Complete simulation event history",
    ],

    statistics: [
      "▥",
      "Network Statistics",
      "Live network performance metrics",
    ],

    "packet-inspector": [
      "⌕",
      "Packet Inspector",
      "Detailed packet information",
    ],

    "link-properties": [
      "⌁",
      "Link Properties",
      "Configure the selected network link",
    ],
  };

  const meta =
    moduleMeta[
      activeModule
    ] || moduleMeta.overview;


  const renderOverview = () => {

    const generated = packets.length;

    const delivered =
      packets.filter(
        (packet) => packet.status === "delivered"
      ).length;

    const lost =
      packets.filter(
        (packet) => packet.status === "lost"
      ).length;

    const inTransit =
      packets.filter(
        (packet) => packet.status === "in-transit"
      ).length;

    const pending =
      packets.filter(
        (packet) =>
          packet.status === "generated" ||
          packet.status === "pending"
      ).length;

    const deliveryRate =
      generated > 0
        ? ((delivered / generated) * 100).toFixed(1)
        : "0.0";

    const lossRate =
      generated > 0
        ? ((lost / generated) * 100).toFixed(1)
        : "0.0";

    const connected = edges.length > 0;

    const route = routeRequest?.result?.path || [];

    return (
      <div className="module-overview">

        <div className="overview-intro">
          <div className="overview-icon">◈</div>

          <div className="overview-intro-content">
            <div className="overview-kicker">
              NETWORK SIMULATOR
            </div>

            <h4>Network Overview</h4>

            <p>
              Monitor your topology, routing state and packet
              simulation from one place.
            </p>
          </div>
        </div>

        <div className="overview-grid">
          <div className="overview-card">
            <span>Routers</span>
            <strong>{nodes.length}</strong>
            <small>Network nodes</small>
          </div>

          <div className="overview-card">
            <span>Links</span>
            <strong>{edges.length}</strong>
            <small>{connected ? "Connected topology" : "No links yet"}</small>
          </div>

          <div className="overview-card">
            <span>Packets</span>
            <strong>{generated}</strong>
            <small>Generated</small>
          </div>

          <div className="overview-card">
            <span>Events</span>
            <strong>{eventLog.length}</strong>
            <small>Simulation events</small>
          </div>
        </div>

        <div className="overview-section">
          <div className="overview-section-heading">
            <div>
              <div className="overview-section-title">
                Simulation Status
              </div>
              <span className="overview-section-subtitle">
                Live packet state
              </span>
            </div>

            <span
              className={`overview-state-badge ${
                isSimulating ? "running" : "ready"
              }`}
            >
              <span className="overview-state-dot" />
              {isSimulating ? "Running" : "Ready"}
            </span>
          </div>

          <div className="overview-status-row">
            <div className="overview-status-item">
              <span className="overview-status-label">Delivered</span>
              <strong className="overview-success">{delivered}</strong>
            </div>

            <div className="overview-status-item">
              <span className="overview-status-label">Lost</span>
              <strong className="overview-danger">{lost}</strong>
            </div>

            <div className="overview-status-item">
              <span className="overview-status-label">In Transit</span>
              <strong className="overview-info">{inTransit}</strong>
            </div>

            <div className="overview-status-item">
              <span className="overview-status-label">Pending</span>
              <strong>{pending}</strong>
            </div>

            <div className="overview-status-item">
              <span className="overview-status-label">Delivery</span>
              <strong className="overview-success">{deliveryRate}%</strong>
            </div>

            <div className="overview-status-item">
              <span className="overview-status-label">Loss Rate</span>
              <strong className="overview-danger">{lossRate}%</strong>
            </div>
          </div>
        </div>

        <div className="overview-bottom-grid">
          <div className="overview-section overview-route-section">
            <div className="overview-section-heading">
              <div>
                <div className="overview-section-title">
                  Current Route
                </div>
                <span className="overview-section-subtitle">
                  Latest routing calculation
                </span>
              </div>
            </div>

            {route.length > 0 ? (
              <div className="overview-route">
                {route.map((node, index) => (
                  <span
                    className="overview-route-node"
                    key={`${node}-${index}`}
                  >
                    {node}
                    {index < route.length - 1 && (
                      <span className="overview-route-arrow">→</span>
                    )}
                  </span>
                ))}
              </div>
            ) : (
              <div className="overview-empty-line">
                No route calculated yet.
              </div>
            )}
          </div>

          <div className="overview-section">
            <div className="overview-section-heading">
              <div>
                <div className="overview-section-title">
                  Network State
                </div>
                <span className="overview-section-subtitle">
                  Topology readiness
                </span>
              </div>
            </div>

            <div className="overview-network-state">
              <div>
                <span>Topology</span>
                <strong>
                  {nodes.length === 0
                    ? "Empty"
                    : edges.length === 0
                    ? "Unlinked"
                    : "Connected"}
                </strong>
              </div>

              <div>
                <span>Routing</span>
                <strong>
                  {route.length > 0 ? "Route available" : "Ready"}
                </strong>
              </div>

              <div>
                <span>Simulation</span>
                <strong>
                  {isSimulating ? "Active" : "Idle"}
                </strong>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  };


  const renderModule = () => {

    switch (activeModule) {

      case "routing":
        return (
          <div className="module-content module-routing">

            <RoutingPanel
              nodes={nodes}
              onFindPath={onFindPath}
            />

            {routeRequest?.result && (
              <div className="module-routing-results">

                <RouteResult
                  result={
                    routeRequest.result
                  }
                  algorithm={
                    routeRequest.algorithm
                  }
                />

                <RoutingTable
                  table={
                    routeRequest.routingTable
                  }
                  source={
                    routeRequest.source
                  }
                />

              </div>
            )}

          </div>
        );


      case "packet-generator":
        return (
          <div className="module-content">

            <PacketGenerator
              nodes={nodes}
              onGeneratePackets={
                onGeneratePackets
              }
              disabled={isSimulating}
            />

          </div>
        );


      case "packet-status":
        return (
          <div className="module-content module-full-height">

            <PacketStatus
              packets={packets}
              isSimulating={
                isSimulating
              }
              selectedPacketId={
                selectedPacketId
              }
              onSelectPacket={
                onSelectPacket
              }
            />

          </div>
        );


      case "event-log":
        return (
          <div className="module-content module-full-height">

            <PacketEventLog
              events={eventLog}
            />

          </div>
        );


      case "statistics":
        return (
          <div className="module-content">

            <StatisticsPanel
              nodeCount={nodes.length}
              edgeCount={edges.length}
              packets={packets}
            />

          </div>
        );


      case "packet-inspector":
        return (
          <div className="module-content module-full-height">

            <PacketInspector
              packet={selectedPacket}
              packets={packets}
              edges={edges}
              onSelectPacket={
                onSelectPacket
              }
            />

          </div>
        );


      case "link-properties":
        return (
          <div className="module-content">

            {selectedEdge ? (
              <LinkProperties
                edge={selectedEdge}
                nodes={nodes}
                onUpdate={onUpdateEdge}
                onDelete={onDeleteEdge}
              />
            ) : (
              <div className="module-empty-state">

                <div className="module-empty-icon">
                  ⛓
                </div>

                <h4>
                  No Link Selected
                </h4>

                <p>
                  Select a link on the
                  network canvas to view
                  and edit its properties.
                </p>

              </div>
            )}

          </div>
        );


      case "overview":
      default:
        return (
          <div className="module-content">
            {renderOverview()}
          </div>
        );
    }
  };


  return (
    <section className="dashboard-module-panel">

      <div className="dashboard-module-header">

        <div className="dashboard-module-title-area">

          <div className="dashboard-module-title-icon">
            {meta[0]}
          </div>

          <div>
            <h3>{meta[1]}</h3>
            <span>{meta[2]}</span>
          </div>

        </div>


        <div className="dashboard-module-header-actions">

          <div className="module-header-status">

            {isSimulating && (
              <>
                <span className="module-running-dot" />
                Running
              </>
            )}

          </div>


          <button
            type="button"
            className="module-close-button"
            onClick={onClose}
            title="Close module"
            aria-label="Close module"
          >
            ×
          </button>

        </div>

      </div>


      <div className="dashboard-module-body">
        {renderModule()}
      </div>

    </section>
  );
}

export default DashboardModulePanel;

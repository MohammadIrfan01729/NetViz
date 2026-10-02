function PacketInspector({
  packet,
  packets = [],
  edges = [],
  onSelectPacket,
}) {

  const lostPackets = packets.filter(
    (item) => item.status === "lost"
  );


  if (!packet) {
    return (
      <div className="panel packet-inspector">

        <div className="panel-header">
          <div>
            <h3>Packet Inspector</h3>
            <span className="panel-subtitle">
              Select a packet to inspect its details
            </span>
          </div>
        </div>

        {lostPackets.length > 0 && (
          <div className="inspector-lost-summary">
            <div className="inspector-lost-summary-header">
              <span className="inspector-lost-summary-title">
                Lost Packets
              </span>
              <span className="inspector-lost-count">
                {lostPackets.length}
              </span>
            </div>

            <div className="inspector-lost-list">
              {lostPackets.map((lostPacket) => (
                <button
                  type="button"
                  key={lostPacket.id}
                  className="inspector-lost-item"
                  onClick={() =>
                    onSelectPacket?.(lostPacket.id)
                  }
                >
                  <span className="inspector-lost-item-id">
                    {lostPacket.id}
                  </span>
                  <span className="inspector-lost-item-route">
                    {lostPacket.source} → {lostPacket.destination}
                  </span>
                  <span className="inspector-lost-item-reason">
                    {lostPacket.lossReason ||
                      lostPacket.reason ||
                      "Packet loss"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="packet-inspector-empty">
          <div className="packet-inspector-empty-icon">
            ◇
          </div>
          <div>
            Select a packet from Packet Status or Lost Packets to inspect it.
          </div>
        </div>

      </div>
    );
  }


  // =========================================================
  // BASIC INFORMATION
  // =========================================================

  const currentHop =
    Number(packet.currentHop) || 0;

  const totalHops =
    Math.max(
      (packet.path?.length || 1) - 1,
      0
    );

  const currentRouter =
    packet.currentNode ??
    packet.path?.[currentHop] ??
    packet.source ??
    "-";

  const route =
    packet.path?.length > 0
      ? packet.path.join(" → ")
      : "-";

  const status =
    packet.status || "generated";


  // =========================================================
  // EDGE LOOKUP
  // =========================================================

  const findEdge = (
    source,
    target
  ) => {
    return edges.find(
      (edge) =>
        (
          edge.source === source &&
          edge.target === target
        ) ||
        (
          edge.source === target &&
          edge.target === source
        )
    );
  };


  // =========================================================
  // CURRENT LINK
  // =========================================================

  const currentSource =
    packet.path?.[currentHop];

  const currentTarget =
    packet.path?.[currentHop + 1];

  const currentEdge =
    currentSource && currentTarget
      ? findEdge(
          currentSource,
          currentTarget
        )
      : null;


  // =========================================================
  // METRICS
  // =========================================================

  const toNumber = (
    value,
    fallback = 0
  ) => {
    const number = Number(value);

    return Number.isFinite(number)
      ? number
      : fallback;
  };


  const formatDelay = (
    value
  ) => {
    const number = toNumber(value);

    return `${number.toFixed(2)} ms`;
  };


  const formatBandwidth = (
    value
  ) => {
    const number = Number(value);

    if (
      !Number.isFinite(number) ||
      number <= 0
    ) {
      return "-";
    }

    return `${number.toFixed(2)} Mbps`;
  };


  const formatLoss = (
    value
  ) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return status === "lost"
        ? "100%"
        : "-";
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
      return status === "lost"
        ? "100%"
        : "-";
    }

    return `${number}%`;
  };


  const linkDelay = toNumber(
    packet.linkDelay ??
      currentEdge?.data?.delay,
    0
  );

  const bandwidth = toNumber(
    packet.bandwidth ??
      currentEdge?.data?.bandwidth,
    0
  );

  const transmissionDelay = toNumber(
    packet.transmissionDelay ??
      packet.transmissionTime,
    0
  );

  const queueingDelay = toNumber(
    packet.queueingDelay,
    0
  );

  const totalLinkDelay = toNumber(
    packet.totalLinkDelay,
    linkDelay +
      transmissionDelay +
      queueingDelay
  );

  const activePackets = toNumber(
    packet.activePackets,
    0
  );

  const queuePosition = toNumber(
    packet.queuePosition,
    0
  );

  const congestionLevel =
    packet.congestionLevel ||
    "low";

  const rerouteCount = toNumber(
    packet.rerouteCount,
    0
  );

  const packetLoss =
    packet.lossProbability ??
    packet.packetLoss ??
    packet.lossPercentage ??
    packet.loss ??
    null;


  // =========================================================
  // FULL ROUTE DELAY ESTIMATE
  // =========================================================

  const calculateEstimatedEndToEndDelay = () => {

    if (
      !Array.isArray(packet.path) ||
      packet.path.length < 2
    ) {
      return 0;
    }

    const packetSize = Math.max(
      0,
      toNumber(packet.size, 0)
    );

    let total = 0;

    for (
      let index = 0;
      index < packet.path.length - 1;
      index += 1
    ) {

      const source = packet.path[index];
      const target = packet.path[index + 1];

      const edge = findEdge(
        source,
        target
      );

      if (!edge || edge.data?.failed) {
        continue;
      }

      const edgeDelay = Math.max(
        0,
        toNumber(edge.data?.delay, 0)
      );

      const edgeBandwidth = Math.max(
        0.001,
        toNumber(edge.data?.bandwidth, 1)
      );

      const transmission =
        ((packetSize * 8) /
          (edgeBandwidth * 1_000_000)) *
        1000;

      total +=
        edgeDelay +
        transmission;
    }

    return total;
  };


  const estimatedEndToEndDelay =
    calculateEstimatedEndToEndDelay();

  const actualEndToEndDelay =
    packet.actualEndToEndDelay ??
    (
      status === "delivered"
        ? packet.delay
        : null
    );


  // =========================================================
  // STATUS
  // =========================================================

  const getStatusLabel = () => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "lost":
        return "Lost";
      case "in-transit":
        return "In Transit";
      default:
        return "Generated";
    }
  };


  return (
    <div className="panel packet-inspector">

      <div className="panel-header">
        <div>
          <h3>Packet Inspector</h3>
          <span className="panel-subtitle">
            Detailed packet information
          </span>
        </div>
      </div>


      {/* =====================================================
          LOST PACKETS
          ===================================================== */}

      {lostPackets.length > 0 && (
        <div className="inspector-lost-summary">

          <div className="inspector-lost-summary-header">
            <span className="inspector-lost-summary-title">
              Lost Packets
            </span>
            <span className="inspector-lost-count">
              {lostPackets.length}
            </span>
          </div>

          <div className="inspector-lost-list">
            {lostPackets.map((lostPacket) => (
              <button
                type="button"
                key={lostPacket.id}
                className={`inspector-lost-item ${
                  lostPacket.id === packet.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  onSelectPacket?.(lostPacket.id)
                }
              >
                <span className="inspector-lost-item-id">
                  {lostPacket.id}
                </span>
                <span className="inspector-lost-item-route">
                  {lostPacket.source} → {lostPacket.destination}
                </span>
                <span className="inspector-lost-item-reason">
                  {lostPacket.lossReason ||
                    lostPacket.reason ||
                    "Packet loss"}
                </span>
              </button>
            ))}
          </div>

        </div>
      )}


      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="inspector-packet-header">

        <div className="inspector-packet-id">
          {packet.id}
        </div>

        <div
          className={`inspector-status inspector-status-${status}`}
        >
          <span className="inspector-status-dot" />
          {getStatusLabel()}
        </div>

      </div>


      {/* =====================================================
          PACKET INFORMATION
          ===================================================== */}

      <div className="inspector-section">

        <div className="inspector-section-title">
          Packet Information
        </div>

        <div className="inspector-grid">

          <div className="inspector-field">
            <span>Source</span>
            <strong>
              {packet.source || "-"}
            </strong>
          </div>

          <div className="inspector-field">
            <span>Destination</span>
            <strong>
              {packet.destination || "-"}
            </strong>
          </div>

          <div className="inspector-field">
            <span>Current Router</span>
            <strong className="inspector-blue">
              {currentRouter}
            </strong>
          </div>

          <div className="inspector-field">
            <span>Packet Size</span>
            <strong>
              {packet.size ?? "-"} bytes
            </strong>
          </div>

        </div>
      </div>


      {/* =====================================================
          ROUTE
          ===================================================== */}

      <div className="inspector-section">

        <div className="inspector-section-title">
          Route
        </div>

        <div className="inspector-route">
          {route}
        </div>

        <div className="inspector-hop-info">
          <span>Current Hop</span>
          <strong>
            {currentHop} / {totalHops}
          </strong>
        </div>

      </div>


      {/* =====================================================
          PERFORMANCE
          ===================================================== */}

      <div className="inspector-section">

        <div className="inspector-section-title">
          Performance
        </div>

        <div className="inspector-grid">

          <div className="inspector-field">
            <span>Estimated End-to-End</span>
            <strong className="inspector-blue">
              {formatDelay(
                estimatedEndToEndDelay
              )}
            </strong>
          </div>

          <div className="inspector-field">
            <span>Actual End-to-End</span>
            <strong>
              {actualEndToEndDelay !== null
                ? formatDelay(
                    actualEndToEndDelay
                  )
                : "-"}
            </strong>
          </div>

          <div className="inspector-field">
            <span>Link Delay</span>
            <strong>
              {formatDelay(linkDelay)}
            </strong>
          </div>

          <div className="inspector-field">
            <span>Transmission Delay</span>
            <strong>
              {formatDelay(
                transmissionDelay
              )}
            </strong>
          </div>

          <div className="inspector-field">
            <span>Queueing Delay</span>
            <strong>
              {formatDelay(queueingDelay)}
            </strong>
          </div>

          <div className="inspector-field">
            <span>Total Link Delay</span>
            <strong>
              {formatDelay(totalLinkDelay)}
            </strong>
          </div>

          <div className="inspector-field">
            <span>Hops Completed</span>
            <strong>
              {currentHop}
            </strong>
          </div>

          <div className="inspector-field">
            <span>Remaining Hops</span>
            <strong>
              {Math.max(
                totalHops - currentHop,
                0
              )}
            </strong>
          </div>

          <div className="inspector-field">
            <span>Packet Loss</span>
            <strong
              className={
                status === "lost" ||
                packetLoss !== null
                  ? "inspector-danger"
                  : ""
              }
            >
              {formatLoss(packetLoss)}
            </strong>
          </div>

        </div>
      </div>


      {/* =====================================================
          BANDWIDTH ANALYSIS
          ===================================================== */}

      <div className="inspector-section">

        <div className="inspector-section-title">
          Bandwidth Analysis
        </div>

        <div className="inspector-grid">

          <div className="inspector-field">
            <span>Current Bandwidth</span>
            <strong className="inspector-blue">
              {formatBandwidth(bandwidth)}
            </strong>
          </div>

          <div className="inspector-field">
            <span>Average Bandwidth</span>
            <strong>
              {formatBandwidth(
                packet.averageBandwidth
              )}
            </strong>
          </div>

          <div className="inspector-field">
            <span>Minimum Bandwidth</span>
            <strong>
              {formatBandwidth(
                packet.minimumBandwidth
              )}
            </strong>
          </div>

          <div className="inspector-field">
            <span>Maximum Bandwidth</span>
            <strong>
              {formatBandwidth(
                packet.maximumBandwidth
              )}
            </strong>
          </div>

          <div className="inspector-field">
            <span>Bottleneck Bandwidth</span>
            <strong className="inspector-blue">
              {formatBandwidth(
                packet.bottleneckBandwidth
              )}
            </strong>
          </div>

        </div>
      </div>


      {/* =====================================================
          CONGESTION ANALYSIS
          ===================================================== */}

      <div className="inspector-section">

        <div className="inspector-section-title">
          Congestion Analysis
        </div>

        <div className="inspector-grid">

          <div className="inspector-field">
            <span>Congestion Level</span>
            <strong
              className={
                congestionLevel === "high"
                  ? "inspector-danger"
                  : congestionLevel === "medium"
                    ? "inspector-blue"
                    : ""
              }
            >
              {String(
                congestionLevel
              ).toUpperCase()}
            </strong>
          </div>

          <div className="inspector-field">
            <span>Active Packets</span>
            <strong>
              {activePackets || "-"}
            </strong>
          </div>

          <div className="inspector-field">
            <span>Queue Position</span>
            <strong>
              {queuePosition || "-"}
            </strong>
          </div>

          <div className="inspector-field">
            <span>Reroutes</span>
            <strong
              className={
                rerouteCount > 0
                  ? "inspector-blue"
                  : ""
              }
            >
              {rerouteCount}
            </strong>
          </div>

        </div>
      </div>


      {/* =====================================================
          CURRENT LINK
          ===================================================== */}

      <div className="inspector-section">

        <div className="inspector-section-title">
          Current Link
        </div>

        <div className="inspector-grid">

          <div className="inspector-field">
            <span>Link</span>
            <strong>
              {currentSource && currentTarget
                ? `${currentSource} → ${currentTarget}`
                : "-"}
            </strong>
          </div>

          <div className="inspector-field">
            <span>Bandwidth</span>
            <strong>
              {formatBandwidth(bandwidth)}
            </strong>
          </div>

          <div className="inspector-field">
            <span>Packet Size</span>
            <strong>
              {packet.size ?? "-"} bytes
            </strong>
          </div>

          <div className="inspector-field">
            <span>Reroute Count</span>
            <strong>
              {rerouteCount}
            </strong>
          </div>

        </div>
      </div>


      {/* =====================================================
          REROUTE INFORMATION
          ===================================================== */}

      {rerouteCount > 0 && (
        <div className="inspector-section">

          <div className="inspector-section-title">
            Automatic Rerouting
          </div>

          <div className="inspector-grid">

            <div className="inspector-field">
              <span>Reroute Count</span>
              <strong className="inspector-blue">
                {rerouteCount}
              </strong>
            </div>

            <div className="inspector-field">
              <span>Reason</span>
              <strong>
                {packet.rerouteReason || "Network failure"}
              </strong>
            </div>

          </div>
        </div>
      )}


      {/* =====================================================
          LOSS REASON
          ===================================================== */}

      {status === "lost" &&
        (packet.lossReason || packet.reason) && (
          <div className="inspector-loss">

            <div className="inspector-loss-title">
              Packet Loss Reason
            </div>

            <div className="inspector-loss-message">
              {packet.lossReason ||
                packet.reason}
            </div>

          </div>
        )}

    </div>
  );
}


export default PacketInspector;

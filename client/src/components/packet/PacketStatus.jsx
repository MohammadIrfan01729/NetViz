function PacketStatus({
  packets,
  isSimulating,
}) {
  if (!packets || packets.length === 0) {
    return (
      <div className="panel packet-status-panel">
        <div className="panel-header">
          <div>
            <h3>Packet Simulation</h3>

            <span className="panel-subtitle">
              No packets generated
            </span>
          </div>
        </div>

        <div className="packet-status-empty">
          Generate packets to prepare the
          simulation.
        </div>
      </div>
    );
  }

  const generated = packets.length;

  const inTransit = packets.filter(
    (packet) =>
      packet.status === "in-transit"
  ).length;

  const delivered = packets.filter(
    (packet) =>
      packet.status === "delivered"
  ).length;

  const lost = packets.filter(
    (packet) =>
      packet.status === "lost"
  ).length;

  const pending =
    packets.filter(
      (packet) =>
        packet.status === "generated"
    ).length;

  let subtitle = "Packets ready to simulate.";

  if (isSimulating) {
    subtitle = "Simulation running...";
  } else if (delivered + lost === generated) {
    subtitle = "Simulation complete.";
  }

  return (
    <div className="panel packet-status-panel">
      <div className="panel-header">
        <div>
          <h3>Packet Simulation</h3>

          <span className="panel-subtitle">
            {subtitle}
          </span>
        </div>
      </div>

      <div className="packet-summary">
        <div className="packet-summary-item">
          <span>Generated</span>
          <strong>{generated}</strong>
        </div>

        <div className="packet-summary-item">
          <span>Pending</span>
          <strong>{pending}</strong>
        </div>

        <div className="packet-summary-item">
          <span>Delivered</span>
          <strong>{delivered}</strong>
        </div>

        <div className="packet-summary-item">
          <span>Lost</span>
          <strong>{lost}</strong>
        </div>
      </div>

      <div className="packet-list">
        {packets.map((packet) => (
          <div
            className="packet-item"
            key={packet.id}
          >
            <div>
              <span className="packet-id">
                {packet.id}
              </span>

              <div className="packet-route">
                {packet.source}
                {" → "}
                {packet.destination}
              </div>
            </div>

            <div className="packet-current">
              <span className="packet-node">
                {packet.currentNode}
              </span>

              <span
                className={
                  `packet-status packet-status-${packet.status}`
                }
              >
                {packet.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PacketStatus;

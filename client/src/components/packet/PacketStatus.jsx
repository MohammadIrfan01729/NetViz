function PacketStatus({
  packets = [],
  isSimulating = false,
  selectedPacketId = null,
  onSelectPacket,
}) {
  const generated = packets.length;

  const delivered = packets.filter(
    (packet) => packet.status === "delivered"
  ).length;

  const lost = packets.filter(
    (packet) => packet.status === "lost"
  ).length;

  const inTransit = packets.filter(
    (packet) => packet.status === "in-transit"
  ).length;

  const pending = packets.filter(
    (packet) =>
      packet.status !== "delivered" &&
      packet.status !== "lost" &&
      packet.status !== "in-transit"
  ).length;

  const deliveryRate =
    generated > 0
      ? ((delivered / generated) * 100).toFixed(1)
      : "0.0";

  const lossRate =
    generated > 0
      ? ((lost / generated) * 100).toFixed(1)
      : "0.0";

  const getCurrentNode = (packet) => {
    const currentHop =
      Number(packet.currentHop) || 0;

    return (
      packet.path?.[currentHop] ||
      packet.source ||
      "-"
    );
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "delivered":
        return "Delivered";

      case "lost":
        return "Lost";

      case "in-transit":
        return "In Transit";

      case "generated":
      default:
        return "Generated";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "delivered":
        return "packet-status-delivered";

      case "lost":
        return "packet-status-lost";

      case "in-transit":
        return "packet-status-in-transit";

      case "generated":
      default:
        return "packet-status-generated";
    }
  };

  const handlePacketKeyDown = (
    event,
    packetId
  ) => {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();

      onSelectPacket?.(
        packetId
      );
    }
  };

  if (packets.length === 0) {
    return (
      <div className="panel packet-status-panel">
        <div className="panel-header">
          <div>
            <h3>
              Packet Status
            </h3>

            <span className="panel-subtitle">
              Live packet simulation
            </span>
          </div>
        </div>

        <div className="packet-status-empty">
          No packets generated yet.
          <br />
          Generate packets to start
          a simulation.
        </div>
      </div>
    );
  }

  return (
    <div className="panel packet-status-panel">

      <div className="panel-header">
        <div>
          <h3>
            Packet Status
          </h3>

          <span className="panel-subtitle">
            {isSimulating
              ? "Simulation running"
              : "Packet overview"}
          </span>
        </div>
      </div>


      <div className="packet-summary">

        <div className="packet-summary-item">
          <span>Generated</span>
          <strong>{generated}</strong>
        </div>

        <div className="packet-summary-item">
          <span>Delivered</span>
          <strong>{delivered}</strong>
        </div>

        <div className="packet-summary-item">
          <span>Lost</span>
          <strong>{lost}</strong>
        </div>

        <div className="packet-summary-item">
          <span>In Transit</span>
          <strong>{inTransit}</strong>
        </div>

      </div>


      <div className="packet-live-metrics">

        <div>
          <span>Delivery</span>
          <strong>
            {deliveryRate}%
          </strong>
        </div>

        <div>
          <span>Loss</span>
          <strong>
            {lossRate}%
          </strong>
        </div>

        <div>
          <span>Pending</span>
          <strong>
            {pending}
          </strong>
        </div>

        <div>
          <span>State</span>
          <strong>
            {isSimulating
              ? "Running"
              : "Ready"}
          </strong>
        </div>

      </div>


      <div className="packet-list">

        {packets.map((packet) => {

          const currentNode =
            getCurrentNode(packet);

          const isSelected =
            selectedPacketId ===
            packet.id;

          const currentHop =
            Number(
              packet.currentHop
            ) || 0;

          const totalHops =
            Math.max(
              (packet.path?.length || 1) - 1,
              0
            );

          return (
            <div
              key={packet.id}
              className={`packet-item ${
                isSelected
                  ? "packet-item-selected"
                  : ""
              }`}
              onClick={() =>
                onSelectPacket?.(
                  packet.id
                )
              }
              onKeyDown={(event) =>
                handlePacketKeyDown(
                  event,
                  packet.id
                )
              }
              role="button"
              tabIndex={0}
              aria-label={`Inspect ${packet.id}`}
            >

              <div>
                <div className="packet-id">
                  {packet.id}
                </div>

                <div className="packet-route">
                  {packet.source}
                  {" → "}
                  {packet.destination}
                </div>

                <div className="packet-details">

                  <span>
                    Hop {currentHop}/{totalHops}
                  </span>

                  {packet.size !==
                    undefined && (
                    <span>
                      {packet.size} bytes
                    </span>
                  )}

                  {packet.totalDelay !==
                    undefined && (
                    <span>
                      {Number(
                        packet.totalDelay
                      ).toFixed(1)}
                      {" ms"}
                    </span>
                  )}

                  {packet.lossReason && (
                    <span className="packet-loss-reason">
                      {packet.lossReason}
                    </span>
                  )}

                </div>
              </div>


              <div className="packet-current">

                <span className="packet-node">
                  {currentNode}
                </span>

                <span
                  className={`packet-status ${
                    getStatusClass(
                      packet.status
                    )
                  }`}
                >
                  {getStatusLabel(
                    packet.status
                  )}
                </span>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default PacketStatus;

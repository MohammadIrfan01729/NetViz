function StatisticsPanel({
  nodeCount,
  edgeCount,
  packets = [],
}) {
  const generated =
    packets.length;

  const delivered =
    packets.filter(
      (packet) =>
        packet.status === "delivered"
    ).length;

  const lost =
    packets.filter(
      (packet) =>
        packet.status === "lost"
    ).length;

  const inTransit =
    packets.filter(
      (packet) =>
        packet.status === "in-transit"
    ).length;

  const pending =
    packets.filter(
      (packet) =>
        packet.status === "generated"
    ).length;

  const completed =
    delivered + lost;

  const deliveryRate =
    generated > 0
      ? (
          (delivered / generated) *
          100
        ).toFixed(1)
      : "0.0";

  const lossRate =
    generated > 0
      ? (
          (lost / generated) *
          100
        ).toFixed(1)
      : "0.0";

  /*
   * Calculate total hops completed.
   *
   * currentHop represents the packet's
   * current position in its route.
   */
  const totalHops =
    packets.reduce(
      (total, packet) => {
        const hops =
          Number(packet.currentHop) || 0;

        return total + hops;
      },
      0
    );

  /*
   * Average delay.
   *
   * The packet engine can provide:
   *
   * packet.delay
   * packet.totalDelay
   * packet.deliveryTime
   *
   * We support all three so the
   * statistics panel remains flexible.
   */
  const delayValues =
    packets
      .map((packet) => {
        if (
          typeof packet.totalDelay ===
          "number"
        ) {
          return packet.totalDelay;
        }

        if (
          typeof packet.delay ===
          "number"
        ) {
          return packet.delay;
        }

        if (
          typeof packet.deliveryTime ===
            "number" &&
          typeof packet.createdAt ===
            "number"
        ) {
          return (
            packet.deliveryTime -
            packet.createdAt
          );
        }

        return null;
      })
      .filter(
        (value) =>
          value !== null &&
          Number.isFinite(value)
      );

  const averageDelay =
    delayValues.length > 0
      ? (
          delayValues.reduce(
            (sum, value) =>
              sum + value,
            0
          ) /
          delayValues.length
        ).toFixed(0)
      : "—";

  return (
    <div className="panel statistics-panel">
      <div className="statistics-header">
        <div>
          <h3>
            Network Statistics
          </h3>

          <span className="panel-subtitle">
            Live network and packet
            simulation metrics
          </span>
        </div>
      </div>

      {/* =========================================
          NETWORK OVERVIEW
          ========================================= */}

      <div className="statistics-section">
        <div className="statistics-section-title">
          Network
        </div>

        <div className="statistics-grid">
          <div className="stat-card">
            <span className="stat-label">
              Routers
            </span>

            <strong className="stat-value">
              {nodeCount}
            </strong>
          </div>

          <div className="stat-card">
            <span className="stat-label">
              Links
            </span>

            <strong className="stat-value">
              {edgeCount}
            </strong>
          </div>
        </div>
      </div>

      {/* =========================================
          PACKET OVERVIEW
          ========================================= */}

      <div className="statistics-section">
        <div className="statistics-section-title">
          Packets
        </div>

        <div className="statistics-grid">
          <div className="stat-card">
            <span className="stat-label">
              Generated
            </span>

            <strong className="stat-value">
              {generated}
            </strong>
          </div>

          <div className="stat-card">
            <span className="stat-label">
              Delivered
            </span>

            <strong className="stat-value stat-success">
              {delivered}
            </strong>
          </div>

          <div className="stat-card">
            <span className="stat-label">
              Lost
            </span>

            <strong className="stat-value stat-danger">
              {lost}
            </strong>
          </div>

          <div className="stat-card">
            <span className="stat-label">
              In Transit
            </span>

            <strong className="stat-value stat-info">
              {inTransit}
            </strong>
          </div>
        </div>
      </div>

      {/* =========================================
          PERFORMANCE
          ========================================= */}

      <div className="statistics-section">
        <div className="statistics-section-title">
          Performance
        </div>

        <div className="statistics-grid">
          <div className="stat-card">
            <span className="stat-label">
              Delivery Rate
            </span>

            <strong className="stat-value">
              {deliveryRate}%
            </strong>
          </div>

          <div className="stat-card">
            <span className="stat-label">
              Loss Rate
            </span>

            <strong className="stat-value">
              {lossRate}%
            </strong>
          </div>

          <div className="stat-card">
            <span className="stat-label">
              Total Hops
            </span>

            <strong className="stat-value">
              {totalHops}
            </strong>
          </div>

          <div className="stat-card">
            <span className="stat-label">
              Avg. Delay
            </span>

            <strong className="stat-value">
              {averageDelay === "—"
                ? "—"
                : `${averageDelay} ms`}
            </strong>
          </div>
        </div>
      </div>

      {/* =========================================
          STATUS
          ========================================= */}

      <div className="statistics-status">
        {generated === 0 ? (
          <>
            <span className="status-dot idle" />

            <span>
              No packet simulation
              data yet.
            </span>
          </>
        ) : completed === generated ? (
          <>
            <span className="status-dot complete" />

            <span>
              Simulation completed.
            </span>
          </>
        ) : (
          <>
            <span className="status-dot running" />

            <span>
              Simulation in progress.
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default StatisticsPanel;
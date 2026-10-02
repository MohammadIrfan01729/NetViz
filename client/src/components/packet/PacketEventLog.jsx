function PacketEventLog({
  events = [],
}) {
  if (events.length === 0) {
    return (
      <div className="panel packet-event-log">
        <div className="panel-header">
          <div>
            <h3>
              Packet Event Log
            </h3>

            <span className="panel-subtitle">
              Simulation events
            </span>
          </div>
        </div>

        <div className="packet-event-empty">
          No packet events yet.
          <br />
          Generate and simulate packets
          to see events here.
        </div>
      </div>
    );
  }

  return (
    <div className="panel packet-event-log">
      <div className="panel-header">
        <div>
          <h3>
            Packet Event Log
          </h3>

          <span className="panel-subtitle">
            {events.length} event
            {events.length === 1
              ? ""
              : "s"}
          </span>
        </div>
      </div>

      <div className="event-log-list">
        {[...events]
          .reverse()
          .map((event) => (
            <div
              className={`event-log-item event-${event.type}`}
              key={event.id}
            >
              <div className="event-log-time">
                {event.time}
              </div>

              <div className="event-log-content">
                <div className="event-log-message">
                  {event.message}
                </div>

                {event.packetId && (
                  <div className="event-log-packet">
                    {event.packetId}
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default PacketEventLog;
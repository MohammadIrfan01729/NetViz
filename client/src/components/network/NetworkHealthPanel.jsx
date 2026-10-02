function NetworkHealthPanel({ nodes = [], edges = [], packets = [] }) {
    const failedRouters = nodes.filter((node) => node.data?.failed).length;
    const activeRouters = nodes.length - failedRouters;

    const failedLinks = edges.filter((edge) => edge.data?.failed).length;
    const activeLinks = edges.length - failedLinks;

    const activePackets = packets.filter(
        (packet) => packet.status !== "delivered" && packet.status !== "lost"
    ).length;
    const deliveredPackets = packets.filter(
        (packet) => packet.status === "delivered"
    ).length;
    const lostPackets = packets.filter(
        (packet) => packet.status === "lost"
    ).length;

    const packetTotal = packets.length;
    const deliveryRate = packetTotal
        ? (deliveredPackets / packetTotal) * 100
        : 0;
    const lossRate = packetTotal
        ? (lostPackets / packetTotal) * 100
        : 0;

    const edgeLoads = edges.map((edge) => {
        const load = packets.filter((packet) => {
            if (packet.status === "delivered" || packet.status === "lost") {
                return false;
            }
            const current = packet.path?.[packet.currentHop];
            const next = packet.path?.[packet.currentHop + 1];
            return (
                (current === edge.source && next === edge.target) ||
                (current === edge.target && next === edge.source)
            );
        }).length;
        return { edge, load };
    });

    const congestedLinks = edgeLoads.filter(
        ({ edge, load }) => !edge.data?.failed && load >= 3
    ).length;

    const deliveredWithDelay = packets.filter(
        (packet) => packet.status === "delivered" && Number.isFinite(Number(packet.delay))
    );
    const averageDelay = deliveredWithDelay.length
        ? deliveredWithDelay.reduce((sum, packet) => sum + Number(packet.delay || 0), 0) /
        deliveredWithDelay.length
        : 0;

    let status = "Healthy";
    let statusClass = "healthy";

    if (
        nodes.length === 0 ||
        activeRouters === 0 ||
        (edges.length > 0 && activeLinks === 0)
    ) {
        status = "Critical";
        statusClass = "critical";
    } else if (failedRouters > 0 || failedLinks > 0 || congestedLinks > 0 || lossRate > 20) {
        status = "Warning";
        statusClass = "warning";
    }

    return (
        <div className="netviz-feature-panel network-health-panel">
            <div className="feature-panel-header">
                <div>
                    <h3>Network Health</h3>
                    <span>Live operational state of the simulated network</span>
                </div>
                <div className={`health-status health-${statusClass}`}>
                    <span />
                    {status}
                </div>
            </div>

            <div className="health-grid">
                <div className="health-card"><span>Active Routers</span><strong>{activeRouters}</strong><small>{failedRouters} failed</small></div>
                <div className="health-card"><span>Active Links</span><strong>{activeLinks}</strong><small>{failedLinks} failed</small></div>
                <div className="health-card"><span>Congested Links</span><strong>{congestedLinks}</strong><small>3+ active packets</small></div>
                <div className="health-card"><span>Active Packets</span><strong>{activePackets}</strong><small>{packetTotal} total</small></div>
                <div className="health-card"><span>Delivery Rate</span><strong>{deliveryRate.toFixed(1)}%</strong><small>{deliveredPackets} delivered</small></div>
                <div className="health-card"><span>Loss Rate</span><strong>{lossRate.toFixed(1)}%</strong><small>{lostPackets} lost</small></div>
                <div className="health-card"><span>Average Delay</span><strong>{averageDelay.toFixed(1)} ms</strong><small>delivered packets</small></div>
                <div className="health-card"><span>Topology Size</span><strong>{nodes.length} / {edges.length}</strong><small>routers / links</small></div>
            </div>

            <div className="feature-panel-note">
                <strong>Health interpretation</strong>
                <span>Failures, congestion and packet loss are reflected immediately from the current simulator state.</span>
            </div>
        </div>
    );
}

export default NetworkHealthPanel;

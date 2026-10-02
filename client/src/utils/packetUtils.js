export function createPacket({
  id,
  source,
  destination,
  path,
  size,
}) {
  return {
    id,
    source,
    destination,
    path: Array.isArray(path) ? [...path] : [],
    size: Math.max(0, Number(size) || 0),

    currentHop: 0,
    currentNode: source,

    status: "generated",

    createdAt: Date.now(),
    deliveredAt: null,
    lostAt: null,

    delay: 0,
    actualEndToEndDelay: 0,
    estimatedEndToEndDelay: 0,

    linkDelay: 0,
    transmissionDelay: 0,
    transmissionTime: 0,
    queueingDelay: 0,
    totalLinkDelay: 0,

    bandwidth: 0,
    averageBandwidth: 0,
    minimumBandwidth: 0,
    maximumBandwidth: 0,
    bottleneckBandwidth: 0,
    activePackets: 0,
    queuePosition: 0,
    congestionLevel: "low",

    hopsCompleted: 0,

    rerouteCount: 0,
    reroutedAt: null,
    rerouteReason: null,

    lossProbability: 0,
    lossReason: null,
  };
}
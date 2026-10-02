import {
  useEffect,
  useRef,
} from "react";


function usePacketEngine({
  packets,
  setPackets,
  edges,
  nodes = [],
  isSimulating,
  setIsSimulating,
}) {

  const timersRef = useRef(new Map());


  // =========================================================
  // NETWORK LOOKUPS
  // =========================================================

  const findEdge = (
    source,
    target
  ) => {
    return edges.find(
      (edge) =>
        !edge.data?.failed &&
        edge.source !== undefined &&
        edge.target !== undefined &&
        (
          (
            edge.source === source &&
            edge.target === target
          ) ||
          (
            edge.source === target &&
            edge.target === source
          )
        )
    );
  };


  const isRouterFailed = (
    routerId
  ) => {
    return Boolean(
      nodes.find(
        (node) =>
          node.id === routerId &&
          node.data?.failed
      )
    );
  };


  // =========================================================
  // SHORTEST OPERATIONAL PATH
  // =========================================================
  // Used when a link/router failure makes the current route
  // unavailable.
  // =========================================================

  const findOperationalPath = (
    source,
    destination
  ) => {

    if (
      !source ||
      !destination
    ) {
      return [];
    }

    if (
      isRouterFailed(source) ||
      isRouterFailed(destination)
    ) {
      return [];
    }

    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set();

    nodes.forEach((node) => {
      if (!node.data?.failed) {
        distances.set(node.id, Infinity);
        unvisited.add(node.id);
      }
    });

    if (
      !distances.has(source) ||
      !distances.has(destination)
    ) {
      return [];
    }

    distances.set(source, 0);

    while (unvisited.size > 0) {

      let current = null;
      let currentDistance = Infinity;

      unvisited.forEach((nodeId) => {
        const distance = distances.get(nodeId);

        if (distance < currentDistance) {
          currentDistance = distance;
          current = nodeId;
        }
      });

      if (current === null) {
        break;
      }

      if (current === destination) {
        break;
      }

      unvisited.delete(current);

      edges.forEach((edge) => {

        if (edge.data?.failed) {
          return;
        }

        let neighbour = null;

        if (edge.source === current) {
          neighbour = edge.target;
        } else if (edge.target === current) {
          neighbour = edge.source;
        }

        if (
          !neighbour ||
          isRouterFailed(neighbour) ||
          !unvisited.has(neighbour)
        ) {
          return;
        }

        const cost = Math.max(
          0.0001,
          Number(edge.data?.cost) || 1
        );

        const candidate =
          currentDistance + cost;

        if (
          candidate <
          distances.get(neighbour)
        ) {
          distances.set(
            neighbour,
            candidate
          );

          previous.set(
            neighbour,
            current
          );
        }
      });
    }

    if (
      !previous.has(destination) &&
      source !== destination
    ) {
      return [];
    }

    const path = [destination];
    let current = destination;

    while (current !== source) {
      current = previous.get(current);

      if (!current) {
        return [];
      }

      path.unshift(current);
    }

    return path;
  };


  // =========================================================
  // PACKET LOSS
  // =========================================================

  const shouldPacketBeLost = (
    packetLoss
  ) => {

    const loss = Math.max(
      0,
      Math.min(
        100,
        Number(packetLoss) || 0
      )
    );

    if (loss === 0) {
      return false;
    }

    return Math.random() * 100 < loss;
  };


  // =========================================================
  // TRANSMISSION DELAY
  // =========================================================

  const calculateTransmissionTime = (
    packetSize,
    bandwidth
  ) => {

    const size = Math.max(
      0,
      Number(packetSize) || 0
    );

    const speed = Math.max(
      0.001,
      Number(bandwidth) || 1
    );

    const bits = size * 8;
    const bitsPerSecond = speed * 1_000_000;
    const seconds = bits / bitsPerSecond;

    return seconds * 1000;
  };


  // =========================================================
  // BANDWIDTH ANALYSIS
  // =========================================================

  const getBandwidthMetrics = (
    path
  ) => {

    if (!Array.isArray(path) || path.length < 2) {
      return {
        average: 0,
        minimum: 0,
        maximum: 0,
        bottleneck: 0,
      };
    }

    const values = [];

    for (let index = 0; index < path.length - 1; index += 1) {

      const edge = findEdge(
        path[index],
        path[index + 1]
      );

      if (!edge) {
        continue;
      }

      const bandwidth = Math.max(
        0.001,
        Number(edge.data?.bandwidth) || 1
      );

      values.push(bandwidth);
    }

    if (values.length === 0) {
      return {
        average: 0,
        minimum: 0,
        maximum: 0,
        bottleneck: 0,
      };
    }

    const total = values.reduce(
      (sum, value) => sum + value,
      0
    );

    const minimum = Math.min(...values);
    const maximum = Math.max(...values);

    return {
      average: total / values.length,
      minimum,
      maximum,
      bottleneck: minimum,
    };
  };


  // =========================================================
  // CONGESTION ANALYSIS
  // =========================================================

  const getQueueMetrics = (
    packet
  ) => {

    const currentNode =
      packet.path?.[packet.currentHop];

    const nextNode =
      packet.path?.[packet.currentHop + 1];

    if (!currentNode || !nextNode) {
      return {
        activePackets: 1,
        queuePosition: 1,
        queueingDelay: 0,
        congestionLevel: "low",
      };
    }

    const activePackets = packets.filter(
      (candidate) => {

        if (
          candidate.id === packet.id ||
          candidate.status === "delivered" ||
          candidate.status === "lost"
        ) {
          return false;
        }

        const candidateCurrent =
          candidate.path?.[candidate.currentHop];

        const candidateNext =
          candidate.path?.[candidate.currentHop + 1];

        return (
          (
            candidateCurrent === currentNode &&
            candidateNext === nextNode
          ) ||
          (
            candidateCurrent === nextNode &&
            candidateNext === currentNode
          )
        );
      }
    ).length + 1;

    const queuePosition =
      activePackets;

    let congestionLevel = "low";

    if (activePackets >= 6) {
      congestionLevel = "high";
    } else if (activePackets >= 3) {
      congestionLevel = "medium";
    }

    return {
      activePackets,
      queuePosition,
      congestionLevel,
    };
  };


  // =========================================================
  // MAIN ENGINE
  // =========================================================

  useEffect(() => {

    if (
      !isSimulating ||
      packets.length === 0
    ) {
      return;
    }

    packets.forEach((packet) => {

      if (
        packet.status === "delivered" ||
        packet.status === "lost"
      ) {
        return;
      }

      if (
        timersRef.current.has(packet.id)
      ) {
        return;
      }

      // -----------------------------------------------------
      // DESTINATION REACHED
      // -----------------------------------------------------

      if (
        packet.currentHop >=
        packet.path.length - 1
      ) {

        const deliveredAt = Date.now();

        setPackets((currentPackets) =>
          currentPackets.map((currentPacket) => {

            if (
              currentPacket.id !== packet.id
            ) {
              return currentPacket;
            }

            const actualDelay =
              Number(currentPacket.delay) || 0;

            return {
              ...currentPacket,
              currentNode:
                currentPacket.destination,
              status: "delivered",
              deliveredAt,
              actualEndToEndDelay:
                actualDelay,
            };
          })
        );

        return;
      }

      // -----------------------------------------------------
      // FAILED CURRENT ROUTER
      // -----------------------------------------------------

      const currentNode =
        packet.path?.[packet.currentHop];

      if (isRouterFailed(currentNode)) {

        setPackets((currentPackets) =>
          currentPackets.map((currentPacket) =>
            currentPacket.id === packet.id
              ? {
                  ...currentPacket,
                  status: "lost",
                  lossReason:
                    `Router ${currentNode} failed while carrying the packet`,
                  lostAt: Date.now(),
                }
              : currentPacket
          )
        );

        return;
      }

      const nextNode =
        packet.path?.[packet.currentHop + 1];

      // -----------------------------------------------------
      // TRY CURRENT LINK
      // -----------------------------------------------------

      const edge = findEdge(
        currentNode,
        nextNode
      );

      // -----------------------------------------------------
      // LINK FAILURE / ROUTER FAILURE
      // -----------------------------------------------------

      if (
        !edge ||
        isRouterFailed(nextNode)
      ) {

        const reroutedPath =
          findOperationalPath(
            currentNode,
            packet.destination
          );

        if (
          reroutedPath.length > 1
        ) {

          setPackets((currentPackets) =>
            currentPackets.map((currentPacket) =>
              currentPacket.id === packet.id
                ? {
                    ...currentPacket,
                    path: reroutedPath,
                    currentHop: 0,
                    currentNode,
                    status: "generated",
                    rerouteCount:
                      (Number(currentPacket.rerouteCount) || 0) + 1,
                    reroutedAt: Date.now(),
                    rerouteReason:
                      !edge
                        ? `Link ${currentNode} → ${nextNode} failed`
                        : `Router ${nextNode} failed`,
                  }
                : currentPacket
            )
          );

          return;
        }

        setPackets((currentPackets) =>
          currentPackets.map((currentPacket) =>
            currentPacket.id === packet.id
              ? {
                  ...currentPacket,
                  status: "lost",
                  lossReason:
                    !edge
                      ? `Link ${currentNode} → ${nextNode} failed and no alternate route exists`
                      : `Router ${nextNode} failed and no alternate route exists`,
                  lostAt: Date.now(),
                }
              : currentPacket
          )
        );

        return;
      }

      // -----------------------------------------------------
      // LINK PARAMETERS
      // -----------------------------------------------------

      const linkDelay = Math.max(
        0,
        Number(edge.data?.delay) || 0
      );

      const bandwidth = Math.max(
        0.001,
        Number(edge.data?.bandwidth) || 1
      );

      const packetLoss = Math.max(
        0,
        Math.min(
          100,
          Number(edge.data?.packetLoss) || 0
        )
      );

      const transmissionTime =
        calculateTransmissionTime(
          packet.size,
          bandwidth
        );

      // -----------------------------------------------------
      // CONGESTION / QUEUEING DELAY
      // -----------------------------------------------------

      const queueMetrics =
        getQueueMetrics(packet);

      const queueingDelay =
        transmissionTime *
        Math.max(
          0,
          queueMetrics.queuePosition - 1
        );

      const actualDelay =
        linkDelay +
        transmissionTime +
        queueingDelay;

      // -----------------------------------------------------
      // PACKET LOSS
      // -----------------------------------------------------

      if (
        shouldPacketBeLost(packetLoss)
      ) {

        const lossTimer = setTimeout(() => {

          timersRef.current.delete(
            packet.id
          );

          setPackets((currentPackets) =>
            currentPackets.map((currentPacket) =>
              currentPacket.id === packet.id
                ? {
                    ...currentPacket,
                    status: "lost",
                    currentNode,
                    linkDelay,
                    bandwidth,
                    transmissionDelay:
                      transmissionTime,
                    queueingDelay,
                    totalLinkDelay:
                      actualDelay,
                    congestionLevel:
                      queueMetrics.congestionLevel,
                    activePackets:
                      queueMetrics.activePackets,
                    lossProbability:
                      packetLoss,
                    lossReason:
                      `Packet dropped on ${currentNode} → ${nextNode} (${packetLoss}% loss)`,
                    lostAt: Date.now(),
                  }
                : currentPacket
            )
          );

        }, Math.max(300, Math.min(3000, actualDelay * 10)));

        timersRef.current.set(
          packet.id,
          lossTimer
        );

        return;
      }

      // -----------------------------------------------------
      // BANDWIDTH SUMMARY
      // -----------------------------------------------------

      const bandwidthMetrics =
        getBandwidthMetrics(packet.path);

      // -----------------------------------------------------
      // MARK IN TRANSIT
      // -----------------------------------------------------

      setPackets((currentPackets) =>
        currentPackets.map((currentPacket) =>
          currentPacket.id === packet.id
            ? {
                ...currentPacket,
                status: "in-transit",
                currentNode,
                linkDelay,
                bandwidth,
                transmissionDelay:
                  transmissionTime,
                queueingDelay,
                totalLinkDelay:
                  actualDelay,
                congestionLevel:
                  queueMetrics.congestionLevel,
                activePackets:
                  queueMetrics.activePackets,
                queuePosition:
                  queueMetrics.queuePosition,
                lossProbability:
                  packetLoss,
                averageBandwidth:
                  bandwidthMetrics.average,
                minimumBandwidth:
                  bandwidthMetrics.minimum,
                maximumBandwidth:
                  bandwidthMetrics.maximum,
                bottleneckBandwidth:
                  bandwidthMetrics.bottleneck,
                estimatedEndToEndDelay:
                  packet.path.reduce((total, node, index) => {
                    if (index >= packet.path.length - 1) {
                      return total;
                    }

                    const routeEdge = findEdge(
                      node,
                      packet.path[index + 1]
                    );

                    if (!routeEdge) {
                      return total;
                    }

                    const routeDelay = Math.max(
                      0,
                      Number(routeEdge.data?.delay) || 0
                    );

                    const routeBandwidth = Math.max(
                      0.001,
                      Number(routeEdge.data?.bandwidth) || 1
                    );

                    const routeTransmission =
                      ((Number(packet.size) || 0) * 8 /
                        (routeBandwidth * 1_000_000)) *
                      1000;

                    return total +
                      routeDelay +
                      routeTransmission;
                  }, 0),
              }
            : currentPacket
        )
      );

      const simulationDelay = Math.max(
        300,
        Math.min(
          3000,
          actualDelay * 10
        )
      );

      // -----------------------------------------------------
      // COMPLETE CURRENT HOP
      // -----------------------------------------------------

      const timer = setTimeout(() => {

        timersRef.current.delete(
          packet.id
        );

        // Re-check failures when the packet
        // reaches the end of the simulated hop.
        const liveEdge = findEdge(
          currentNode,
          nextNode
        );

        const nextRouterFailed =
          isRouterFailed(nextNode);

        if (
          !liveEdge ||
          nextRouterFailed
        ) {

          const reroutedPath =
            findOperationalPath(
              currentNode,
              packet.destination
            );

          if (
            reroutedPath.length > 1
          ) {

            setPackets((currentPackets) =>
              currentPackets.map((currentPacket) =>
                currentPacket.id === packet.id
                  ? {
                      ...currentPacket,
                      path: reroutedPath,
                      currentHop: 0,
                      currentNode,
                      status: "generated",
                      rerouteCount:
                        (Number(currentPacket.rerouteCount) || 0) + 1,
                      reroutedAt: Date.now(),
                      rerouteReason:
                        !liveEdge
                          ? `Link ${currentNode} → ${nextNode} failed during transmission`
                          : `Router ${nextNode} failed during transmission`,
                    }
                  : currentPacket
              )
            );

            return;
          }

          setPackets((currentPackets) =>
            currentPackets.map((currentPacket) =>
              currentPacket.id === packet.id
                ? {
                    ...currentPacket,
                    status: "lost",
                    lossReason:
                      !liveEdge
                        ? `Link ${currentNode} → ${nextNode} failed during transmission`
                        : `Router ${nextNode} failed during transmission`,
                    lostAt: Date.now(),
                  }
                : currentPacket
            )
          );

          return;
        }

        setPackets((currentPackets) =>
          currentPackets.map((currentPacket) =>
            currentPacket.id === packet.id
              ? {
                  ...currentPacket,
                  currentHop:
                    currentPacket.currentHop + 1,
                  currentNode: nextNode,
                  delay:
                    (Number(currentPacket.delay) || 0) +
                    actualDelay,
                  transmissionTime:
                    (Number(currentPacket.transmissionTime) || 0) +
                    transmissionTime,
                  queueingDelay:
                    (Number(currentPacket.queueingDelay) || 0) +
                    queueingDelay,
                  hopsCompleted:
                    (Number(currentPacket.hopsCompleted) || 0) +
                    1,
                  status: "in-transit",
                }
              : currentPacket
          )
        );

      }, simulationDelay);

      timersRef.current.set(
        packet.id,
        timer
      );

    });

  }, [
    packets,
    edges,
    nodes,
    isSimulating,
    setPackets,
    setIsSimulating,
  ]);


  // =========================================================
  // STOP WHEN ALL PACKETS FINISH
  // =========================================================

  useEffect(() => {

    if (
      !isSimulating ||
      packets.length === 0
    ) {
      return;
    }

    const allFinished =
      packets.every(
        (packet) =>
          packet.status === "delivered" ||
          packet.status === "lost"
      );

    if (allFinished) {
      setIsSimulating(false);
    }

  }, [
    packets,
    isSimulating,
    setIsSimulating,
  ]);


  // =========================================================
  // CLEAR TIMERS WHEN SIMULATION STOPS
  // =========================================================

  useEffect(() => {

    if (isSimulating) {
      return;
    }

    timersRef.current.forEach(
      (timer) => clearTimeout(timer)
    );

    timersRef.current.clear();

  }, [isSimulating]);


  // =========================================================
  // COMPONENT CLEANUP
  // =========================================================

  useEffect(() => {

    return () => {

      timersRef.current.forEach(
        (timer) => clearTimeout(timer)
      );

      timersRef.current.clear();

    };

  }, []);
}


export default usePacketEngine;
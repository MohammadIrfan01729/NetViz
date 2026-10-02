import {
  useEffect,
  useRef,
  useState,
} from "react";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import DashboardModulePanel from "../components/layout/DashboardModulePanel";

import NetworkCanvas from "../components/network/NetworkCanvas";
import NetworkHealthPanel from "../components/network/NetworkHealthPanel";
import NetworkModelPanel from "../components/network/NetworkModelPanel";
import TopologyPresetsPanel from "../components/network/TopologyPresetsPanel";

import { buildGraph } from "../utils/graphUtils";

import { dijkstra } from "../algorithms/dijkstra";
import { bellmanFord } from "../algorithms/bellmanFord";
import { distanceVector } from "../algorithms/distanceVector";
import { linkState } from "../algorithms/linkState";

import { buildRoutingTable } from "../utils/routingTable";

import { createPacket } from "../utils/packetUtils";

import usePacketEngine from "../hooks/usePacketEngine";


function Simulator() {

  const [nodes, setNodes] =
    useState([]);

  const [edges, setEdges] =
    useState([]);

  const [linkMode, setLinkMode] =
    useState(false);

  const [selectedEdge, setSelectedEdge] =
    useState(null);

  const [routeRequest, setRouteRequest] =
    useState(null);

  const [packets, setPackets] =
    useState([]);

  const [isSimulating, setIsSimulating] =
    useState(false);

  const [eventLog, setEventLog] =
    useState([]);

  const previousPacketsRef =
    useRef([]);

  const [activeModule, setActiveModule] =
    useState("overview");

  const [selectedPacketId, setSelectedPacketId] =
    useState(null);

  const [selectedNode, setSelectedNode] =
    useState(null);

  const [bottomPanelHeight, setBottomPanelHeight] =
    useState(390);

  const resizeState = useRef({
    active: false,
    startY: 0,
    startHeight: 390,
  });


  const clampBottomPanelHeight = (
    height
  ) => {
    const minHeight = 230;

    const maxHeight = Math.max(
      430,
      Math.min(
        650,
        window.innerHeight - 190
      )
    );

    return Math.min(
      maxHeight,
      Math.max(
        minHeight,
        height
      )
    );
  };


  const handleResizePointerDown = (
    event
  ) => {
    event.preventDefault();

    resizeState.current = {
      active: true,
      startY: event.clientY,
      startHeight:
        bottomPanelHeight,
    };

    document.body.style.userSelect =
      "none";

    document.body.style.cursor =
      "row-resize";


    const handlePointerMove = (
      moveEvent
    ) => {
      if (
        !resizeState.current.active
      ) {
        return;
      }

      const deltaY =
        moveEvent.clientY -
        resizeState.current.startY;

      setBottomPanelHeight(
        clampBottomPanelHeight(
          resizeState.current.startHeight -
          deltaY
        )
      );
    };


    const handlePointerUp = () => {
      resizeState.current.active =
        false;

      document.body.style.userSelect =
        "";

      document.body.style.cursor =
        "";

      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      window.removeEventListener(
        "pointerup",
        handlePointerUp
      );
    };


    window.addEventListener(
      "pointermove",
      handlePointerMove
    );

    window.addEventListener(
      "pointerup",
      handlePointerUp
    );
  };


  const handleResizeKeyDown = (
    event
  ) => {
    const step = 20;

    if (
      event.key === "ArrowUp" ||
      event.key === "ArrowDown"
    ) {
      event.preventDefault();

      const direction =
        event.key === "ArrowUp"
          ? 1
          : -1;

      setBottomPanelHeight(
        (currentHeight) =>
          clampBottomPanelHeight(
            currentHeight +
            direction * step
          )
      );
    }

    if (event.key === "Home") {
      event.preventDefault();

      setBottomPanelHeight(
        clampBottomPanelHeight(230)
      );
    }

    if (event.key === "End") {
      event.preventDefault();

      setBottomPanelHeight(
        clampBottomPanelHeight(650)
      );
    }
  };


  usePacketEngine({
    packets,
    setPackets,
    edges,
    nodes,
    isSimulating,
    setIsSimulating,
  });


  useEffect(() => {

    const previousPackets =
      previousPacketsRef.current;

    const previousPacketMap =
      new Map(
        previousPackets.map(
          (packet) => [
            packet.id,
            packet,
          ]
        )
      );

    const newEvents = [];

    const currentTime =
      new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }
      );


    packets.forEach((packet) => {

      const previousPacket =
        previousPacketMap.get(
          packet.id
        );


      if (!previousPacket) {

        newEvents.push({
          id:
            `${packet.id}-created-${Date.now()}-${Math.random()}`,

          time:
            currentTime,

          packetId:
            packet.id,

          type:
            "created",

          message:
            `${packet.id} created at ${packet.source}`,
        });

        return;
      }


      if (
        previousPacket.status !==
        "lost" &&
        packet.status ===
        "lost"
      ) {

        const currentHop =
          Number(
            packet.currentHop
          ) || 0;

        const from =
          packet.path?.[
          currentHop
          ] ??
          packet.source;

        const to =
          packet.path?.[
          currentHop + 1
          ] ??
          "unknown";

        newEvents.push({
          id:
            `${packet.id}-lost-${Date.now()}-${Math.random()}`,

          time:
            currentTime,

          packetId:
            packet.id,

          type:
            "lost",

          message:
            `${packet.id} lost on ${from} → ${to}`,
        });

        return;
      }


      if (
        previousPacket.status !==
        "delivered" &&
        packet.status ===
        "delivered"
      ) {

        newEvents.push({
          id:
            `${packet.id}-delivered-${Date.now()}-${Math.random()}`,

          time:
            currentTime,

          packetId:
            packet.id,

          type:
            "delivered",

          message:
            `${packet.id} delivered at ${packet.destination}`,
        });

        return;
      }


      const previousHop =
        Number(
          previousPacket.currentHop
        ) || 0;

      const currentHop =
        Number(
          packet.currentHop
        ) || 0;


      if (
        currentHop >
        previousHop &&
        packet.path &&
        packet.path.length >
        currentHop
      ) {

        const from =
          packet.path[
          currentHop - 1
          ];

        const to =
          packet.path[
          currentHop
          ];

        newEvents.push({
          id:
            `${packet.id}-hop-${currentHop}-${Date.now()}-${Math.random()}`,

          time:
            currentTime,

          packetId:
            packet.id,

          type:
            "forwarded",

          message:
            `${packet.id} forwarded ${from} → ${to}`,
        });
      }

    });


    if (
      newEvents.length > 0
    ) {
      setEventLog(
        (currentEvents) => [
          ...currentEvents,
          ...newEvents,
        ]
      );
    }


    previousPacketsRef.current =
      packets;

  }, [packets]);


  const addRouter = () => {

    setNodes(
      (currentNodes) => {

        const routerNumbers =
          currentNodes.map(
            (node) => {

              const match =
                node.id.match(
                  /^R(\d+)$/
                );

              return match
                ? Number(match[1])
                : 0;
            }
          );

        const highestNumber =
          routerNumbers.length > 0
            ? Math.max(
              ...routerNumbers
            )
            : 0;

        const routerNumber =
          highestNumber + 1;

        const newNode = {

          id:
            `R${routerNumber}`,

          type:
            "router",

          position: {

            x:
              200 +
              (currentNodes.length % 4) *
              180,

            y:
              100 +
              Math.floor(
                currentNodes.length / 4
              ) *
              150,

          },

          data: {
            label:
              `R${routerNumber}`,
          },
        };

        return [
          ...currentNodes,
          newNode,
        ];
      }
    );

    setRouteRequest(null);
    setSelectedEdge(null);
  };


  const clearNetwork = () => {

    setNodes([]);
    setEdges([]);

    setLinkMode(false);
    setSelectedEdge(null);

    setRouteRequest(null);

    setPackets([]);
    setIsSimulating(false);

    setEventLog([]);

    setSelectedPacketId(null);
    setSelectedNode(null);
    setActiveModule("overview");

    previousPacketsRef.current =
      [];
  };


  const startLinkMode = () => {

    if (
      nodes.length < 2
    ) {
      alert(
        "Add at least two routers first."
      );

      return;
    }

    setSelectedEdge(null);

    setActiveModule(
      "link-properties"
    );

    setLinkMode(
      (current) =>
        !current
    );
  };


  const handleEdgeSelect = (
    edge
  ) => {

    setSelectedNode(null);
    setSelectedEdge(edge);

    setActiveModule(
      "link-properties"
    );
  };


  const handleNodeSelect = (node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
    setActiveModule("network-model");
  };


  const updateNodeModel = (updatedNode) => {
    setNodes((currentNodes) =>
      currentNodes.map((node) =>
        node.id === updatedNode.id ? updatedNode : node
      )
    );

    setSelectedNode(updatedNode);
    setRouteRequest(null);
    setPackets([]);
    setIsSimulating(false);
    setSelectedPacketId(null);
    setEventLog([]);
    previousPacketsRef.current = [];
  };


  const loadTopologyPreset = (presetId, preset) => {
    if (isSimulating) {
      alert("Stop the current simulation before loading a topology preset.");
      return;
    }

    const clonedNodes = preset.nodes.map((node) => ({
      ...node,
      position: { ...node.position },
      data: { ...node.data },
    }));

    const clonedEdges = preset.edges.map((edge) => ({
      ...edge,
      data: { ...edge.data },
      style: { ...edge.style },
    }));

    setNodes(clonedNodes);
    setEdges(clonedEdges);
    setPackets([]);
    setIsSimulating(false);
    setRouteRequest(null);
    setSelectedEdge(null);
    setSelectedNode(null);
    setSelectedPacketId(null);
    setEventLog([]);
    previousPacketsRef.current = [];
    setLinkMode(false);
    setActiveModule("topology-presets");

    console.info(`Loaded topology preset: ${presetId}`);
  };


  const updateEdge = (
    updatedEdge
  ) => {

    setEdges(
      (currentEdges) =>
        currentEdges.map(
          (edge) =>
            edge.id ===
              updatedEdge.id
              ? updatedEdge
              : edge
        )
    );

    setSelectedEdge(
      updatedEdge
    );

    setRouteRequest(null);

    setPackets([]);
    setIsSimulating(false);

    setSelectedPacketId(null);

    setEventLog([]);

    previousPacketsRef.current =
      [];
  };


  const deleteEdge = (
    edgeId
  ) => {

    setEdges(
      (currentEdges) =>
        currentEdges.filter(
          (edge) =>
            edge.id !== edgeId
        )
    );

    setSelectedEdge(null);
    setRouteRequest(null);

    setPackets([]);
    setIsSimulating(false);

    setSelectedPacketId(null);

    setEventLog([]);

    previousPacketsRef.current =
      [];

    setActiveModule(
      "overview"
    );
  };


  // =====================================================
  // OPERATIONAL NETWORK
  // =====================================================

  const getOperationalNetwork = () => {

    const failedRouters = new Set(
      nodes
        .filter((node) => node.data?.failed)
        .map((node) => node.id)
    );

    const operationalNodes =
      nodes.filter(
        (node) => !failedRouters.has(node.id)
      );

    const operationalEdges =
      edges.filter(
        (edge) =>
          !edge.data?.failed &&
          !failedRouters.has(edge.source) &&
          !failedRouters.has(edge.target)
      );

    return {
      nodes: operationalNodes,
      edges: operationalEdges,
    };
  };


  // =====================================================
  // LINK FAILURE
  // =====================================================

  const toggleEdgeFailure = (
    edgeId
  ) => {

    setEdges((currentEdges) =>
      currentEdges.map((edge) => {

        if (edge.id !== edgeId) {
          return edge;
        }

        return {
          ...edge,
          data: {
            ...edge.data,
            failed: !edge.data?.failed,
          },
        };
      })
    );

    setSelectedEdge(null);

    if (!isSimulating) {
      setRouteRequest(null);
      setPackets([]);
      setSelectedPacketId(null);
      setEventLog([]);
      previousPacketsRef.current = [];
    }
  };


  // =====================================================
  // ROUTER FAILURE
  // =====================================================

  const toggleRouterFailure = (
    routerId
  ) => {

    setNodes((currentNodes) =>
      currentNodes.map((node) =>
        node.id === routerId
          ? {
              ...node,
              data: {
                ...node.data,
                failed: !node.data?.failed,
              },
            }
          : node
      )
    );

    setSelectedEdge(null);

    if (!isSimulating) {
      setRouteRequest(null);
      setPackets([]);
      setSelectedPacketId(null);
      setEventLog([]);
      previousPacketsRef.current = [];
    }
  };


  // =====================================================
  // CALCULATE ROUTE
  // =====================================================

  const calculateRoute = (
    graph,
    source,
    destination,
    algorithm
  ) => {

    switch (algorithm) {

      case "bellman-ford":
        return bellmanFord(
          graph,
          source,
          destination
        );

      case "distance-vector":
        return distanceVector(
          graph,
          source,
          destination
        );

      case "link-state":
        return linkState(
          graph,
          source,
          destination
        );

      case "dijkstra":
      default:
        return dijkstra(
          graph,
          source,
          destination
        );
    }
  };


  const handleFindPath = (
    request
  ) => {

    const operationalNetwork =
      getOperationalNetwork();

    const graph =
      buildGraph(
        operationalNetwork.nodes,
        operationalNetwork.edges
      );

    const result =
      calculateRoute(
        graph,
        request.source,
        request.destination,
        request.algorithm
      );

    const routingTable =
      buildRoutingTable(
        graph,
        request.source,
        result
      );

    setRouteRequest({
      ...request,
      result,
      routingTable,
    });

    setSelectedEdge(null);

    setActiveModule(
      "routing"
    );
  };


  const handleGeneratePackets = ({
    source,
    destination,
    packetSize,
    packetCount,
  }) => {

    if (isSimulating) {
      alert(
        "A packet simulation is already running."
      );

      return;
    }

    const operationalNetwork =
      getOperationalNetwork();

    const graph =
      buildGraph(
        operationalNetwork.nodes,
        operationalNetwork.edges
      );

    const packetAlgorithm =
      routeRequest?.algorithm ||
      "dijkstra";

    const result =
      calculateRoute(
        graph,
        source,
        destination,
        packetAlgorithm
      );

    if (!result.reachable) {
      alert(
        `No route exists from ${source} to ${destination}.`
      );

      return;
    }

    const newPackets = [];

    const simulationId =
      Date.now();

    for (
      let i = 0;
      i < packetCount;
      i++
    ) {

      newPackets.push(
        createPacket({

          id:
            `P${simulationId}-${i + 1}`,

          source,
          destination,

          path:
            result.path,

          size:
            packetSize,
        })
      );
    }

    const routingTable =
      buildRoutingTable(
        graph,
        source,
        result
      );

    setRouteRequest({

      algorithm:
        packetAlgorithm,

      source,
      destination,

      result,
      routingTable,
    });

    setPackets((currentPackets) => [
      ...currentPackets,
      ...newPackets,
    ]);

    setSelectedEdge(null);

    setSelectedPacketId(
      newPackets[0]?.id ??
      null
    );

    setActiveModule(
      "packet-status"
    );
  };


  const startSimulation = () => {

    if (
      packets.length === 0
    ) {
      alert(
        "Generate packets before starting the simulation."
      );

      return;
    }

    if (isSimulating) {
      return;
    }

    const hasPendingPackets =
      packets.some(
        (packet) =>
          packet.status !==
          "delivered" &&
          packet.status !==
          "lost"
      );

    if (!hasPendingPackets) {
      alert(
        "Generate new packets before starting the simulation."
      );

      return;
    }

    setActiveModule(
      "packet-status"
    );

    setIsSimulating(
      true
    );
  };


  const handleModuleSelect = (
    moduleId
  ) => {

    setActiveModule(moduleId);

    if (moduleId === "network-model") {
      return;
    }

    if (moduleId !== "link-properties") {
      setSelectedEdge(null);
    }

    if (moduleId !== "network-model") {
      setSelectedNode(null);
    }
  };


  const handleCloseModule = () => {
    setActiveModule(
      "overview"
    );
  };


  const handleSelectPacket = (
    packetId
  ) => {

    setSelectedPacketId(
      packetId
    );

    setActiveModule(
      "packet-inspector"
    );
  };


  const selectedPacket =
    packets.find(
      (packet) =>
        packet.id ===
        selectedPacketId
    ) || null;


  return (
    <div className="simulator">

      <Navbar />


      <div className="simulator-body">

        <Sidebar
          onAddRouter={
            addRouter
          }

          onAddLink={
            startLinkMode
          }

          onClearNetwork={
            clearNetwork
          }

          onStartSimulation={
            startSimulation
          }

          onModuleSelect={
            handleModuleSelect
          }

          activeModule={
            activeModule
          }

          linkMode={
            linkMode
          }

          isSimulating={
            isSimulating
          }

          hasPackets={
            packets.length > 0
          }
        />


        <main className="workspace">

          <div className="canvas-section">

            <div className="network-feature-toolbar">
              <button
                type="button"
                className={activeModule === "network-health" ? "active" : ""}
                onClick={() => setActiveModule("network-health")}
              >
                Network Health
              </button>
              <button
                type="button"
                className={activeModule === "network-model" ? "active" : ""}
                onClick={() => setActiveModule("network-model")}
              >
                Network Modeling
              </button>
              <button
                type="button"
                className={activeModule === "topology-presets" ? "active" : ""}
                onClick={() => setActiveModule("topology-presets")}
              >
                Topology Presets
              </button>
            </div>

            <NetworkCanvas
              nodes={nodes}
              setNodes={setNodes}

              edges={edges}
              setEdges={setEdges}

              linkMode={linkMode}
              setLinkMode={setLinkMode}

              onEdgeSelect={handleEdgeSelect}

              onToggleEdgeFailure={
                toggleEdgeFailure
              }

              onToggleRouterFailure={
                toggleRouterFailure
              }

              onNodeSelect={
                handleNodeSelect
              }

              packets={
                packets
              }

              routePath={
                routeRequest?.result?.path ?? []
              }
            />

          </div>


          <button
            type="button"
            className="bottom-panel-resizer"

            aria-label="Resize dashboard panel"

            aria-valuemin="230"
            aria-valuemax="650"

            aria-valuenow={
              Math.round(
                bottomPanelHeight
              )
            }

            title="Drag to resize"

            onPointerDown={
              handleResizePointerDown
            }

            onKeyDown={
              handleResizeKeyDown
            }
          >

            <span className="resize-grip">
              <span />
              <span />
              <span />
            </span>

          </button>


          <div
            className="bottom-panel"

            style={{
              height:
                `${bottomPanelHeight}px`,

              flexBasis:
                `${bottomPanelHeight}px`,
            }}
          >

            {activeModule === "network-health" ? (

              <NetworkHealthPanel
                nodes={nodes}
                edges={edges}
                packets={packets}
              />

            ) : activeModule === "network-model" ? (

              <NetworkModelPanel
                selectedNode={selectedNode}
                selectedEdge={selectedEdge}
                onUpdateNode={updateNodeModel}
                onUpdateEdge={updateEdge}
                onClearSelection={() => {
                  setSelectedNode(null);
                  setSelectedEdge(null);
                }}
              />

            ) : activeModule === "topology-presets" ? (

              <TopologyPresetsPanel
                onLoadPreset={loadTopologyPreset}
                disabled={isSimulating}
              />

            ) : (

            <DashboardModulePanel

              activeModule={
                activeModule
              }

              nodes={
                nodes
              }

              edges={
                edges
              }

              packets={
                packets
              }

              isSimulating={
                isSimulating
              }

              eventLog={
                eventLog
              }

              selectedPacket={
                selectedPacket
              }

              selectedPacketId={
                selectedPacketId
              }

              selectedEdge={
                selectedEdge
              }

              routeRequest={
                routeRequest
              }

              onFindPath={
                handleFindPath
              }

              onGeneratePackets={
                handleGeneratePackets
              }

              onSelectPacket={
                handleSelectPacket
              }

              onUpdateEdge={
                updateEdge
              }

              onDeleteEdge={
                deleteEdge
              }

              onClose={
                handleCloseModule
              }

            />

            )}

          </div>

        </main>

      </div>

    </div>
  );
}

export default Simulator;

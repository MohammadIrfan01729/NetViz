import {
  useRef,
  useState,
} from "react";


import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";


import NetworkCanvas from "../components/network/NetworkCanvas";


import RoutingPanel from "../components/routing/RoutingPanel";
import RouteResult from "../components/routing/RouteResult";
import RoutingTable from "../components/routing/RoutingTable";


import LinkProperties from "../components/network/LinkProperties";


import StatisticsPanel from "../components/statistics/StatisticsPanel";


import PacketGenerator from "../components/packet/PacketGenerator";
import PacketStatus from "../components/packet/PacketStatus";


import { buildGraph } from "../utils/graphUtils";


import { dijkstra } from "../algorithms/dijkstra";
import { bellmanFord } from "../algorithms/bellmanFord";
import { distanceVector } from "../algorithms/distanceVector";
import { linkState } from "../algorithms/linkState";


import { buildRoutingTable } from "../utils/routingTable";


import { createPacket } from "../utils/packetUtils";


import usePacketEngine from "../hooks/usePacketEngine";


function Simulator() {

  // =====================================================
  // NETWORK STATE
  // =====================================================

  const [nodes, setNodes] =
    useState([]);

  const [edges, setEdges] =
    useState([]);

  const [linkMode, setLinkMode] =
    useState(false);

  const [selectedEdge, setSelectedEdge] =
    useState(null);


  // =====================================================
  // ROUTING STATE
  // =====================================================

  const [routeRequest, setRouteRequest] =
    useState(null);


  // =====================================================
  // PACKET STATE
  // =====================================================

  const [packets, setPackets] =
    useState([]);

  const [isSimulating, setIsSimulating] =
    useState(false);


  // =====================================================
  // RESIZABLE BOTTOM PANEL
  // =====================================================

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

      startY:
        event.clientY,

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


      const nextHeight =
        resizeState.current.startHeight -
        deltaY;


      setBottomPanelHeight(
        clampBottomPanelHeight(
          nextHeight
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
        clampBottomPanelHeight(
          230
        )
      );
    }


    if (event.key === "End") {

      event.preventDefault();


      setBottomPanelHeight(
        clampBottomPanelHeight(
          650
        )
      );
    }
  };


  // =====================================================
  // PACKET ENGINE
  // =====================================================

  usePacketEngine({
    packets,

    setPackets,

    edges,

    isSimulating,

    setIsSimulating,
  });


  // =====================================================
  // ADD ROUTER
  // =====================================================

  const addRouter = () => {

    setNodes(
      (currentNodes) => {

        /*
         * Find the highest existing router
         * number instead of simply using
         * currentNodes.length.
         *
         * This prevents duplicate IDs after
         * deleting routers in the future.
         */

        const routerNumbers =
          currentNodes
            .map((node) => {

              const match =
                node.id.match(
                  /^R(\d+)$/
                );

              return match
                ? Number(match[1])
                : 0;
            });


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


  // =====================================================
  // CLEAR NETWORK
  // =====================================================

  const clearNetwork = () => {

    setNodes([]);

    setEdges([]);

    setLinkMode(false);

    setSelectedEdge(null);

    setRouteRequest(null);

    setPackets([]);

    setIsSimulating(false);
  };


  // =====================================================
  // LINK MODE
  // =====================================================

  const startLinkMode = () => {

    if (nodes.length < 2) {

      alert(
        "Add at least two routers first."
      );

      return;
    }


    setSelectedEdge(null);


    setLinkMode(
      (current) =>
        !current
    );
  };


  // =====================================================
  // EDGE SELECTION
  // =====================================================

  const handleEdgeSelect = (
    edge
  ) => {

    setSelectedEdge(edge);
  };


  // =====================================================
  // UPDATE EDGE
  // =====================================================

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


    /*
     * Changing link properties makes
     * the previous route potentially stale.
     */

    setRouteRequest(null);

    setPackets([]);

    setIsSimulating(false);
  };


  // =====================================================
  // DELETE EDGE
  // =====================================================

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
  };


  // =====================================================
  // ROUTING ALGORITHM SELECTOR
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


  // =====================================================
  // FIND ROUTE
  // =====================================================

  const handleFindPath = (
    request
  ) => {

    const graph =
      buildGraph(
        nodes,
        edges
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


    console.log(
      "Routing Algorithm:",
      request.algorithm
    );


    console.log(
      "Graph:",
      graph
    );


    console.log(
      "Routing Result:",
      result
    );


    console.log(
      "Routing Table:",
      routingTable
    );


    setRouteRequest({

      ...request,

      result,

      routingTable,

    });


    setSelectedEdge(null);
  };


  // =====================================================
  // GENERATE PACKETS
  // =====================================================

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


    const graph =
      buildGraph(
        nodes,
        edges
      );


    /*
     * Use the currently selected routing
     * algorithm.
     *
     * If no route has been calculated yet,
     * use Dijkstra as the default.
     */

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


    /*
     * Create packet objects.
     */

    const newPackets = [];

    const simulationId =
      Date.now();


    for (
      let i = 0;
      i < packetCount;
      i++
    ) {

      const packet =
        createPacket({

          id:
            `P${simulationId}-${i + 1}`,

          source,

          destination,

          path:
            result.path,

          size:
            packetSize,

        });


      newPackets.push(
        packet
      );
    }


    /*
     * Generate routing table.
     */

    const routingTable =
      buildRoutingTable(
        graph,

        source,

        result
      );


    /*
     * Display selected route.
     */

    setRouteRequest({

      algorithm:
        packetAlgorithm,

      source,

      destination,

      result,

      routingTable,

    });


    /*
     * Store packets.
     */

    setPackets(
      newPackets
    );


    setSelectedEdge(null);


    /*
     * IMPORTANT:
     *
     * Generating packets does NOT
     * automatically start simulation.
     */
  };


  // =====================================================
  // START SIMULATION
  // =====================================================

  const startSimulation = () => {

    if (packets.length === 0) {

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


    setIsSimulating(
      true
    );
  };


  // =====================================================
  // RENDER
  // =====================================================

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


          {/* =========================================
              NETWORK CANVAS
              ========================================= */}

          <div className="canvas-section">

            <NetworkCanvas

              nodes={
                nodes
              }

              setNodes={
                setNodes
              }

              edges={
                edges
              }

              setEdges={
                setEdges
              }

              linkMode={
                linkMode
              }

              setLinkMode={
                setLinkMode
              }

              onEdgeSelect={
                handleEdgeSelect
              }

              routePath={
                routeRequest
                  ?.result
                  ?.path ?? []
              }

            />

          </div>


          {/* =========================================
              RESIZE HANDLE
              ========================================= */}

          <button

            type="button"

            className="bottom-panel-resizer"

            aria-label="Resize lower simulation panel"

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


          {/* =========================================
              BOTTOM SIMULATION AREA
              ========================================= */}

          <div

            className="bottom-panel"

            style={{

              height:
                `${bottomPanelHeight}px`,

              flexBasis:
                `${bottomPanelHeight}px`,

            }}

          >

            {/* =======================================
                LEFT SIDE
                ======================================= */}

            <div className="simulation-controls">


              {/* ROUTING */}

              <RoutingPanel

                nodes={
                  nodes
                }

                onFindPath={
                  handleFindPath
                }

              />


              {/* PACKET GENERATOR */}

              <PacketGenerator

                nodes={
                  nodes
                }

                onGeneratePackets={
                  handleGeneratePackets
                }

                disabled={
                  isSimulating
                }

              />


              {/* PACKET STATUS */}

              <PacketStatus

                packets={
                  packets
                }

                isSimulating={
                  isSimulating
                }

              />

            </div>


            {/* =======================================
                RIGHT SIDE
                ======================================= */}

            <div className="results-column">

              {selectedEdge ? (

                <LinkProperties

                  edge={
                    selectedEdge
                  }

                  nodes={
                    nodes
                  }

                  onUpdate={
                    updateEdge
                  }

                  onDelete={
                    deleteEdge
                  }

                />

              ) : routeRequest?.result ? (

                <div className="routing-results">

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

              ) : (

                <StatisticsPanel

                  nodeCount={
                    nodes.length
                  }

                  edgeCount={
                    edges.length
                  }

                />

              )}

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}


export default Simulator;
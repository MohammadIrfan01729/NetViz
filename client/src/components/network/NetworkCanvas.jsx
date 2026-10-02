import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import RouterNode from "./RouterNode";


const nodeTypes = {
  router: RouterNode,
};


function NetworkCanvas({
  nodes,
  setNodes,
  edges,
  setEdges,
  linkMode,
  setLinkMode,
  onEdgeSelect,
  onToggleEdgeFailure,
  onToggleRouterFailure,
  onNodeSelect,
  packets = [],
  routePath,
}) {


  // =========================================
  // NODE CHANGES
  // =========================================

  const onNodesChange = (changes) => {

    /*
     * Packet nodes are generated
     * automatically.
     *
     * We should only allow React Flow
     * changes to affect actual router
     * nodes.
     */

    const routerChanges =
      changes.filter(
        (change) => {

          if (
            change.id?.startsWith(
              "packet-"
            )
          ) {
            return false;
          }

          return true;

        }
      );


    setNodes(
      (currentNodes) => {

        const updatedNodes =
          applyNodeChanges(
            routerChanges,
            currentNodes
          );


        return updatedNodes;

      }
    );

  };


  // =========================================
  // EDGE CHANGES
  // =========================================

  const onEdgesChange = (changes) => {

    setEdges(
      (currentEdges) =>
        applyEdgeChanges(
          changes,
          currentEdges
        )
    );

  };


  // =========================================
  // CREATE LINK
  // =========================================

  const onConnect = (
    connection
  ) => {

    if (!linkMode) {
      return;
    }


    const newEdge = {

      ...connection,

      id:
        `${connection.source}-${connection.target}-${Date.now()}`,

      type:
        "default",

      label:
        "1",


      // -------------------------------------
      // COST LABEL
      // -------------------------------------

      labelStyle: {

        fill:
          "#000000",

        color:
          "#000000",

        fontWeight:
          700,

        fontSize:
          12,

      },


      labelBgStyle: {

        fill:
          "#ffffff",

        fillOpacity:
          1,

        stroke:
          "#ffffff",

      },


      labelBgPadding: [
        5,
        3,
      ],

      labelBgBorderRadius:
        3,


      // -------------------------------------
      // LINK DATA
      // -------------------------------------

      data: {

        cost:
          1,

        delay:
          10,

        bandwidth:
          100,

        packetLoss:
          0,

        failed:
          false,

        direction:
          "bidirectional",

        linkType:
          "ethernet",

      },


      // -------------------------------------
      // LINK STYLE
      // -------------------------------------

      style: {

        stroke:
          "#58a6ff",

        strokeWidth:
          2,

      },

    };


    setEdges(
      (currentEdges) =>
        addEdge(
          newEdge,
          currentEdges
        )
    );


    setLinkMode(false);

  };


  // =========================================
  // EDGE CLICK
  // =========================================

  const onEdgeClick = (
    event,
    edge
  ) => {

    event.stopPropagation();

    if (event.shiftKey) {
      onToggleEdgeFailure?.(edge.id);
      return;
    }

    onEdgeSelect(edge);

  };


  // =========================================
  // ROUTER FAILURE
  // =========================================

  const onNodeDoubleClick = (
    event,
    node
  ) => {

    event.stopPropagation();

    onToggleRouterFailure?.(node.id);

  };


  // =========================================
  // ROUTER SELECT
  // =========================================

  const onNodeClick = (event, node) => {
    event.stopPropagation();
    onNodeSelect?.(node);
  };


  // =========================================
  // CANVAS CLICK
  // =========================================

  const onPaneClick = () => {

    if (!linkMode) {

      onEdgeSelect(null);

    }

  };


  // =========================================
  // CHECK ROUTE EDGE
  // =========================================

  const isEdgeInRoute = (
    edge
  ) => {

    if (
      !routePath ||
      routePath.length < 2
    ) {

      return false;

    }


    for (
      let i = 0;
      i <
      routePath.length - 1;
      i++
    ) {

      const routeSource =
        routePath[i];

      const routeTarget =
        routePath[i + 1];


      const sameDirection =
        edge.source ===
        routeSource &&
        edge.target ===
        routeTarget;


      const reverseDirection =
        edge.source ===
        routeTarget &&
        edge.target ===
        routeSource;


      if (
        sameDirection ||
        reverseDirection
      ) {

        return true;

      }

    }


    return false;

  };


  // =========================================
  // CONGESTION COUNT
  // =========================================

  const getEdgeLoad = (edge) => {

    return packets.filter((packet) => {

      if (
        packet.status === "delivered" ||
        packet.status === "lost"
      ) {
        return false;
      }

      const current =
        packet.path?.[packet.currentHop];

      const next =
        packet.path?.[packet.currentHop + 1];

      return (
        (
          current === edge.source &&
          next === edge.target
        ) ||
        (
          current === edge.target &&
          next === edge.source
        )
      );
    }).length;
  };


  // =========================================
  // DISPLAY EDGES
  // =========================================

  const displayEdges =
    edges.map((edge) => {

      const isRouteEdge =
        isEdgeInRoute(edge);

      const edgeLoad =
        getEdgeLoad(edge);

      const isFailed =
        Boolean(edge.data?.failed);

      const isCongested =
        !isFailed && edgeLoad >= 3;


      return {

        ...edge,

        label:
          isFailed
            ? "FAILED"
            : edge.data?.direction === "forward"
              ? `${edge.data?.cost ?? 1} →`
              : edge.data?.direction === "reverse"
                ? `${edge.data?.cost ?? 1} ←`
                : edgeLoad > 0
                  ? `${edge.data?.cost ?? 1} · ${edgeLoad} pkt`
                  : `${edge.data?.cost ?? 1}`,

        // -----------------------------------
        // EDGE CLASS
        // -----------------------------------

        className:
          isFailed
            ? "failed-edge"
            : isCongested
              ? "congested-edge"
              : isRouteEdge
                ? "route-edge"
                : "normal-edge",


        // -----------------------------------
        // EDGE STYLE
        // -----------------------------------

        style: {

          ...edge.style,

          stroke:
            isFailed
              ? "#f85149"
              : isCongested
                ? "#f0a44b"
                : isRouteEdge
                  ? "#f0c674"
                  : "#58a6ff",

          strokeWidth:
            isFailed
              ? 3
              : isRouteEdge
                ? 5
                : isCongested
                  ? 3
                  : 2,

          strokeDasharray:
            isFailed
              ? "8 5"
              : "0",

          opacity:
            isFailed
              ? 0.85
              : 1,

        },


        // -----------------------------------
        // LABEL STYLE
        // -----------------------------------

        labelStyle: {

          ...edge.labelStyle,

          fill:
            "#000000",

          color:
            "#000000",

          fontWeight:
            700,

          fontSize:
            12,

        },


        // -----------------------------------
        // LABEL BACKGROUND
        // -----------------------------------

        labelBgStyle: {

          ...edge.labelBgStyle,

          fill:
            isFailed
              ? "#2b1111"
              : isCongested
                ? "#2b2111"
                : "#ffffff",

          fillOpacity:
            1,

          stroke:
            isFailed
              ? "#f85149"
              : isCongested
                ? "#f0a44b"
                : isRouteEdge
                  ? "#f0c674"
                  : "#ffffff",

          strokeWidth:
            isFailed ||
            isCongested ||
            isRouteEdge
              ? 1
              : 0,

        },


        labelBgPadding: [
          5,
          3,
        ],

        labelBgBorderRadius:
          3,

      };

    });


  // =========================================
  // DISPLAY NODES
  // =========================================

  const displayNodes =
    nodes.map((node) => {

      const failed =
        Boolean(node.data?.failed);

      return {
        ...node,

        style: {
          ...node.style,
          opacity: failed ? 0.45 : 1,
          filter: failed
            ? "grayscale(1)"
            : "none",
        },
      };
    });


  // =========================================
  // RENDER
  // =========================================

  return (

    <div className="network-canvas">


      {/* =====================================
          CANVAS HEADER
          ===================================== */}

      <div className="canvas-header">

        <div>

          <h2>
            Network Topology
          </h2>


          <span>

            {linkMode

              ? "Connect two routers to create a link"

              : routePath?.length > 0

                ? "Shortest path highlighted • Shift-click link to fail/restore • Double-click router to fail/restore"

                : "Build and visualize your network • Shift-click link to fail/restore • Double-click router to fail/restore"}

          </span>

        </div>

      </div>


      {/* =====================================
          NETWORK AREA
          ===================================== */}

      <div className="network-area">

        <ReactFlow

          nodes={
            displayNodes
          }

          edges={
            displayEdges
          }

          nodeTypes={
            nodeTypes
          }

          onNodesChange={
            onNodesChange
          }

          onEdgesChange={
            onEdgesChange
          }

          onConnect={
            onConnect
          }

          onEdgeClick={
            onEdgeClick
          }

          onNodeClick={
            onNodeClick
          }

          onNodeDoubleClick={
            onNodeDoubleClick
          }

          onPaneClick={
            onPaneClick
          }

          nodesConnectable={
            linkMode
          }

          nodesDraggable={
            true
          }

          fitView

        >

          <Background />

          <Controls />

          <MiniMap />

        </ReactFlow>

      </div>

    </div>

  );

}


export default NetworkCanvas;
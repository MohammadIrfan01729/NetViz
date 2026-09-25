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
  routePath,
}) {


  // =========================================
  // NODE CHANGES
  // =========================================

  const onNodesChange = (changes) => {

    setNodes((currentNodes) => {

      const updatedNodes =
        applyNodeChanges(
          changes,
          currentNodes
        );


      console.log(
        "React Flow nodes:",
        updatedNodes
      );


      return updatedNodes;

    });

  };


  // =========================================
  // EDGE CHANGES
  // =========================================

  const onEdgesChange = (changes) => {

    setEdges((currentEdges) =>
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
      // Cost label
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
      // Link data
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

      },


      // -------------------------------------
      // Link style
      // -------------------------------------

      style: {

        stroke:
          "#58a6ff",

        strokeWidth:
          2,

      },

    };


    setEdges((currentEdges) =>
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

    onEdgeSelect(edge);

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
  // DISPLAY EDGES
  // =========================================

  const displayEdges =
    edges.map((edge) => {

      const isRouteEdge =
        isEdgeInRoute(edge);


      return {

        ...edge,


        // -----------------------------------
        // Edge class
        // -----------------------------------

        className:
          isRouteEdge
            ? "route-edge"
            : "normal-edge",


        // -----------------------------------
        // Edge style
        // -----------------------------------

        style: {

          ...edge.style,

          stroke:
            isRouteEdge
              ? "#f0c674"
              : "#58a6ff",

          strokeWidth:
            isRouteEdge
              ? 5
              : 2,

          opacity:
            1,

        },


        // -----------------------------------
        // Label style
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
        // Label background
        // -----------------------------------

        labelBgStyle: {

          ...edge.labelBgStyle,

          fill:
            "#ffffff",

          fillOpacity:
            1,

          stroke:
            isRouteEdge
              ? "#f0c674"
              : "#ffffff",

          strokeWidth:
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

              ? "Shortest path highlighted"

              : "Build and visualize your network"}

          </span>

        </div>

      </div>


      {/* =====================================
          NETWORK AREA
          ===================================== */}

      <div className="network-area">

        <ReactFlow

          nodes={
            nodes
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
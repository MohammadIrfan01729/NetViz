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
}) {


  // -----------------------------------------
  // Node changes
  // -----------------------------------------

  const onNodesChange = (changes) => {

    setNodes((currentNodes) =>
      applyNodeChanges(
        changes,
        currentNodes
      )
    );

  };


  // -----------------------------------------
  // Edge changes
  // -----------------------------------------

  const onEdgesChange = (changes) => {

    setEdges((currentEdges) =>
      applyEdgeChanges(
        changes,
        currentEdges
      )
    );

  };


  // -----------------------------------------
  // Create Link
  // -----------------------------------------

  const onConnect = (connection) => {

    if (!linkMode) {
      return;
    }


    const newEdge = {

      ...connection,

      id: `${connection.source}-${connection.target}-${Date.now()}`,

      label: "1",

      data: {

        cost: 1,

        delay: 10,

        bandwidth: 100,

        packetLoss: 0,

      },

      style: {
        strokeWidth: 2,
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


  // -----------------------------------------
  // Edge Click
  // -----------------------------------------

  const onEdgeClick = (
    event,
    edge
  ) => {

    event.stopPropagation();

    onEdgeSelect(edge);

  };


  // -----------------------------------------
  // Canvas Click
  // -----------------------------------------

  const onPaneClick = () => {

    // Don't clear selection while
    // creating a link

    if (!linkMode) {
      onEdgeSelect(null);
    }

  };


  return (

    <div className="network-canvas">

      <div className="canvas-header">

        <div>

          <h2>
            Network Topology
          </h2>

          <span>

            {linkMode

              ? "Connect two routers to create a link"

              : "Build and visualize your network"}

          </span>

        </div>

      </div>


      <div className="network-area">

        <ReactFlow

          nodes={nodes}

          edges={edges}

          nodeTypes={nodeTypes}

          onNodesChange={onNodesChange}

          onEdgesChange={onEdgesChange}

          onConnect={onConnect}

          onEdgeClick={onEdgeClick}

          onPaneClick={onPaneClick}

          nodesConnectable={linkMode}

          nodesDraggable={true}

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
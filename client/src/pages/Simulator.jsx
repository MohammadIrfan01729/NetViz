import { useState } from "react";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import NetworkCanvas from "../components/network/NetworkCanvas";
import RoutingPanel from "../components/routing/RoutingPanel";
import StatisticsPanel from "../components/statistics/StatisticsPanel";
import LinkProperties from "../components/network/LinkProperties";


function Simulator() {

  const [nodes, setNodes] = useState([]);

  const [edges, setEdges] = useState([]);

  const [linkMode, setLinkMode] = useState(false);

  const [selectedEdge, setSelectedEdge] = useState(null);


  // -----------------------------------------
  // Add Router
  // -----------------------------------------

  const addRouter = () => {

    const routerNumber = nodes.length + 1;

    const newNode = {

      id: `R${routerNumber}`,

      type: "router",

      position: {
        x: 200 + (nodes.length % 4) * 180,
        y: 100 + Math.floor(nodes.length / 4) * 150,
      },

      data: {
        label: `R${routerNumber}`,
      },

    };


    setNodes((currentNodes) => [
      ...currentNodes,
      newNode,
    ]);

  };


  // -----------------------------------------
  // Clear Network
  // -----------------------------------------

  const clearNetwork = () => {

    setNodes([]);

    setEdges([]);

    setLinkMode(false);

    setSelectedEdge(null);

  };


  // -----------------------------------------
  // Add Link Mode
  // -----------------------------------------

  const startLinkMode = () => {

    if (nodes.length < 2) {

      alert(
        "Add at least two routers first."
      );

      return;
    }

    setLinkMode((current) => !current);

  };


  // -----------------------------------------
  // Select Edge
  // -----------------------------------------

  const handleEdgeSelect = (edge) => {

    setSelectedEdge(edge);

  };


  // -----------------------------------------
  // Update Edge
  // -----------------------------------------

  const updateEdge = (updatedEdge) => {

    setEdges((currentEdges) =>
      currentEdges.map((edge) =>
        edge.id === updatedEdge.id
          ? updatedEdge
          : edge
      )
    );

    setSelectedEdge(updatedEdge);

  };


  // -----------------------------------------
  // Delete Edge
  // -----------------------------------------

  const deleteEdge = (edgeId) => {

    setEdges((currentEdges) =>
      currentEdges.filter(
        (edge) => edge.id !== edgeId
      )
    );

    setSelectedEdge(null);

  };


  return (

    <div className="simulator">

      <Navbar />


      <div className="simulator-body">

        <Sidebar

          onAddRouter={addRouter}

          onAddLink={startLinkMode}

          onClearNetwork={clearNetwork}

          linkMode={linkMode}

        />


        <main className="workspace">

          <div className="canvas-section">

            <NetworkCanvas

              nodes={nodes}

              setNodes={setNodes}

              edges={edges}

              setEdges={setEdges}

              linkMode={linkMode}

              setLinkMode={setLinkMode}

              onEdgeSelect={handleEdgeSelect}

            />

          </div>


          <div className="bottom-panel">

            <RoutingPanel />


            {selectedEdge ? (

              <LinkProperties

                edge={selectedEdge}

                nodes={nodes}

                onUpdate={updateEdge}

                onDelete={deleteEdge}

              />

            ) : (

              <StatisticsPanel

                nodeCount={nodes.length}

                edgeCount={edges.length}

              />

            )}

          </div>

        </main>

      </div>

    </div>

  );

}

export default Simulator;
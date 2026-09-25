import { useEffect, useState } from "react";


function PacketGenerator({
  nodes,
  onGeneratePackets,
  disabled = false,
}) {

  // =========================================
  // STATE
  // =========================================

  const [source, setSource] =
    useState("");

  const [destination, setDestination] =
    useState("");

  const [packetSize, setPacketSize] =
    useState(1024);

  const [packetCount, setPacketCount] =
    useState(1);


  // =========================================
  // UPDATE SOURCE / DESTINATION
  // =========================================

  useEffect(() => {

    /*
     * Need at least two routers.
     */

    if (nodes.length < 2) {

      setSource("");

      setDestination("");

      return;

    }


    /*
     * Get router IDs.
     */

    const nodeIds =
      nodes.map(
        (node) => node.id
      );


    /*
     * Check whether current source
     * still exists.
     */

    const validCurrentSource =
      source &&
      nodeIds.includes(source);


    /*
     * Keep current source if valid.
     * Otherwise use the first router.
     */

    const selectedSource =
      validCurrentSource
        ? source
        : nodeIds[0];


    /*
     * Check whether current
     * destination is still valid.
     */

    const validCurrentDestination =
      destination &&
      nodeIds.includes(destination) &&
      destination !== selectedSource;


    /*
     * Select a destination.
     */

    const selectedDestination =
      validCurrentDestination
        ? destination
        : nodeIds.find(
            (nodeId) =>
              nodeId !== selectedSource
          ) || "";


    /*
     * Update state.
     */

    if (source !== selectedSource) {

      setSource(
        selectedSource
      );

    }


    if (
      destination !==
      selectedDestination
    ) {

      setDestination(
        selectedDestination
      );

    }

  }, [nodes]);


  // =========================================
  // SOURCE CHANGE
  // =========================================

  const handleSourceChange = (
    event
  ) => {

    const newSource =
      event.target.value;


    setSource(
      newSource
    );


    /*
     * Source and destination
     * cannot be the same.
     */

    if (
      newSource ===
      destination
    ) {

      const newDestination =
        nodes.find(
          (node) =>
            node.id !==
            newSource
        );


      setDestination(
        newDestination
          ? newDestination.id
          : ""
      );

    }

  };


  // =========================================
  // FORM SUBMIT
  // =========================================

  const handleSubmit = (
    event
  ) => {

    event.preventDefault();


    // ---------------------------------------
    // Check routers
    // ---------------------------------------

    if (nodes.length < 2) {

      alert(
        "Add at least two routers first."
      );

      return;

    }


    // ---------------------------------------
    // Check source/destination
    // ---------------------------------------

    if (
      !source ||
      !destination
    ) {

      alert(
        "Select source and destination."
      );

      return;

    }


    // ---------------------------------------
    // Same source/destination
    // ---------------------------------------

    if (
      source === destination
    ) {

      alert(
        "Source and destination must be different."
      );

      return;

    }


    // ---------------------------------------
    // Packet size
    // ---------------------------------------

    const size =
      Number(packetSize);


    if (
      !Number.isFinite(size) ||
      size <= 0
    ) {

      alert(
        "Packet size must be greater than 0."
      );

      return;

    }


    // ---------------------------------------
    // Packet count
    // ---------------------------------------

    const count =
      Number(packetCount);


    if (
      !Number.isFinite(count) ||
      count <= 0
    ) {

      alert(
        "Packet count must be greater than 0."
      );

      return;

    }


    // ---------------------------------------
    // Generate packets
    // ---------------------------------------

    onGeneratePackets({

      source,

      destination,

      packetSize:
        size,

      packetCount:
        count,

    });

  };


  // =========================================
  // RENDER
  // =========================================

  return (

    <div className="panel packet-generator">


      {/* =====================================
          HEADER
          ===================================== */}

      <div className="panel-header">

        <div>

          <h3>
            Packet Generator
          </h3>

          <span className="panel-subtitle">
            Generate packets for network
            simulation
          </span>

        </div>

      </div>


      {/* =====================================
          LESS THAN TWO ROUTERS
          ===================================== */}

      {nodes.length < 2 ? (

        <div className="packet-generator-empty">

          Add at least two routers to
          generate packets.

        </div>

      ) : (


        /* ===================================
           PACKET FORM
           =================================== */

        <form
          className="packet-generator-form"
          onSubmit={
            handleSubmit
          }
        >


          {/* ================================
              SOURCE
              ================================ */}

          <div className="form-group">

            <label
              htmlFor="packet-source"
            >
              Source
            </label>


            <select
              id="packet-source"
              value={source}
              onChange={
                handleSourceChange
              }
              disabled={
                disabled
              }
            >

              <option value="">
                Select source
              </option>


              {nodes.map(
                (node) => (

                  <option
                    key={node.id}
                    value={node.id}
                  >
                    {node.id}
                  </option>

                )
              )}

            </select>

          </div>


          {/* ================================
              DESTINATION
              ================================ */}

          <div className="form-group">

            <label
              htmlFor="packet-destination"
            >
              Destination
            </label>


            <select
              id="packet-destination"
              value={destination}
              onChange={(event) =>
                setDestination(
                  event.target.value
                )
              }
              disabled={
                disabled
              }
            >

              <option value="">
                Select destination
              </option>


              {nodes.map(
                (node) => (

                  <option
                    key={node.id}
                    value={node.id}
                    disabled={
                      node.id ===
                      source
                    }
                  >
                    {node.id}
                  </option>

                )
              )}

            </select>

          </div>


          {/* ================================
              PACKET SIZE
              ================================ */}

          <div className="form-group">

            <label
              htmlFor="packet-size"
            >
              Packet Size (bytes)
            </label>


            <input
              id="packet-size"
              type="number"
              min="1"
              max="10000000"
              value={packetSize}
              onChange={(event) =>
                setPacketSize(
                  event.target.value
                )
              }
              disabled={
                disabled
              }
            />

          </div>


          {/* ================================
              PACKET COUNT
              ================================ */}

          <div className="form-group">

            <label
              htmlFor="packet-count"
            >
              Number of Packets
            </label>


            <input
              id="packet-count"
              type="number"
              min="1"
              max="100"
              value={packetCount}
              onChange={(event) =>
                setPacketCount(
                  event.target.value
                )
              }
              disabled={
                disabled
              }
            />

          </div>


          {/* ================================
              GENERATE BUTTON
              ================================ */}

          <button
            type="submit"
            className="primary-button packet-generate-button"
            disabled={
              disabled
            }
          >

            {disabled
              ? "Simulation Running..."
              : "Generate Packets"}

          </button>


        </form>

      )}

    </div>

  );

}


export default PacketGenerator;
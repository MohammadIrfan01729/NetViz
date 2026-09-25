import {
  useEffect,
  useState,
} from "react";


function RoutingPanel({
  nodes,
  onFindPath,
}) {
  const [algorithm, setAlgorithm] =
    useState("dijkstra");

  const [source, setSource] =
    useState("");

  const [destination, setDestination] =
    useState("");


  /*
   * =======================================================
   * SET DEFAULT SOURCE / DESTINATION
   * =======================================================
   */

  useEffect(() => {
    if (nodes.length < 2) {
      setSource("");
      setDestination("");
      return;
    }

    const nodeIds = nodes.map(
      (node) => node.id
    );

    /*
     * Keep current source if it still
     * exists in the topology.
     */

    const nextSource =
      source &&
      nodeIds.includes(source)
        ? source
        : nodeIds[0];


    /*
     * Keep current destination if valid.
     */

    const nextDestination =
      destination &&
      nodeIds.includes(destination) &&
      destination !== nextSource
        ? destination
        : nodeIds.find(
            (nodeId) =>
              nodeId !== nextSource
          ) || "";


    setSource(nextSource);

    setDestination(
      nextDestination
    );

  }, [
    nodes,
    source,
    destination,
  ]);


  /*
   * =======================================================
   * SOURCE CHANGE
   * =======================================================
   */

  const handleSourceChange = (
    event
  ) => {
    const nextSource =
      event.target.value;

    setSource(nextSource);


    /*
     * Source and destination cannot
     * be the same router.
     */

    if (
      nextSource === destination
    ) {
      const nextDestination =
        nodes.find(
          (node) =>
            node.id !== nextSource
        );

      setDestination(
        nextDestination
          ? nextDestination.id
          : ""
      );
    }
  };


  /*
   * =======================================================
   * FIND ROUTE
   * =======================================================
   */

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();


    if (nodes.length < 2) {
      alert(
        "Add at least two routers first."
      );

      return;
    }


    if (
      !source ||
      !destination
    ) {
      alert(
        "Select source and destination."
      );

      return;
    }


    if (
      source === destination
    ) {
      alert(
        "Source and destination must be different."
      );

      return;
    }


    onFindPath({
      algorithm,
      source,
      destination,
    });
  };


  return (
    <div className="panel routing-panel">

      {/* =================================================
          HEADER
          ================================================= */}

      <div className="routing-panel-header">

        <div>

          <h3>
            Routing
          </h3>

          <span className="panel-subtitle">
            Compare shortest-path routing
            algorithms
          </span>

        </div>

      </div>


      {/* =================================================
          EMPTY STATE
          ================================================= */}

      {nodes.length < 2 ? (

        <div className="routing-panel-empty">

          Add at least two routers to
          calculate a route.

        </div>

      ) : (

        <form
          className="routing-form"
          onSubmit={handleSubmit}
        >

          {/* =================================================
              SOURCE
              ================================================= */}

          <div className="form-group">

            <label htmlFor="routing-source">
              Source
            </label>

            <select
              id="routing-source"
              value={source}
              onChange={
                handleSourceChange
              }
            >

              <option value="">
                Select source
              </option>

              {nodes.map((node) => (

                <option
                  key={node.id}
                  value={node.id}
                >
                  {node.id}
                </option>

              ))}

            </select>

          </div>


          {/* =================================================
              DESTINATION
              ================================================= */}

          <div className="form-group">

            <label htmlFor="routing-destination">
              Destination
            </label>

            <select
              id="routing-destination"
              value={destination}
              onChange={(event) =>
                setDestination(
                  event.target.value
                )
              }
            >

              <option value="">
                Select destination
              </option>

              {nodes.map((node) => (

                <option
                  key={node.id}
                  value={node.id}
                  disabled={
                    node.id === source
                  }
                >
                  {node.id}
                </option>

              ))}

            </select>

          </div>


          {/* =================================================
              ALGORITHM
              ================================================= */}

          <div className="form-group">

            <label htmlFor="routing-algorithm">
              Algorithm
            </label>

            <select
              id="routing-algorithm"
              value={algorithm}
              onChange={(event) =>
                setAlgorithm(
                  event.target.value
                )
              }
            >

              <option value="dijkstra">
                Dijkstra
              </option>

              <option value="bellman-ford">
                Bellman-Ford
              </option>

              <option value="distance-vector">
                Distance Vector
              </option>

              <option value="link-state">
                Link State
              </option>

            </select>

          </div>


          {/* =================================================
              BUTTON
              ================================================= */}

          <button
            type="submit"
            className="primary-button routing-find-button"
            disabled={
              !source ||
              !destination ||
              source === destination
            }
          >
            Find Route
          </button>

        </form>

      )}

    </div>
  );
}


export default RoutingPanel;
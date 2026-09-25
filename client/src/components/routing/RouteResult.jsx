function RouteResult({
  result,
  algorithm,
}) {
  if (!result) {
    return null;
  }


  /*
   * =======================================================
   * ALGORITHM NAMES
   * =======================================================
   */

  const algorithmNames = {
    dijkstra:
      "Dijkstra",

    "bellman-ford":
      "Bellman-Ford",

    "distance-vector":
      "Distance Vector",

    "link-state":
      "Link State",
  };


  const algorithmName =
    algorithmNames[algorithm] ||
    algorithm ||
    "Dijkstra";


  /*
   * =======================================================
   * UNREACHABLE
   * =======================================================
   */

  if (!result.reachable) {

    return (
      <div className="panel route-result">

        <h3>
          Route Result
        </h3>


        <div className="route-status unreachable">

          Destination is unreachable

        </div>


        <div className="route-detail">

          <span>
            Algorithm
          </span>

          <strong>
            {algorithmName}
          </strong>

        </div>

      </div>
    );
  }


  /*
   * =======================================================
   * REACHABLE ROUTE
   * =======================================================
   */

  return (
    <div className="panel route-result">

      <h3>
        Route Result
      </h3>


      {/* =================================================
          PATH
          ================================================= */}

      <div className="route-path">

        {result.path.map(
          (node, index) => (

            <span
              className="route-node-name"
              key={`${node}-${index}`}
            >

              {node}

              {index <
                result.path.length - 1 && (

                <span className="route-arrow">
                  →
                </span>

              )}

            </span>

          )
        )}

      </div>


      {/* =================================================
          ROUTE DETAILS
          ================================================= */}

      <div className="route-details">

        <div className="route-detail">

          <span>
            Algorithm
          </span>

          <strong>
            {algorithmName}
          </strong>

        </div>


        <div className="route-detail">

          <span>
            Total Cost
          </span>

          <strong>
            {result.distance}
          </strong>

        </div>


        <div className="route-detail">

          <span>
            Hops
          </span>

          <strong>
            {result.path.length - 1}
          </strong>

        </div>


        <div className="route-detail">

          <span>
            Status
          </span>

          <strong className="reachable">
            Reachable
          </strong>

        </div>

      </div>


      {/* =================================================
          DISTANCE VECTOR INFORMATION
          ================================================= */}

      {algorithm ===
        "distance-vector" &&
        result.iterations !==
          undefined && (

        <div className="algorithm-info">

          Distance Vector converged
          in{" "}

          <strong>
            {result.iterations}
          </strong>{" "}

          update round
          {result.iterations === 1
            ? ""
            : "s"}.

        </div>

      )}


      {/* =================================================
          LINK STATE INFORMATION
          ================================================= */}

      {algorithm ===
        "link-state" && (

        <div className="algorithm-info">

          Link-State Database built
          successfully.

          <br />

          <strong>
            SPF / Dijkstra
          </strong>{" "}
          calculated the shortest path.

        </div>

      )}

    </div>
  );
}


export default RouteResult;
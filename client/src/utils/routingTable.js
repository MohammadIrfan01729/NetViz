export function buildRoutingTable(
  graph,
  source,
  dijkstraResult
) {

  const table = [];

  const {
    distances,
    previous,
  } = dijkstraResult;


  // =========================================
  // Find complete path to a destination
  // =========================================

  const getPath = (destination) => {

    if (
      distances[destination] === Infinity
    ) {
      return [];
    }


    const path = [];

    let current = destination;


    while (current !== null) {

      path.unshift(current);

      current = previous[current];

    }


    return path;

  };


  // =========================================
  // Build routing table
  // =========================================

  Object.keys(graph).forEach(
    (destination) => {

      const distance =
        distances[destination];


      // -------------------------------
      // Unreachable destination
      // -------------------------------

      if (distance === Infinity) {

        table.push({

          destination,

          nextHop: "-",

          cost: "∞",

          path: [],

          reachable: false,

        });

        return;

      }


      // -------------------------------
      // Source itself
      // -------------------------------

      if (destination === source) {

        table.push({

          destination,

          nextHop: "-",

          cost: 0,

          path: [source],

          reachable: true,

        });

        return;

      }


      // -------------------------------
      // Build path
      // -------------------------------

      const path =
        getPath(destination);


      // -------------------------------
      // Determine next hop
      // -------------------------------

      const nextHop =
        path.length > 1
          ? path[1]
          : "-";


      table.push({

        destination,

        nextHop,

        cost: distance,

        path,

        reachable: true,

      });

    }
  );


  return table;

}
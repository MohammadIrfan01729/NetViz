export function dijkstra(
  graph,
  start,
  destination
) {

  // =========================================
  // DISTANCES
  // =========================================

  const distances = {};


  // =========================================
  // PREVIOUS NODES
  // =========================================

  const previous = {};


  // =========================================
  // UNVISITED NODES
  // =========================================

  const unvisited = new Set();


  // =========================================
  // INITIALIZATION
  // =========================================

  Object.keys(graph).forEach((node) => {

    distances[node] = Infinity;

    previous[node] = null;

    unvisited.add(node);

  });


  // Distance from source to itself
  distances[start] = 0;


  // =========================================
  // MAIN DIJKSTRA LOOP
  // =========================================

  while (unvisited.size > 0) {

    let current = null;

    let smallestDistance = Infinity;


    // -----------------------------------------
    // Find closest unvisited node
    // -----------------------------------------

    for (const node of unvisited) {

      if (
        distances[node] <
        smallestDistance
      ) {

        smallestDistance =
          distances[node];

        current = node;

      }

    }


    // -----------------------------------------
    // No reachable nodes remain
    // -----------------------------------------

    if (current === null) {

      break;

    }


    // -----------------------------------------
    // Mark current node as visited
    // -----------------------------------------

    unvisited.delete(current);


    // =========================================
    // CHECK NEIGHBORS
    // =========================================

    for (
      const neighbor
      of graph[current]
    ) {

      // Ignore already visited nodes

      if (
        !unvisited.has(
          neighbor.node
        )
      ) {

        continue;

      }


      // -----------------------------------------
      // Calculate alternative distance
      // -----------------------------------------

      const newDistance =
        distances[current] +
        Number(neighbor.cost);


      // -----------------------------------------
      // Update if shorter
      // -----------------------------------------

      if (
        newDistance <
        distances[neighbor.node]
      ) {

        distances[neighbor.node] =
          newDistance;

        previous[neighbor.node] =
          current;

      }

    }

  }


  // =========================================
  // BUILD PATH
  // =========================================

  const path = [];

  let current = destination;


  // =========================================
  // DESTINATION UNREACHABLE
  // =========================================

  if (
    distances[destination] === Infinity
  ) {

    return {

      path: [],

      distance: Infinity,

      reachable: false,

      distances,

      previous,

    };

  }


  // =========================================
  // TRACE PATH BACKWARDS
  // =========================================

  while (current !== null) {

    path.unshift(current);

    current =
      previous[current];

  }


  // =========================================
  // RETURN RESULT
  // =========================================

  return {

    path,

    distance:
      distances[destination],

    reachable: true,

    distances,

    previous,

  };

}
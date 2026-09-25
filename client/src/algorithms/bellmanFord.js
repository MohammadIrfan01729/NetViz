export function bellmanFord(
  graph,
  start,
  destination
) {
  const nodes = Object.keys(graph);

  const distances = {};
  const previous = {};

  nodes.forEach((node) => {
    distances[node] = Infinity;
    previous[node] = null;
  });

  if (
    !Object.prototype.hasOwnProperty.call(
      graph,
      start
    )
  ) {
    return {
      path: [],
      distance: Infinity,
      reachable: false,
      distances,
      previous,
      negativeCycle: false,
    };
  }

  distances[start] = 0;

  /*
   * Relax every edge |V| - 1 times.
   */
  for (
    let i = 0;
    i < nodes.length - 1;
    i++
  ) {
    let changed = false;

    for (const node of nodes) {
      if (distances[node] === Infinity) {
        continue;
      }

      for (const neighbor of graph[node]) {
        const weight =
          Number(neighbor.cost);

        const newDistance =
          distances[node] + weight;

        if (
          newDistance <
          distances[neighbor.node]
        ) {
          distances[neighbor.node] =
            newDistance;

          previous[neighbor.node] =
            node;

          changed = true;
        }
      }
    }

    /*
     * If nothing changed, the algorithm
     * has already converged.
     */
    if (!changed) {
      break;
    }
  }

  /*
   * Detect a negative-weight cycle.
   */
  let negativeCycle = false;

  for (const node of nodes) {
    if (distances[node] === Infinity) {
      continue;
    }

    for (const neighbor of graph[node]) {
      const weight =
        Number(neighbor.cost);

      if (
        distances[node] + weight <
        distances[neighbor.node]
      ) {
        negativeCycle = true;
        break;
      }
    }

    if (negativeCycle) {
      break;
    }
  }

  /*
   * Destination cannot be used if a
   * negative cycle exists or destination
   * is unreachable.
   */
  if (
    negativeCycle ||
    distances[destination] === Infinity
  ) {
    return {
      path: [],
      distance: negativeCycle
        ? -Infinity
        : Infinity,
      reachable: false,
      distances,
      previous,
      negativeCycle,
    };
  }

  /*
   * Reconstruct path.
   */
  const path = [];
  const visited = new Set();

  let current = destination;

  while (current !== null) {
    /*
     * Safety check against a cycle in
     * predecessor information.
     */
    if (visited.has(current)) {
      return {
        path: [],
        distance: Infinity,
        reachable: false,
        distances,
        previous,
        negativeCycle: true,
      };
    }

    visited.add(current);

    path.unshift(current);

    if (current === start) {
      break;
    }

    current = previous[current];
  }

  /*
   * Make sure the path actually begins
   * at the requested source.
   */
  if (path[0] !== start) {
    return {
      path: [],
      distance: Infinity,
      reachable: false,
      distances,
      previous,
      negativeCycle: false,
    };
  }

  return {
    path,
    distance: distances[destination],
    reachable: true,
    distances,
    previous,
    negativeCycle: false,
  };
}
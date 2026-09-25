export function distanceVector(
  graph,
  start,
  destination
) {
  const nodes = Object.keys(graph);

  const distanceVectors = {};
  const nextHops = {};

  /*
   * INITIALIZATION
   *
   * Every router initially knows:
   *
   * Cost to itself = 0
   * Cost to direct neighbor = link cost
   * Everything else = Infinity
   */

  nodes.forEach((node) => {
    distanceVectors[node] = {};
    nextHops[node] = {};

    nodes.forEach((target) => {
      distanceVectors[node][target] =
        node === target
          ? 0
          : Infinity;

      nextHops[node][target] =
        node === target
          ? "-"
          : null;
    });
  });

  /*
   * Add direct neighbor information.
   */

  nodes.forEach((node) => {
    graph[node].forEach((neighbor) => {
      const cost =
        Number(neighbor.cost);

      if (
        cost <
        distanceVectors[node][neighbor.node]
      ) {
        distanceVectors[node][neighbor.node] =
          cost;

        nextHops[node][neighbor.node] =
          neighbor.node;
      }
    });
  });

  /*
   * DISTANCE VECTOR UPDATE
   *
   * Dx(y) =
   * min [ c(x,v) + Dv(y) ]
   *
   * x = current router
   * v = neighboring router
   * y = destination
   */

  const maxIterations =
    Math.max(nodes.length - 1, 1);

  let iterations = 0;

  for (
    let round = 0;
    round < maxIterations;
    round++
  ) {
    /*
     * Snapshot of the vectors before
     * this update round.
     */
    const previousVectors = {};

    nodes.forEach((node) => {
      previousVectors[node] = {
        ...distanceVectors[node],
      };
    });

    let changed = false;

    /*
     * Every router asks its neighbors
     * for their distance information.
     */
    nodes.forEach((node) => {
      graph[node].forEach((neighbor) => {
        const neighborNode =
          neighbor.node;

        const linkCost =
          Number(neighbor.cost);

        nodes.forEach((target) => {
          const neighborDistance =
            previousVectors[
              neighborNode
            ][target];

          if (
            neighborDistance === Infinity
          ) {
            return;
          }

          const candidate =
            linkCost +
            neighborDistance;

          if (
            candidate <
            distanceVectors[node][target]
          ) {
            distanceVectors[node][target] =
              candidate;

            nextHops[node][target] =
              neighborNode;

            changed = true;
          }
        });
      });
    });

    iterations = round + 1;

    /*
     * No changes means the network
     * has converged.
     */
    if (!changed) {
      break;
    }
  }

  /*
   * Source router's final distance vector.
   */
  const distances =
    distanceVectors[start] || {};

  const previous = {};

  nodes.forEach((node) => {
    previous[node] = null;
  });

  /*
   * Build a path using next-hop
   * information.
   */
  const buildPath = (target) => {
    if (target === start) {
      return [start];
    }

    if (
      distances[target] === undefined ||
      distances[target] === Infinity
    ) {
      return [];
    }

    const path = [start];

    const visited = new Set([
      start,
    ]);

    let current = start;

    while (current !== target) {
      const next =
        nextHops[current]?.[target];

      if (
        !next ||
        next === "-" ||
        visited.has(next)
      ) {
        return [];
      }

      previous[next] = current;

      path.push(next);

      visited.add(next);

      current = next;
    }

    return path;
  };

  /*
   * Invalid source.
   */
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
      distances: {},
      previous,
      distanceVectors,
      nextHops,
      iterations,
    };
  }

  /*
   * Destination unreachable.
   */
  if (
    distances[destination] === Infinity ||
    distances[destination] === undefined
  ) {
    return {
      path: [],
      distance: Infinity,
      reachable: false,
      distances,
      previous,
      distanceVectors,
      nextHops,
      iterations,
    };
  }

  /*
   * Build requested path.
   */
  const path =
    buildPath(destination);

  if (path.length === 0) {
    return {
      path: [],
      distance: Infinity,
      reachable: false,
      distances,
      previous,
      distanceVectors,
      nextHops,
      iterations,
    };
  }

  /*
   * Build predecessor information
   * for the routing table.
   */
  nodes.forEach((target) => {
    if (
      target === start ||
      distances[target] === Infinity
    ) {
      return;
    }

    const predecessor =
      graph[target].find(
        (neighbor) => {
          const neighborDistance =
            distances[
              neighbor.node
            ];

          return (
            neighborDistance !==
              Infinity &&
            neighborDistance !==
              undefined &&
            neighborDistance +
              Number(neighbor.cost) ===
              distances[target]
          );
        }
      );

    if (predecessor) {
      previous[target] =
        predecessor.node;
    }
  });

  return {
    path,
    distance:
      distances[destination],

    reachable: true,

    distances,

    previous,

    distanceVectors,

    nextHops,

    iterations,
  };
}
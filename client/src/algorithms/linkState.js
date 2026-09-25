import { dijkstra } from "./dijkstra";


/*
 * Link State Routing
 *
 * In Link State Routing, routers advertise
 * information about their directly connected
 * links.
 *
 * The collected information forms a
 * Link-State Database (LSDB).
 *
 * Each router can then construct the complete
 * network topology and run Shortest Path
 * First (SPF).
 *
 * SPF is implemented using Dijkstra.
 */


export function linkState(
  graph,
  start,
  destination
) {

  const nodes =
    Object.keys(graph);


  /*
   * =========================================
   * LINK-STATE DATABASE
   * =========================================
   *
   * Each router advertises:
   *
   * Router
   *   ↓
   * Neighbor
   *   ↓
   * Link Cost
   *
   * Example:
   *
   * R1:
   *   R2 -> 2
   *   R3 -> 5
   */

  const linkStateDatabase = {};


  nodes.forEach((node) => {

    linkStateDatabase[node] =
      graph[node].map(
        (neighbor) => ({
          neighbor:
            neighbor.node,

          cost:
            Number(
              neighbor.cost
            ),
        })
      );

  });


  /*
   * =========================================
   * BUILD TOPOLOGY FROM LSDB
   * =========================================
   *
   * The LSDB contains the complete
   * information required to reconstruct
   * the network topology.
   *
   * Since NetViz currently uses
   * bidirectional links, each advertised
   * connection is represented in both
   * directions.
   */

  const topology = {};


  nodes.forEach((node) => {

    topology[node] = [];

  });


  nodes.forEach((node) => {

    const links =
      linkStateDatabase[node];


    links.forEach((link) => {

      topology[node].push({

        node:
          link.neighbor,

        cost:
          link.cost,

      });

    });

  });


  /*
   * =========================================
   * SHORTEST PATH FIRST
   * =========================================
   *
   * The router runs SPF on the topology
   * reconstructed from the LSDB.
   *
   * Dijkstra is the SPF algorithm used here.
   */

  const result =
    dijkstra(
      topology,
      start,
      destination
    );


  /*
   * Return the normal routing result plus
   * Link-State-specific information.
   */

  return {

    ...result,

    linkStateDatabase,

    topology,

    routingMethod:
      "Shortest Path First",

  };

}
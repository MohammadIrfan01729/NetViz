export function buildGraph(nodes, edges) {

  const graph = {};


  // -----------------------------------------
  // Create empty adjacency list
  // -----------------------------------------

  nodes.forEach((node) => {

    graph[node.id] = [];

  });


  // -----------------------------------------
  // Add edges
  // -----------------------------------------

  edges.forEach((edge) => {

    const source = edge.source;

    const target = edge.target;

    const cost = Number(
      edge.data?.cost ?? 1
    );


    // Network links are bidirectional
    graph[source].push({

      node: target,

      cost,

    });


    graph[target].push({

      node: source,

      cost,

    });

  });


  return graph;

}
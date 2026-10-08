// NetViz - Ring Topology
// 8 routers arranged in a closed ring.
// Format:
// Router variable = new Router("ID", "Role", "IP Address", priority)
// link(source, target, cost, delay, bandwidth, packetLoss)

Router r1 = new Router(
    "R1",
    "Core Router",
    "10.0.0.1",
    100
);

Router r2 = new Router(
    "R2",
    "Router",
    "10.0.0.2",
    80
);

Router r3 = new Router(
    "R3",
    "Edge Router",
    "10.0.0.3",
    70
);

Router r4 = new Router(
    "R4",
    "Router",
    "10.0.0.4",
    60
);

Router r5 = new Router(
    "R5",
    "Gateway",
    "10.0.0.5",
    90
);

Router r6 = new Router(
    "R6",
    "Router",
    "10.0.0.6",
    65
);

Router r7 = new Router(
    "R7",
    "Edge Router",
    "10.0.0.7",
    75
);

Router r8 = new Router(
    "R8",
    "Router",
    "10.0.0.8",
    55
);

// Ring links
link(r1, r2, 5, 10, 100, 0);
link(r2, r3, 7, 15, 100, 1);
link(r3, r4, 4, 8, 80, 0);
link(r4, r5, 6, 12, 100, 2);
link(r5, r6, 5, 10, 90, 0);
link(r6, r7, 8, 18, 75, 1);
link(r7, r8, 4, 9, 100, 0);
link(r8, r1, 6, 14, 100, 1);

import { useEffect, useRef } from "react";


function usePacketEngine({
  packets,
  setPackets,
  edges,
  isSimulating,
  setIsSimulating,
}) {

  const timersRef = useRef(
    new Map()
  );


  useEffect(() => {

    if (
      !isSimulating ||
      packets.length === 0
    ) {
      return;
    }


    const findEdge = (
      source,
      target
    ) => {

      return edges.find(
        (edge) =>
          (
            edge.source === source &&
            edge.target === target
          ) ||
          (
            edge.source === target &&
            edge.target === source
          )
      );
    };


    packets.forEach((packet) => {

      /*
       * Finished packets do not need
       * further processing.
       */

      if (
        packet.status === "delivered" ||
        packet.status === "lost"
      ) {
        return;
      }


      /*
       * A timer already exists for
       * this packet.
       */

      if (
        timersRef.current.has(
          packet.id
        )
      ) {
        return;
      }


      /*
       * Check whether packet has
       * reached its destination.
       */

      if (
        packet.currentHop >=
        packet.path.length - 1
      ) {

        setPackets(
          (currentPackets) =>
            currentPackets.map(
              (currentPacket) => {

                if (
                  currentPacket.id !==
                  packet.id
                ) {
                  return currentPacket;
                }

                const deliveredAt =
                  Date.now();

                return {
                  ...currentPacket,

                  currentNode:
                    currentPacket
                      .destination,

                  status:
                    "delivered",

                  deliveredAt,

                  delay:
                    deliveredAt -
                    currentPacket.createdAt,
                };
              }
            )
        );

        return;
      }


      const currentNode =
        packet.path[
          packet.currentHop
        ];

      const nextNode =
        packet.path[
          packet.currentHop + 1
        ];


      /*
       * Find the link between
       * current and next router.
       */

      const edge =
        findEdge(
          currentNode,
          nextNode
        );


      /*
       * If the route says the
       * link exists but it was
       * removed, lose the packet.
       */

      if (!edge) {

        setPackets(
          (currentPackets) =>
            currentPackets.map(
              (currentPacket) =>
                currentPacket.id ===
                packet.id
                  ? {
                      ...currentPacket,

                      status:
                        "lost",

                      lossReason:
                        "Link unavailable",
                    }
                  : currentPacket
            )
        );

        return;
      }


      const linkDelay =
        Math.max(
          0,
          Number(
            edge.data?.delay ?? 10
          )
        );


      /*
       * Mark packet as travelling.
       */

      setPackets(
        (currentPackets) =>
          currentPackets.map(
            (currentPacket) =>
              currentPacket.id ===
              packet.id
                ? {
                    ...currentPacket,

                    status:
                      "in-transit",
                  }
                : currentPacket
          )
      );


      /*
       * For now we exaggerate the
       * network delay visually.
       *
       * Later, animation will use
       * this timing more naturally.
       */

      const simulationDelay =
        Math.max(
          linkDelay * 10,
          200
        );


      const timer =
        setTimeout(() => {

          timersRef.current.delete(
            packet.id
          );


          setPackets(
            (currentPackets) =>
              currentPackets.map(
                (currentPacket) =>
                  currentPacket.id ===
                  packet.id
                    ? {
                        ...currentPacket,

                        currentHop:
                          currentPacket
                            .currentHop +
                          1,

                        currentNode:
                          nextNode,

                        delay:
                          currentPacket
                            .delay +
                          linkDelay,

                        status:
                          "in-transit",
                      }
                    : currentPacket
              )
          );

        }, simulationDelay);


      timersRef.current.set(
        packet.id,
        timer
      );

    });


    /*
     * Stop simulation once every
     * packet has finished.
     */

    const allFinished =
      packets.every(
        (packet) =>
          packet.status ===
            "delivered" ||
          packet.status ===
            "lost"
      );


    if (allFinished) {
      setIsSimulating(false);
    }


  }, [
    packets,
    edges,
    isSimulating,
    setPackets,
    setIsSimulating,
  ]);


  /*
   * Cleanup timers when the
   * component is removed.
   */

  useEffect(() => {

    return () => {

      timersRef.current.forEach(
        (timer) => {
          clearTimeout(timer);
        }
      );

      timersRef.current.clear();

    };

  }, []);

}


export default usePacketEngine;
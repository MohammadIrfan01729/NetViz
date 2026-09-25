export function createPacket({
  id,
  source,
  destination,
  path,
  size,
}) {
  return {
    id,

    source,

    destination,

    path,

    currentHop: 0,

    currentNode: source,

    size,

    status: "generated",

    createdAt: Date.now(),

    deliveredAt: null,

    delay: 0,

    lossReason: null,
  };
}
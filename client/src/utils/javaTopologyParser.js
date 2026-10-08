const VALID_ROLES = new Set([
  "Core Router",
  "Edge Router",
  "Router",
  "Gateway",
]);

const DEFAULTS = { cost: 1, delay: 10, bandwidth: 100, packetLoss: 0 };

const cleanToken = (value) => String(value ?? "").trim().replace(/^['"]|['"]$/g, "").trim();

const parseNumber = (value, field, minimum = 0) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number < minimum) {
    throw new Error(`Invalid ${field}: "${value}". Expected a number >= ${minimum}.`);
  }
  return number;
};

const splitArguments = (content) => {
  const result = [];
  let current = "";
  let quote = null;
  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    if ((char === '"' || char === "'") && content[i - 1] !== "\\") {
      quote = quote === null ? char : quote === char ? null : quote;
      current += char;
      continue;
    }
    if (char === "," && quote === null) {
      result.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  if (current.trim()) result.push(current.trim());
  return result;
};

const stripComments = (source) => source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");

const createPosition = (index, total) => {
  if (total <= 1) return { x: 350, y: 220 };
  const columns = Math.min(4, Math.max(2, Math.ceil(Math.sqrt(total))));
  return { x: 100 + (index % columns) * 190, y: 110 + Math.floor(index / columns) * 150 };
};

const hasRouterId = (routers, id) => [...routers.values()].some((router) => router.id === id);

export function parseJavaTopology(source) {
  if (typeof source !== "string" || !source.trim()) throw new Error("The Java file is empty.");

  const text = stripComments(source);
  const routers = new Map();
  const links = [];

  const routerPattern = /Router\s+([A-Za-z_$][\w$]*)\s*=\s*new\s+Router\s*\(([\s\S]*?)\)\s*;/g;
  let routerMatch;

  while ((routerMatch = routerPattern.exec(text)) !== null) {
    const variableName = routerMatch[1];
    const args = splitArguments(routerMatch[2]).map(cleanToken);

    if (routers.has(variableName)) throw new Error(`Duplicate router variable: "${variableName}".`);
    if (args.length < 1 || args.length > 4) {
      throw new Error(`Router "${variableName}" must contain 1 to 4 arguments: id, role, ipAddress, priority.`);
    }

    const id = args[0];
    if (!id) throw new Error(`Router "${variableName}" has an empty ID.`);
    if (hasRouterId(routers, id)) throw new Error(`Duplicate router ID: "${id}".`);

    const role = args[1] || "Router";
    if (!VALID_ROLES.has(role)) {
      throw new Error(`Invalid role "${role}" for router "${id}". Use Core Router, Edge Router, Router, or Gateway.`);
    }

    routers.set(variableName, {
      id,
      role,
      ipAddress: args[2] || "",
      priority: args[3] ? parseNumber(args[3], `priority for router "${id}"`, 1) : 1,
      failed: false,
    });
  }

  if (routers.size === 0) {
    throw new Error('No Router definitions were found. Example: Router r1 = new Router("R1", "Router", "10.0.0.1");');
  }

  const linkPattern = /(?:link|connect)\s*\(([\s\S]*?)\)\s*;/g;
  let linkMatch;
  let linkIndex = 1;

  while ((linkMatch = linkPattern.exec(text)) !== null) {
    const args = splitArguments(linkMatch[1]).map(cleanToken);
    if (args.length < 2 || args.length > 6) {
      throw new Error(`Link ${linkIndex} must contain 2 to 6 arguments: source, target, cost, delay, bandwidth, packetLoss.`);
    }

    const source = routers.get(args[0]) || [...routers.values()].find((router) => router.id === args[0]);
    const target = routers.get(args[1]) || [...routers.values()].find((router) => router.id === args[1]);

    if (!source || !target) throw new Error(`Link ${linkIndex} references an unknown router: "${args[0]}" or "${args[1]}".`);
    if (source.id === target.id) throw new Error(`Link ${linkIndex} cannot connect "${source.id}" to itself.`);

    const cost = args[2] ? parseNumber(args[2], `cost for link ${linkIndex}`, 1) : DEFAULTS.cost;
    const delay = args[3] ? parseNumber(args[3], `delay for link ${linkIndex}`, 0) : DEFAULTS.delay;
    const bandwidth = args[4] ? parseNumber(args[4], `bandwidth for link ${linkIndex}`, 1) : DEFAULTS.bandwidth;
    const packetLoss = args[5] ? parseNumber(args[5], `packet loss for link ${linkIndex}`, 0) : DEFAULTS.packetLoss;
    if (packetLoss > 100) throw new Error(`Packet loss for link ${linkIndex} cannot exceed 100%.`);

    links.push({
      id: `${source.id}-${target.id}-java-${linkIndex}`,
      source: source.id,
      target: target.id,
      type: "default",
      label: String(cost),
      data: {
        cost,
        delay,
        bandwidth,
        packetLoss,
        failed: false,
        direction: "bidirectional",
        linkType: "ethernet",
      },
      style: { stroke: "#58a6ff", strokeWidth: 2 },
    });
    linkIndex += 1;
  }

  const routerList = [...routers.values()];
  const nodes = routerList.map((router, index) => ({
    id: router.id,
    type: "router",
    position: createPosition(index, routerList.length),
    data: {
      label: router.id,
      role: router.role,
      ipAddress: router.ipAddress || `10.0.0.${index + 1}`,
      priority: router.priority,
      failed: router.failed,
    },
  }));

  return { nodes, edges: links, routerCount: nodes.length, linkCount: links.length };
}

export const JAVA_TOPOLOGY_EXAMPLE = `Router r1 = new Router("R1", "Core Router", "10.0.0.1", 100);
Router r2 = new Router("R2", "Router", "10.0.0.2", 50);
Router r3 = new Router("R3", "Edge Router", "10.0.0.3", 40);
Router r4 = new Router("R4", "Gateway", "10.0.0.4", 80);

link(r1, r2, 10, 20, 100, 0);
link(r2, r3, 5, 10, 50, 2);
link(r3, r4, 8, 15, 75, 1);
link(r1, r4, 20, 35, 25, 5);
link(r2, r4, 12, 25, 50, 0);`;
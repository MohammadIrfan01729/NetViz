# 🌐 NetViz — Interactive Network Routing & Packet Flow Simulator

**NetViz** is an interactive network simulation and visualization platform designed to help users understand **computer network topology, routing algorithms, packet transmission, network statistics, and routing behavior** through a visual interface.

The project combines **Computer Networks concepts with the MERN stack** to provide an interactive environment where users can create network topologies, configure routers and links, simulate packet transmission, analyze routing information, persist their work, and generate network topologies from a controlled Java topology-definition file.

---

## 👥 Team

| Team Member | Role |
|---|---|
| **Mohammad Irfan** | Full-Stack Development, Network Simulation & Routing |
| **Shreeram** | Development & Network Concepts |
| **Deekshith** | Development, Testing & Documentation |

---

# 📌 Problem Statement

Understanding computer networking concepts such as **routing, shortest-path algorithms, packet transmission, routing tables, and network failures** can be difficult when they are taught only through theoretical diagrams and static examples.

Traditional network simulation tools can also be complex for beginners and may not provide a simple, interactive environment for experimenting with network topologies and observing routing behavior.

### Problem

There is a need for an **interactive and user-friendly network simulation platform** that allows users to:

- Create and modify network topologies visually.
- Add routers and establish network links.
- Configure network parameters.
- Calculate routes between different routers.
- Visualize routing decisions.
- Simulate packet transmission.
- Monitor packet loss and network statistics.
- Understand routing tables and network behavior in real time.

**NetViz addresses this problem by combining network simulation algorithms with an interactive web-based visualization interface.**

---

# 🎯 Objectives

The major objectives of NetViz are:

1. **Interactive Network Topology Creation**  
   Allow users to visually create routers and establish connections between them.

2. **Routing Simulation**  
   Implement routing algorithms such as **Dijkstra's Shortest Path Algorithm** to determine optimal routes.

3. **Routing Table Generation**  
   Generate and display routing information for individual routers.

4. **Packet Flow Simulation**  
   Allow users to create packets between source and destination routers and observe their transmission through the network.

5. **Network Statistics**  
   Provide information about packet delivery, packet loss, routing behavior, and other network metrics.

6. **Network Modeling**  
   Support different router roles and configurable network topologies.

7. **Educational Visualization**  
   Convert complex networking concepts into an interactive visual experience.

8. **Future Routing Algorithm Support**  
   Provide a foundation for implementing additional routing techniques such as **Distance Vector Routing**.

---

# 🏗️ System Architecture

NetViz follows a **client-server architecture based on the MERN stack**, with routing and packet-simulation logic primarily executed in the browser.

```text
                         ┌──────────────────────────────┐
                         │            USER              │
                         │         Web Browser          │
                         └──────────────┬───────────────┘
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │       React Frontend         │
                         │                              │
                         │  Authentication / Profile    │
                         │  Interactive React Flow      │
                         │  Routing Algorithms          │
                         │  Packet Simulation           │
                         │  Statistics / Event Log      │
                         │  Network Health / Modeling   │
                         │  Topology Presets            │
                         │  Java Topology Generator    │
                         └──────────────┬───────────────┘
                                        │
                                  REST API / HTTP
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │      Node.js / Express       │
                         │                              │
                         │  JWT Authentication          │
                         │  User Management             │
                         │  Protected Topology APIs     │
                         │  Topology CRUD               │
                         └──────────────┬───────────────┘
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │        MongoDB Atlas          │
                         │                              │
                         │  users                       │
                         │  topologies                  │
                         │  User-owned topology data    │
                         └──────────────────────────────┘
```

### Frontend

The frontend is developed using **React.js**.

Major components include:

- `NetworkCanvas`
- `RoutingPanel`
- `StatisticsPanel`
- `LinkProperties`
- `RouteResult`
- `RoutingTable`
- `PacketGenerator`
- `PacketStatus`
- `RouterNode`
- `NetworkModeling`
- `TopologyPresets`
- `NetworkHealthPanel`
- `NetworkModelPanel`
- `JavaTopologyGenerator`
- `PacketInspector`
- `PacketEventLog`
- `Profile`
- `Login`
- `Register`

**React Flow** is used to provide the interactive network topology canvas.

### Backend

The backend is developed using:

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**

The backend is responsible for:

- User authentication
- API handling
- Network data management
- Simulation-related operations
- Database communication

### Database

**MongoDB** is used as the database with **Mongoose** providing object modeling between Node.js and MongoDB.

---

# ⭐ Technical Novelty

These are the **3 strongest technical points** of NetViz.

## 1️⃣ Interactive Network Topology + Algorithm Visualization

Instead of simply calculating a shortest path using an algorithm, NetViz connects the **algorithmic output with a visual network topology**.

Users can:

```text
Create Routers
      ↓
Connect Routers
      ↓
Create Network Graph
      ↓
Run Routing Algorithm
      ↓
Calculate Shortest Path
      ↓
Display Routing Result
```

This demonstrates practical integration of:

- Graph algorithms
- Data structures
- Computer Networks
- React-based visualization

---

# 2️⃣ Network Simulation + Real-Time Statistics

NetViz goes beyond topology visualization by modeling **packet transmission and network behavior**.

The simulator can track information such as:

- Source and destination
- Selected route
- Packet status
- Packet delivery
- Packet loss
- Network statistics
- Routing information
- Event information

This creates a bridge between:

**Network Theory → Algorithm → Simulation → Visualization**

---

# 3️⃣ Modular Architecture for Extensible Routing Algorithms

The routing and simulation logic is designed in a modular manner so that additional algorithms and network models can be added without redesigning the complete application.

The architecture provides a foundation for implementing:

- Dijkstra's Shortest Path
- Distance Vector Routing
- Additional routing strategies
- Different topology models
- Network health analysis
- Advanced packet simulation

---

# 4️⃣ Java-Based Topology Generation

NetViz includes a **controlled Java topology-definition parser** that converts supported `.java` files into React Flow nodes and links.

```text
Java Topology Definition
          ↓
Upload / Paste .java File
          ↓
Parse & Validate
          ↓
Generate React Flow Topology
          ↓
Routing / Simulation
```

The feature supports router roles, IP addresses, priorities, link cost, delay, bandwidth, and packet loss. It parses a defined topology syntax and **does not execute arbitrary Java code**.

---

# 🧠 Core Technologies

### Frontend

- React.js
- JavaScript
- React Flow
- HTML5
- CSS3
- Lucide React

### Backend

- Node.js
- Express.js
- REST APIs

### Database

- MongoDB
- Mongoose

### Networking & Algorithms

- Graph Representation
- Dijkstra's Algorithm
- Shortest Path Routing
- Routing Tables
- Packet Simulation
- Network Topology Modeling
- Packet Loss Analysis

### Development Tools

- Git
- GitHub
- VS Code
- npm
- Nodemon

---

# 📂 Project Structure

```text
NetViz/
│
├── client/
│   ├── public/
│   └── src/
│       ├── algorithms/
│       │   ├── dijkstra.js
│       │   ├── bellmanFord.js
│       │   ├── distanceVector.js
│       │   └── linkState.js
│       ├── components/
│       │   ├── auth/
│       │   ├── layout/
│       │   ├── network/
│       │   │   ├── NetworkCanvas.jsx
│       │   │   ├── RouterNode.jsx
│       │   │   ├── LinkProperties.jsx
│       │   │   ├── NetworkHealthPanel.jsx
│       │   │   ├── NetworkModelPanel.jsx
│       │   │   ├── TopologyPresetsPanel.jsx
│       │   │   └── JavaTopologyGenerator.jsx
│       │   ├── packet/
│       │   ├── routing/
│       │   └── statistics/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Profile.jsx
│       │   ├── Dashboard.jsx
│       │   └── Simulator.jsx
│       ├── services/
│       ├── utils/
│       │   ├── graphUtils.js
│       │   ├── packetUtils.js
│       │   ├── routingTable.js
│       │   └── javaTopologyParser.js
│       └── App.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── topologyController.js
│   ├── models/
│   │   ├── User.js
│   │   └── Topology.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── topologyRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── index.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd NetViz
```

---

## 2. Install Frontend Dependencies

```bash
cd client
npm install
```

---

## 3. Install Backend Dependencies

Open another terminal:

```bash
cd server
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Replace the values with your actual configuration.

**Do not commit `.env` files or secrets to GitHub.**

---

# ▶️ Run the Application

### Start Backend

```bash
cd server
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

Then open the URL displayed by the development server, typically:

```text
http://localhost:5173
```

---

# 🔄 Application Workflow

```text
            User Login / Registration
                     │
                     ▼
             Network Workspace
                     │
                     ▼
            Create Network Nodes
                     │
                     ▼
             Connect Routers
                     │
                     ▼
             Configure Network
                     │
                     ▼
              Select / Run Route
                     │
                     ▼
          Routing Algorithm Execution
                     │
                     ▼
              Generate Route
                     │
                     ▼
              Packet Simulation
                     │
                     ▼
       Statistics + Routing Information
```

---

# 📊 Key Features

- 🔐 User Registration, Login & JWT Authentication
- 👤 Profile Management & Password Change
- 🖥️ Interactive React Flow Network Canvas
- 🌐 Router Creation and Movement
- 🔗 Network Link Creation and Configuration
- 🧭 Dijkstra Shortest Path Routing
- 📐 Bellman-Ford Routing
- 🔄 Distance Vector Routing
- 🕸️ Link State Routing
- 📋 Routing Table & Next-Hop Information
- 📦 Packet Generation & Logical Packet Simulation
- ⏱️ Delay Modeling
- 📶 Bandwidth Modeling
- ⚠️ Packet Loss Simulation
- 🚦 Congestion Simulation
- ❌ Link Failure Simulation
- ❌ Router Failure Simulation
- 🔁 Automatic Rerouting
- 📊 Network Statistics
- 📝 Packet Event Log
- 🔎 Packet Inspector
- ❤️ Network Health Monitoring
- ⚙️ Network Modeling
- 🗺️ Line, Ring, Mesh & Redundant Topology Presets
- 💾 Save, Load & Delete Topologies
- 👥 User-specific Topology Persistence
- ☕ Java `.java` Topology Generation
- 🧩 Modular Routing & Simulation Architecture

---

# 🔮 Future Scope

The current planned feature set is complete. Possible future extensions include:

- More advanced routing protocols such as OSPF/RIP-style behavior
- More detailed traffic and queue modeling
- Larger-scale network simulation
- Real-time collaborative topology editing
- Cloud deployment and production monitoring
- Advanced analytics and performance comparison
- Additional topology-import formats
- More comprehensive automated testing
- Optional packet animation as a separate visualization mode

---

# 🎓 Academic Relevance

NetViz combines concepts from:

- Computer Networks
- Data Structures and Algorithms
- Operating Systems
- Database Management Systems
- Web Development
- Software Engineering
- Distributed Systems

It provides a practical implementation of networking concepts that are normally studied through theoretical diagrams and algorithms.

---

# ✅ Final Feature Scope

```text
Interactive Topology Editor
        +
Four Routing Approaches
        +
Packet Simulation
        +
Delay / Bandwidth / Loss / Congestion
        +
Link & Router Failure
        +
Automatic Rerouting
        +
Network Health & Modeling
        +
Topology Presets
        +
Save / Load / Delete
        +
User Authentication & Profile
        +
Java Topology Generation
        =
Complete NetViz Network Simulation Workspace
```

**Packet animation is intentionally not part of the current feature scope.**

---

# 💼 Why This Project Matters

NetViz demonstrates the ability to take a **Computer Networks problem and transform it into a complete full-stack application**.

The project involves:

```text
Computer Networks
       +
Graph Algorithms
       +
React Visualization
       +
Backend APIs
       +
Database
       +
Simulation
       =
          NetViz
```

This makes the project relevant to roles involving:

- Full-Stack Development
- Software Engineering
- Backend Development
- Cloud & DevOps
- Network Engineering
- Systems Engineering

---

# 👨‍💻 Team

### Mohammad Irfan

Full-Stack Development • Network Simulation • Routing Algorithms

### Shreeram

Development • Network Concepts • Testing

### Deekshith

Development • Testing • Documentation

---

# 📝 Final Project Description

**NetViz** is a full-stack, browser-based network routing and packet-flow simulator that combines interactive topology modeling, multiple routing algorithms, configurable network conditions, failure-aware automatic rerouting, network-health analysis, persistent user-specific topologies, authentication/profile management, and controlled Java-based topology generation in a unified educational interface.

---

# 📬 Contact

### Mohammad Irfan

**LinkedIn:**  
[www.linkedin.com/in/mdirfan01729](https://www.linkedin.com/in/mdirfan01729)

---

# ⭐ Support

If you find **NetViz** useful or interesting, consider giving the repository a ⭐ on GitHub.

---

## 📄 License

This project was developed for **academic and educational purposes**.

# 🌐 NetViz — Interactive Network Routing & Packet Flow Simulator

**NetViz** is an interactive network simulation and visualization platform designed to help users understand **computer network topology, routing algorithms, packet transmission, network statistics, and routing behavior** through a visual interface.

The project combines **Computer Networks concepts with the MERN stack** to provide an interactive environment where users can create network topologies, configure routers and links, simulate packet transmission, and analyze routing information.

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

NetViz follows a **client-server architecture based on the MERN stack**.

```text
                    ┌──────────────────────────┐
                    │          USER            │
                    │     Web Browser          │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │       React Frontend     │
                    │                          │
                    │  Network Visualization   │
                    │  Routing Panel           │
                    │  Statistics Panel        │
                    │  Packet Generator        │
                    │  Routing Table           │
                    │  Topology Presets        │
                    └────────────┬─────────────┘
                                 │
                          REST API / HTTP
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │       Node.js            │
                    │       Express.js         │
                    │                          │
                    │  Authentication          │
                    │  Network Logic           │
                    │  Simulation APIs         │
                    │  Routing Operations      │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │        MongoDB            │
                    │                          │
                    │  User Data               │
                    │  Network Data             │
                    │  Simulation Data          │
                    └──────────────────────────┘
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

# ⭐ Technical Novelty / Interview Highlights

These are the **3 strongest technical points** of NetViz that can be highlighted during interviews.

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

### Interview Value

This allows us to explain how a theoretical graph algorithm such as **Dijkstra's Algorithm** can be converted into a practical network-routing system.

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

### Interview Value

This demonstrates understanding of both **Computer Networks and software engineering**, rather than implementing an isolated algorithm.

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

### Interview Value

This demonstrates:

- Modular design
- Separation of concerns
- Extensibility
- Algorithm abstraction
- Scalable software architecture

Instead of building the project only for one algorithm, the system is designed as a **network simulation platform**.

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
│   │
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── auth/
│       │   ├── NetworkCanvas/
│       │   ├── RoutingPanel/
│       │   ├── StatisticsPanel/
│       │   ├── PacketGenerator/
│       │   └── ...
│       │
│       ├── context/
│       ├── pages/
│       ├── services/
│       ├── utils/
│       └── ...
│
├── server/
│   │
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── index.js
│   └── package.json
│
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

- 🔐 User Authentication
- 🖥️ Interactive Network Canvas
- 🌐 Router Creation
- 🔗 Network Link Creation
- 🧭 Shortest Path Routing
- 📋 Routing Table Generation
- 📦 Packet Generation
- 📈 Network Statistics
- ⚠️ Packet Loss Monitoring
- 🗺️ Topology Presets
- ⚙️ Network Modeling
- 📊 Simulation Information
- 🔌 Extensible Routing Architecture

---

# 🔮 Future Scope

Future versions of NetViz can include:

- Distance Vector Routing
- Bellman-Ford based routing
- RIP simulation
- OSPF concepts
- Advanced network health monitoring
- Congestion simulation
- Bandwidth and latency modeling
- Multiple packet types
- Network failure simulation
- Performance analytics
- More advanced routing protocols
- Cloud deployment
- Multi-user collaborative network simulation

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

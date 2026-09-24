import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="logo">◉ NetViz</div>

        <h1>Interactive Network Routing</h1>

        <p>
          Build network topologies, visualize routing algorithms,
          simulate packet flow and analyze network behavior.
        </p>

        <Link to="/simulator">
          <button className="primary-button">
            Launch Simulator
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
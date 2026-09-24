import { Network } from "lucide-react";

function Navbar() {
  return (
    <header className="navbar">

      <div className="brand">
        <Network size={24} />
        <span>NetViz</span>
      </div>

      <div className="navbar-title">
        Network Routing & Packet Flow Simulator
      </div>

      <div className="navbar-actions">
        <button>Reset</button>
      </div>

    </header>
  );
}

export default Navbar;
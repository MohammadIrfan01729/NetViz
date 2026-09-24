function RoutingPanel() {
  return (
    <div className="panel">

      <h3>Routing</h3>

      <div className="form-group">
        <label>Algorithm</label>

        <select>
          <option>Dijkstra</option>
          <option>Bellman-Ford</option>
          <option>Distance Vector</option>
          <option>Link State</option>
        </select>
      </div>

      <div className="form-group">
        <label>Source</label>

        <select>
          <option>R1</option>
          <option>R2</option>
          <option>R3</option>
          <option>R4</option>
        </select>
      </div>

      <div className="form-group">
        <label>Destination</label>

        <select>
          <option>R4</option>
          <option>R1</option>
          <option>R2</option>
          <option>R3</option>
        </select>
      </div>

      <button className="primary-button">
        Find Shortest Path
      </button>

    </div>
  );
}

export default RoutingPanel;
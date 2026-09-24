function StatisticsPanel({
  nodeCount,
  edgeCount,
}) {

  return (

    <div className="panel">

      <h3>Network Statistics</h3>


      <div className="statistics-grid">


        <div className="stat">

          <span>
            Nodes
          </span>

          <strong>
            {nodeCount}
          </strong>

        </div>


        <div className="stat">

          <span>
            Links
          </span>

          <strong>
            {edgeCount}
          </strong>

        </div>


        <div className="stat">

          <span>
            Packets
          </span>

          <strong>
            0
          </strong>

        </div>


        <div className="stat">

          <span>
            Packet Loss
          </span>

          <strong>
            0%
          </strong>

        </div>


      </div>

    </div>

  );
}

export default StatisticsPanel;
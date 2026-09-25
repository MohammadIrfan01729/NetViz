function RoutingTable({
  table,
  source,
}) {

  if (!table || table.length === 0) {

    return (

      <div className="panel routing-table-panel">

        <h3>
          Routing Table
        </h3>

        <div className="routing-table-empty">

          Calculate a route to generate
          the routing table.

        </div>

      </div>

    );

  }


  return (

    <div className="panel routing-table-panel">

      <div className="routing-table-header">

        <div>

          <h3>
            Routing Table
          </h3>

          <span>
            Router: {source}
          </span>

        </div>

      </div>


      <div className="routing-table-container">

        <table className="routing-table">

          <thead>

            <tr>

              <th>
                Destination
              </th>

              <th>
                Next Hop
              </th>

              <th>
                Cost
              </th>

              <th>
                Path
              </th>

            </tr>

          </thead>


          <tbody>

            {table.map((row) => (

              <tr
                key={row.destination}
                className={
                  row.reachable
                    ? ""
                    : "unreachable-row"
                }
              >

                <td>
                  <strong>
                    {row.destination}
                  </strong>
                </td>


                <td>

                  {row.nextHop}

                </td>


                <td>

                  {row.cost}

                </td>


                <td>

                  {row.path.length > 0
                    ? row.path.join(" → ")
                    : "Unreachable"}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}


export default RoutingTable;
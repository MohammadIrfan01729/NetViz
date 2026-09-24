import { useEffect, useState } from "react";


function LinkProperties({
  edge,
  nodes,
  onUpdate,
  onDelete,
}) {

  const [cost, setCost] = useState(
    edge.data?.cost ?? 1
  );

  const [delay, setDelay] = useState(
    edge.data?.delay ?? 10
  );

  const [bandwidth, setBandwidth] = useState(
    edge.data?.bandwidth ?? 100
  );

  const [packetLoss, setPacketLoss] = useState(
    edge.data?.packetLoss ?? 0
  );


  // -----------------------------------------
  // Update when selected edge changes
  // -----------------------------------------

  useEffect(() => {

    setCost(edge.data?.cost ?? 1);

    setDelay(edge.data?.delay ?? 10);

    setBandwidth(edge.data?.bandwidth ?? 100);

    setPacketLoss(edge.data?.packetLoss ?? 0);

  }, [edge]);


  // -----------------------------------------
  // Find router names
  // -----------------------------------------

  const sourceNode = nodes.find(
    (node) => node.id === edge.source
  );

  const targetNode = nodes.find(
    (node) => node.id === edge.target
  );


  // -----------------------------------------
  // Save
  // -----------------------------------------

  const handleSave = () => {

    const updatedEdge = {

      ...edge,

      label: String(cost),

      data: {

        ...edge.data,

        cost: Number(cost),

        delay: Number(delay),

        bandwidth: Number(bandwidth),

        packetLoss: Number(packetLoss),

      },

    };


    onUpdate(updatedEdge);

  };


  return (

    <div className="panel link-properties">

      <div className="link-properties-header">

        <div>

          <h3>
            Link Properties
          </h3>

          <span>
            {sourceNode?.data?.label ?? edge.source}
            {" → "}
            {targetNode?.data?.label ?? edge.target}
          </span>

        </div>

      </div>


      <div className="link-form">


        {/* Cost */}

        <div className="link-form-group">

          <label>
            Cost
          </label>

          <input
            type="number"
            min="1"
            value={cost}
            onChange={(event) =>
              setCost(event.target.value)
            }
          />

        </div>


        {/* Delay */}

        <div className="link-form-group">

          <label>
            Delay (ms)
          </label>

          <input
            type="number"
            min="0"
            value={delay}
            onChange={(event) =>
              setDelay(event.target.value)
            }
          />

        </div>


        {/* Bandwidth */}

        <div className="link-form-group">

          <label>
            Bandwidth (Mbps)
          </label>

          <input
            type="number"
            min="1"
            value={bandwidth}
            onChange={(event) =>
              setBandwidth(event.target.value)
            }
          />

        </div>


        {/* Packet Loss */}

        <div className="link-form-group">

          <label>
            Packet Loss (%)
          </label>

          <input
            type="number"
            min="0"
            max="100"
            value={packetLoss}
            onChange={(event) =>
              setPacketLoss(event.target.value)
            }
          />

        </div>


      </div>


      <div className="link-actions">

        <button
          className="primary-button"
          onClick={handleSave}
        >
          Save Changes
        </button>


        <button
          className="delete-link-button"
          onClick={() => onDelete(edge.id)}
        >
          Delete Link
        </button>

      </div>

    </div>

  );

}


export default LinkProperties;
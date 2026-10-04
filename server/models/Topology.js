const mongoose = require("mongoose");


// =====================================================
// NODE SCHEMA
// =====================================================

const topologyNodeSchema =
  new mongoose.Schema(
    {
      id: {
        type: String,
        required: true,
      },

      type: {
        type: String,
        default: "router",
      },

      position: {
        x: {
          type: Number,
          required: true,
        },

        y: {
          type: Number,
          required: true,
        },
      },

      data: {
        label: {
          type: String,
          default: "",
        },

        role: {
          type: String,

          enum: [
            "Core Router",
            "Edge Router",
            "Router",
            "Gateway",
          ],

          default: "Router",
        },

        ipAddress: {
          type: String,
          default: "",
        },

        macAddress: {
          type: String,
          default: "",
        },

        model: {
          type: String,
          default: "",
        },

        description: {
          type: String,
          default: "",
        },
      },
    },
    {
      _id: false,
    }
  );


// =====================================================
// EDGE SCHEMA
// =====================================================

const topologyEdgeSchema =
  new mongoose.Schema(
    {
      id: {
        type: String,
        required: true,
      },

      source: {
        type: String,
        required: true,
      },

      target: {
        type: String,
        required: true,
      },

      data: {
        cost: {
          type: Number,
          default: 1,
        },

        delay: {
          type: Number,
          default: 0,
        },

        bandwidth: {
          type: Number,
          default: 100,
        },

        packetLoss: {
          type: Number,
          default: 0,
        },

        failed: {
          type: Boolean,
          default: false,
        },
      },
    },
    {
      _id: false,
    }
  );


// =====================================================
// TOPOLOGY SCHEMA
// =====================================================

const topologySchema =
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        default: "",
      },

      nodes: {
        type: [topologyNodeSchema],
        default: [],
      },

      edges: {
        type: [topologyEdgeSchema],
        default: [],
      },
    },
    {
      timestamps: true,
    }
  );


module.exports =
  mongoose.model(
    "Topology",
    topologySchema
  );
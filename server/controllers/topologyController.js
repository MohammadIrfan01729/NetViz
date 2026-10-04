const Topology = require("../models/Topology");


// =====================================================
// CREATE TOPOLOGY
// =====================================================

const createTopology = async (
  req,
  res
) => {
  try {
    const {
      name,
      description,
      nodes,
      edges,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Topology name is required",
      });
    }

    const topology =
      await Topology.create({
        userId: req.user.id,

        name: name.trim(),

        description:
          description || "",

        nodes:
          Array.isArray(nodes)
            ? nodes
            : [],

        edges:
          Array.isArray(edges)
            ? edges
            : [],
      });

    res.status(201).json({
      success: true,
      message:
        "Topology created successfully",
      topology,
    });
  } catch (error) {
    console.error(
      "Create topology error:"
    );

    console.error(
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to create topology",
    });
  }
};


// =====================================================
// GET ALL USER TOPOLOGIES
// =====================================================

const getTopologies = async (
  req,
  res
) => {
  try {
    const topologies =
      await Topology.find({
        userId: req.user.id,
      }).sort({
        updatedAt: -1,
      });

    res.status(200).json({
      success: true,
      count: topologies.length,
      topologies,
    });
  } catch (error) {
    console.error(
      "Get topologies error:"
    );

    console.error(
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch topologies",
    });
  }
};


// =====================================================
// GET ONE USER TOPOLOGY
// =====================================================

const getTopologyById = async (
  req,
  res
) => {
  try {
    const topology =
      await Topology.findOne({
        _id: req.params.id,
        userId: req.user.id,
      });

    if (!topology) {
      return res.status(404).json({
        success: false,
        message:
          "Topology not found",
      });
    }

    res.status(200).json({
      success: true,
      topology,
    });
  } catch (error) {
    console.error(
      "Get topology error:"
    );

    console.error(
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch topology",
    });
  }
};


// =====================================================
// UPDATE USER TOPOLOGY
// =====================================================

const updateTopology = async (
  req,
  res
) => {
  try {
    const {
      name,
      description,
      nodes,
      edges,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Topology name is required",
      });
    }

    const topology =
      await Topology.findOne({
        _id: req.params.id,
        userId: req.user.id,
      });

    if (!topology) {
      return res.status(404).json({
        success: false,
        message:
          "Topology not found",
      });
    }

    topology.name =
      name.trim();

    topology.description =
      description || "";

    topology.nodes =
      Array.isArray(nodes)
        ? nodes
        : [];

    topology.edges =
      Array.isArray(edges)
        ? edges
        : [];

    const updatedTopology =
      await topology.save();

    res.status(200).json({
      success: true,
      message:
        "Topology updated successfully",
      topology:
        updatedTopology,
    });
  } catch (error) {
    console.error(
      "Update topology error:"
    );

    console.error(
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update topology",
    });
  }
};


// =====================================================
// DELETE USER TOPOLOGY
// =====================================================

const deleteTopology = async (
  req,
  res
) => {
  try {
    const topology =
      await Topology.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id,
      });

    if (!topology) {
      return res.status(404).json({
        success: false,
        message:
          "Topology not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Topology deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete topology error:"
    );

    console.error(
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete topology",
    });
  }
};


module.exports = {
  createTopology,
  getTopologies,
  getTopologyById,
  updateTopology,
  deleteTopology,
};
const express = require("express");

const {
  createTopology,
  getTopologies,
  getTopologyById,
  updateTopology,
  deleteTopology,
} = require("../controllers/topologyController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();


// Every topology operation requires login.

router.use(protect);


router.post(
  "/",
  createTopology
);

router.get(
  "/",
  getTopologies
);

router.get(
  "/:id",
  getTopologyById
);

router.put(
  "/:id",
  updateTopology
);

router.delete(
  "/:id",
  deleteTopology
);


module.exports = router;
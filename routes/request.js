const express = require("express");
const router = express.Router();
const { parseISO } = require("date-fns");

const { validateAuth } = require("../middleware/auth-tools");
const EquipmentRequestService = require("../services/equipment-request.service");
const EquipmentRequest = require("../models/EquipmentRequest");

router.get("/equipment", validateAuth, async (req, res) => {
  const { active } = req.query;
  const equipmentRequestService = new EquipmentRequestService({
    EquipmentRequest,
  });

  try {
    const equipmentRequests =
      await equipmentRequestService.getEquipmentRequests({ active });

    res.status(200).json({ equipmentRequests, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error", success: false });
  }
});

router.post("/equipment", validateAuth, async (req, res) => {
  let { resource, due, usageDuration, purpose } = req.body;

  due = parseISO(due);

  try {
    const equipmentRequestService = new EquipmentRequestService({
      EquipmentRequest,
    });
    const equipmentRequest =
      await equipmentRequestService.createEquipmentRequest({
        resource,
        due,
        usageDuration,
        createdBy: req.token._id,
        purpose,
      });

    if (!equipmentRequest) {
      return res
        .status(400)
        .json({ message: "Resource not available", success: false });
    }

    res.status(200).json({ equipmentRequest, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error", success: false });
  }
});

module.exports = router;

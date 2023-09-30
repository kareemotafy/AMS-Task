const express = require("express");
const router = express.Router();
const { parseISO } = require("date-fns");

const { validateAuth } = require("../middleware/auth-tools");
const EquipmentRequestService = require("../services/equipment-request.service");
const EquipmentRequest = require("../models/EquipmentRequest");
const StaffRequest = require("../models/StaffRequest");
const StaffRequestService = require("../services/staff-request.service");

router.get("/equipment", validateAuth, async (req, res) => {
  const equipmentRequestService = new EquipmentRequestService({
    EquipmentRequest,
  });

  try {
    const equipmentRequests =
      await equipmentRequestService.getEquipmentRequests();

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
router.patch("/equipment/:id", validateAuth, async (req, res) => {
  let { id } = req.params;

  try {
    const equipmentRequestService = new EquipmentRequestService({
      EquipmentRequest,
    });
    const equipmentRequest =
      await equipmentRequestService.confirmRequestIsComplete({
        _id: id,
        completedBy: req.token._id,
      });

    res.status(200).json({ equipmentRequest, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error", success: false });
  }
});

router.get("/staff", validateAuth, async (req, res) => {
  const staffRequestService = new StaffRequestService({
    StaffRequest,
  });

  try {
    const staffRequests = await staffRequestService.getStaffRequests();

    res.status(200).json({ staffRequests, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error", success: false });
  }
});

router.post("/staff", validateAuth, async (req, res) => {
  let { resource, due, usageDuration, purpose } = req.body;

  due = parseISO(due);

  try {
    const staffRequestService = new StaffRequestService({
      StaffRequest,
    });
    const staffRequest = await staffRequestService.createStaffRequest({
      resource,
      due,
      usageDuration,
      createdBy: req.token._id,
      purpose,
    });

    if (!staffRequest) {
      return res
        .status(400)
        .json({ message: "Staff is not available", success: false });
    }

    res.status(200).json({ staffRequest, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error", success: false });
  }
});
router.patch("/staff/:id", validateAuth, async (req, res) => {
  let { id } = req.params;

  try {
    const staffRequestService = new StaffRequestService({
      StaffRequest,
    });
    const staffRequest = await staffRequestService.confirmRequestIsComplete({
      _id: id,
      completedBy: req.token._id,
    });

    res.status(200).json({ staffRequest, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error", success: false });
  }
});

module.exports = router;

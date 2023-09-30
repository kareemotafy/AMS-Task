const express = require("express");
const router = express.Router();
const { parseISO } = require("date-fns");

const { validateAuth } = require("../middleware/auth-tools");
const EquipmentIssueService = require("../services/equipment-request.service");
const EquipmentIssue = require("../models/EquipmentIssue");
const StaffIssue = require("../models/StaffIssue");
const StaffIssueService = require("../services/staff-request.service");

router.get("/equipment", validateAuth, async (req, res) => {
  const equipmentIssueService = new EquipmentIssueService({
    EquipmentIssue,
  });

  try {
    const equipmentIssues = await equipmentIssueService.getEquipmentIssues();

    res.status(200).json({ equipmentIssues, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error", success: false });
  }
});

router.post("/equipment", validateAuth, async (req, res) => {
  let { resource, description } = req.body;

  try {
    const equipmentIssueService = new EquipmentIssueService({
      EquipmentIssue,
    });
    const equipmentIssue = await equipmentIssueService.createEquipmentIssue({
      resource,
      createdBy: req.token._id,
      description,
    });

    if (!equipmentIssue) {
      return res
        .status(400)
        .json({ message: "Unable to create issue", success: false });
    }

    res.status(200).json({ equipmentIssue, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error", success: false });
  }
});
router.patch("/equipment/:id", validateAuth, async (req, res) => {
  let { id } = req.params;

  try {
    const equipmentIssueService = new EquipmentIssueService({
      EquipmentIssue,
    });
    const equipmentIssue = await equipmentIssueService.confirmIssueIsResolved({
      _id: id,
      resolvedBy: req.token._id,
    });

    res.status(200).json({ equipmentIssue, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error", success: false });
  }
});

router.get("/staff", validateAuth, async (req, res) => {
  const staffIssueService = new StaffIssueService({
    StaffIssue,
  });

  try {
    const staffIssues = await staffIssueService.getStaffIssues();

    res.status(200).json({ staffIssues, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error", success: false });
  }
});

router.post("/staff", validateAuth, async (req, res) => {
  let { resource, description } = req.body;

  try {
    const staffIssueService = new StaffIssueService({
      StaffIssue,
    });
    const staffIssue = await staffIssueService.createStaffIssue({
      resource,
      description,
      createdBy: req.token._id,
    });

    if (!staffIssue) {
      return res
        .status(400)
        .json({ message: "Staff is not available", success: false });
    }

    res.status(200).json({ staffIssue, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error", success: false });
  }
});

router.patch("/staff/:id", validateAuth, async (req, res) => {
  let { id } = req.params;

  try {
    const staffIssueService = new StaffIssueService({
      StaffIssue,
    });
    const staffIssue = await staffIssueService.confirmIssueIsResolved({
      _id: id,
      resolvedBy: req.token._id,
    });

    res.status(200).json({ staffIssue, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error", success: false });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { parseISO } = require("date-fns");

const { validateAuth } = require("../middleware/auth-tools");
const EquipmentIssueService = require("../services/equipment-issue.service");
const EquipmentIssue = require("../models/EquipmentIssue");
const StaffIssue = require("../models/StaffIssue");
const StaffIssueService = require("../services/staff-issue.service");

router.get("/", validateAuth, async (req, res) => {
  const equipmentIssueService = new EquipmentIssueService({
    EquipmentIssue,
  });

  const staffIssueService = new StaffIssueService({
    StaffIssue,
  });

  try {
    const equipmentIssues = await equipmentIssueService.getEquipmentIssues();

    const staffIssues = await staffIssueService.getStaffIssues();

    res.status(200).json({
      issues: [
        ...staffIssues.map((e) => ({ ...e, type: "staff" })),
        ...equipmentIssues.map((e) => ({ ...e, type: "equipment" })),
      ].sort((a, b) => a.createdAt - b.createdAt),
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error", success: false });
  }
});

router.post("/", validateAuth, async (req, res) => {
  let { resource, description, type } = req.body;

  let issue;

  try {
    if (type === "equipment") {
      const equipmentIssueService = new EquipmentIssueService({
        EquipmentIssue,
      });
      issue = await equipmentIssueService.createEquipmentIssue({
        resource,
        createdBy: req.token._id,
        description,
      });
    } else if (type === "staff") {
      const staffIssueService = new StaffIssueService({
        StaffIssue,
      });
      issue = await staffIssueService.createStaffIssue({
        resource,
        createdBy: req.token._id,
        description,
      });
    }

    if (!issue) {
      return res
        .status(400)
        .json({ message: "Unable to create issue", success: false });
    }

    res.status(200).json({ issue, success: true });
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

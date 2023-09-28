const express = require("express");
const router = express.Router();

const Staff = require("../models/Staff");
const StaffService = require("../services/staff.service");
const { validateAuth } = require("../middleware/auth-tools");

router.get("/", validateAuth, async (req, res) => {
  const { active } = req.query;

  try {
    const staffService = new StaffService({ Staff });
    const staff = await staffService.getStaff({ active });

    res.status(200).json({ staff, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error", success: false });
  }
});

router.post("/", validateAuth, async (req, res) => {
  const { type, description, active, fullName } = req.body;

  try {
    const staffService = new StaffService({ Staff });
    const staff = await staffService.createStaff({
      type,
      description,
      active,
      fullName,
    });

    res.status(200).json({ staff, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error", success: false });
  }
});

router.patch("/:id", validateAuth, async (req, res) => {
  const { name, description, active, fullName } = req.body;
  const { id } = req.params;

  try {
    const staffService = new StaffService({ Staff });
    const staff = await staffService.updateStaff({
      _id: id,
      name,
      description,
      active,
      fullName,
    });

    res.status(200).json({ staff, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error", success: false });
  }
});

router.delete("/:id", validateAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const staffService = new StaffService({ Staff });
    const staff = await staffService.deleteStaff({ _id: id });

    res.status(200).json({ staff, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error", success: false });
  }
});

module.exports = router;

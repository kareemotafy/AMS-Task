const express = require("express");
const router = express.Router();

const Equipment = require("../models/Equipment");
const EquipmentService = require("../services/equipment.service");
const { validateAuth } = require("../middleware/auth-tools");

router.get("/", validateAuth, async (req, res) => {
  const { active } = req.query;

  try {
    const equipmentService = new EquipmentService({ Equipment });
    const equipment = await equipmentService.getEquipment({ active });

    res.status(200).json({ equipment, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error", success: false });
  }
});

router.post("/", validateAuth, async (req, res) => {
  const { type, description, active, title } = req.body;

  try {
    const equipmentService = new EquipmentService({ Equipment });
    const equipment = await equipmentService.createEquipment({
      type,
      description,
      active,
      title,
    });

    res.status(200).json({ equipment, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error", success: false });
  }
});

router.patch("/:id", validateAuth, async (req, res) => {
  const { type, description, active, title } = req.body;
  const { id } = req.params;

  try {
    const equipmentService = new EquipmentService({ Equipment });
    const equipment = await equipmentService.updateEquipment({
      _id: id,
      type,
      description,
      active,
      title,
    });

    res.status(200).json({ equipment, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error", success: false });
  }
});

router.delete("/:id", validateAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const equipmentService = new EquipmentService({ Equipment });
    const equipment = await equipmentService.deleteEquipment({ id });

    res.status(200).json({ equipment, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error", success: false });
  }
});

module.exports = router;

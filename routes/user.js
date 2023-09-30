const express = require("express");
const router = express.Router();

const User = require("../models/User");
const UserService = require("../services/user.service");
const { validateAuth } = require("../middleware/auth-tools");

router.get("/", validateAuth, async (req, res) => {
  try {
    const userService = new UserService({ User });
    const user = await userService.getUserById(req.token._id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal error",
      success: false,
    });
  }
});
router.get("/all", validateAuth, async (req, res) => {
  try {
    const userService = new UserService({ User });
    const users = await userService.getUsers();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal error",
      success: false,
    });
  }
});

router.patch("/:id", validateAuth, async (req, res) => {
  const { firstName, lastName } = req.body;

  try {
    const userService = new UserService({ User });
    const user = await userService.updateUser({
      _id: req.params.id,
      firstName,
      lastName,
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal error",
      success: false,
    });
  }
});

router.delete("/:id", validateAuth, async (req, res) => {
  try {
    const userService = new UserService({ User });
    const user = await userService.deleteUser(req.params.id);

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal error",
      success: false,
    });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();

const User = require("../models/User");
const UserService = require("../services/user.service");
const { successfulAuthResponse } = require("../middleware/auth-tools");

router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const userService = new UserService({ User });

    const user = await userService.register({
      email,
      password,
      firstName,
      lastName,
      createdAt: new Date(),
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    successfulAuthResponse(res, user, "User Register successful");
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Internal Error.", status: false });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userService = new UserService({ User });
    const user = await userService.login({ email, password });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    successfulAuthResponse(res, user, "User sign in successful");
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Internal error", success: false });
  }
});

router.post("/signout", async (req, res) =>
  res.status(200).clearCookie("token").json({ status: true })
);

module.exports = router;

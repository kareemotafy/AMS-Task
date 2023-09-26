const express = require("express");
const router = express.Router();

const User = require("../models/User");
const UserService = require("../services/user.service");
const { createSecretToken } = require("../middleware/auth-tools");

router.post("/register", async (req, res, next) => {
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
    const token = createSecretToken(user._id);

    res
      .cookie("token", token, {
        withCredentials: true,
        httpOnly: false,
      })
      .status(200)
      .json({ message: "User Register Successful.", status: true, user });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "User Register Failed.", status: false });
  }
});

// router.post("/signin",  );

// router.post("/signout", signOutController);

module.exports = router;

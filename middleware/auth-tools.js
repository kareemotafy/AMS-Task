require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createSecretToken = (_id) => {
  return jwt.sign({ _id }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

const successfulAuthResponse = (res, user, message) => {
  const token = createSecretToken(user._id);

  res
    .cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    })
    .status(200)
    .json({ message, success: true });
};

const translateCookies = (req, res, next) => {
  const jwtSecretKey = process.env.TOKEN_KEY;

  const token = req.cookies?.token;

  req.token = {};
  if (token) {
    try {
      const token = jwt.verify(token, jwtSecretKey);

      req.token = token;
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        message: "Internal error",
      });
    }
  }
  return next();
};

const validateAuth = async (req, res, next) => {
  const { _id } = req.token;

  try {
    let user = await User.findOne({
      _id,
    });

    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: "Auth is required" });
    }

    return next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      message: "Internal error",
    });
  }
};

module.exports = {
  createSecretToken,
  successfulAuthResponse,
  translateCookies,
  validateAuth,
};

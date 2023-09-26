require("dotenv").config();
const jwt = require("jsonwebtoken");

const createSecretToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
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

module.exports = {
  createSecretToken,
  successfulAuthResponse,
};

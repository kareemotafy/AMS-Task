const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  fullName: String,
  type: String,
  description: String,
  active: Boolean,
});

module.exports = mongoose.model("Staff", staffSchema);

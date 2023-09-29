const mongoose = require("mongoose");

const staffRequestSchema = new mongoose.Schema(
  {
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
    due: Date,
    usageDuration: Number, // minutes
    usageEnd: Date, // minutes
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    purpose: String,
    completed: Boolean,
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    completedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("StaffRequest", staffRequestSchema);

const mongoose = require("mongoose");

const equipmentIssueSchema = new mongoose.Schema(
  {
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    description: String,
    resolved: Boolean,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    resolvedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("EquipmentIssue", equipmentIssueSchema);

const mongoose = require("mongoose");

const equipmentRequestSchema = new mongoose.Schema(
  {
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
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

module.exports = mongoose.model("EquipmentRequest", equipmentRequestSchema);

const { addMinutes } = require("date-fns");
const { removeUndefinedValues } = require("../middleware/utils");
class StaffRequestService {
  constructor({ StaffRequest }) {
    this.db = { StaffRequest };
  }

  async getStaffRequests() {
    const { StaffRequest } = this.db;
    return await StaffRequest.find({}).populate(
      "resource createdBy completedBy"
    );
  }

  async validateResourceAvailability({ resource, due, usageEnd }) {
    const { StaffRequest } = this.db;

    const staffRequests = await StaffRequest.find({
      $and: [
        { resource },
        { completed: { $ne: true } },
        {
          $or: [
            {
              due: { $gte: due },
              usageEnd: { $lte: usageEnd },
            },
            {
              $and: [
                {
                  usageEnd: { $gt: due },
                },
                { usageEnd: { $lt: usageEnd } },
              ],
            },
            {
              $and: [{ due: { $gt: due } }, { due: { $lte: usageEnd } }],
            },
            {
              due: { $lt: due },
              usageEnd: { $gte: usageEnd },
            },
          ],
        },
      ],
    });

    return staffRequests.length === 0;
  }

  async createStaffRequest({
    resource,
    due,
    usageDuration,
    createdBy,
    purpose,
  }) {
    const { StaffRequest } = this.db;

    const usageEnd = addMinutes(due, usageDuration);

    const valid = await this.validateResourceAvailability({
      resource,
      due,
      usageEnd,
    });

    if (!valid) {
      return null;
    }

    return await StaffRequest.create({
      resource,
      due,
      usageDuration,
      usageEnd,
      createdBy,
      purpose,
    });
  }

  async confirmRequestIsComplete({ _id, completedBy }) {
    const { StaffRequest } = this.db;

    return await StaffRequest.findOneAndUpdate(
      { _id },
      { completed: true, completedBy, completedAt: new Date() },
      { new: true }
    );
  }
}

module.exports = StaffRequestService;

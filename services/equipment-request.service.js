const { addMinutes } = require("date-fns");

class EquipmentRequestService {
  constructor({ EquipmentRequest }) {
    this.db = { EquipmentRequest };
  }

  async getEquipmentRequests({ active }) {
    const { EquipmentRequest } = this.db;
    return await EquipmentRequest.find(removeUndefinedValues({ active }));
  }

  async validateResourceAvailability({ resource, due, usageEnd }) {
    const { EquipmentRequest } = this.db;

    const equipmentRequests = await EquipmentRequest.find({
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

    return equipmentRequests.length === 0;
  }

  async createEquipmentRequest({
    resource,
    due,
    usageDuration,
    createdBy,
    purpose,
  }) {
    const { EquipmentRequest } = this.db;

    const usageEnd = addMinutes(due, usageDuration);

    const valid = await this.validateResourceAvailability({
      resource,
      due,
      usageEnd,
    });

    if (!valid) {
      return null;
    }

    return await EquipmentRequest.create({
      resource,
      due,
      usageDuration,
      usageEnd,
      createdBy,
      purpose,
    });
  }
}

module.exports = EquipmentRequestService;

const { removeUndefinedValues } = require("../middleware/utils");

class StaffService {
  constructor({ Staff }) {
    this.db = { Staff };
  }

  async getStaff({ active }) {
    const { Staff } = this.db;
    return await Staff.find(removeUndefinedValues({ active }));
  }

  async createStaff({ type, description, active, fullName }) {
    const { Staff } = this.db;
    const staff = await Staff.create({
      type,
      description,
      active,
      fullName,
    });
    return staff;
  }

  async updateStaff({ _id, type, description, active, fullName }) {
    const { Staff } = this.db;
    return await Staff.findByIdAndUpdate(
      _id,
      removeUndefinedValues({ type, description, active, fullName }),
      { new: true }
    );
  }

  async deleteStaff({ _id }) {
    const { Staff } = this.db;
    return await Staff.findByIdAndDelete(_id);
  }
}

module.exports = StaffService;

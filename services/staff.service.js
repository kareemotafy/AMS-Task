import { removeUndefinedValues } from "../middleware/utils";

class StaffService {
  constructor({ Staff }) {
    this.db = { Staff };
  }

  async getStaff({ active }) {
    const { Staff } = this.db;
    return await Staff.find(removeUndefinedValues({ active }));
  }

  async createStaff({ name, description, active, fullName }) {
    const { Staff } = this.db;
    const staff = await Staff.create({
      name,
      description,
      active,
      fullName,
    });
    return staff;
  }

  async updateStaff({ _id, name, description, active, fullName }) {
    const { Staff } = this.db;
    return await Staff.findByIdAndUpdate(
      _id,
      removeUndefinedValues({ name, description, active, fullName }),
      { new: true }
    );
  }

  async deleteStaff({ _id }) {
    const { Staff } = this.db;
    return await Staff.findByIdAndDelete(_id);
  }
}

module.exports = StaffService;

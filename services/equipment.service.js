const { removeUndefinedValues } = require("../middleware/utils");

class EquipmentService {
  constructor({ Equipment }) {
    this.db = { Equipment };
  }

  async getEquipment({ active }) {
    const { Equipment } = this.db;
    return await Equipment.find(removeUndefinedValues({ active }));
  }

  async createEquipment({ type, description, active, title }) {
    const { Equipment } = this.db;
    const equipment = await Equipment.create({
      type,
      description,
      active,
      title,
    });
    return equipment;
  }

  async updateEquipment({ _id, type, description, active, title }) {
    const { Equipment } = this.db;
    return await Equipment.findByIdAndUpdate(
      _id,
      { $set: removeUndefinedValues({ type, description, active, title }) },
      { new: true }
    );
  }

  async deleteEquipment({ _id }) {
    const { Equipment } = this.db;
    return await Equipment.findByIdAndDelete(_id);
  }
}

module.exports = EquipmentService;

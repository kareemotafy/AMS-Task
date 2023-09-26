class EquipmentService {
  constructor({ Equipment }) {
    this.db = { Equipment };
  }

  async getEquipment({ active }) {
    const { Equipment } = this.db;
    return await Equipment.find(removeUndefinedValues({ active }));
  }

  async createEquipment({ name, description, active, title }) {
    const { Equipment } = this.db;
    const equipment = await Equipment.create({
      name,
      description,
      active,
      title,
    });
    return equipment;
  }

  async updateEquipment({ _id, name, description, active, title }) {
    const { Equipment } = this.db;
    return await Equipment.findByIdAndUpdate(
      _id,
      removeUndefinedValues({ name, description, active, title }),
      { new: true }
    );
  }

  async deleteEquipment({ _id }) {
    const { Equipment } = this.db;
    return await Equipment.findByIdAndDelete(_id);
  }
}

module.exports = EquipmentService;

class EquipmentIssueService {
  constructor({ EquipmentIssue }) {
    this.db = { EquipmentIssue };
  }

  async getEquipmentIssues() {
    const { EquipmentIssue } = this.db;
    return await EquipmentIssue.find({})
      .populate("resource createdBy resolvedBy")
      .lean();
  }

  async createEquipmentIssue({ description, createdBy, resource }) {
    const { EquipmentIssue } = this.db;

    return await EquipmentIssue.create({
      description,
      createdBy,
      resource,
    });
  }

  async confirmIssueIsResolved({ _id, resolvedBy }) {
    const { EquipmentIssue } = this.db;

    return await EquipmentIssue.findOneAndUpdate(
      { _id },
      { resolved: true, resolvedBy, resolvedAt: new Date() },
      { new: true }
    );
  }
}
module.exports = EquipmentIssueService;

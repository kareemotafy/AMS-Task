class EquipmentIssueService {
  constructor({ EquipmentIssue }) {
    this.db = { EquipmentIssue };
  }

  async getEquipmentIssues() {
    const { EquipmentIssue } = this.db;
    return await EquipmentIssue.find({}).populate(
      "resource createdBy completedBy"
    );
  }

  async createStaffIssue({ description, createdBy, resource }) {
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

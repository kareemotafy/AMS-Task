class StaffIssueService {
  constructor({ StaffIssue }) {
    this.db = { StaffIssue };
  }

  async getStaffIssues() {
    const { StaffIssue } = this.db;
    return await StaffIssue.find({}).populate("resource createdBy completedBy");
  }

  async createStaffIssue({ description, createdBy, resource }) {
    const { StaffIssue } = this.db;

    return await StaffIssue.create({
      description,
      createdBy,
      resource,
    });
  }

  async confirmIssueIsResolved({ _id, resolvedBy }) {
    const { StaffIssue } = this.db;

    return await StaffIssue.findOneAndUpdate(
      { _id },
      { resolved: true, resolvedBy, resolvedAt: new Date() },
      { new: true }
    );
  }
}

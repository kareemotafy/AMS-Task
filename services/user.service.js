class UserService {
  constructor({ User }) {
    this.db = { User };
  }

  async checkIfUserExists({ email }) {
    const { User } = this.db;
    const user = await User.findOne({ email });
    return !!user ? true : false;
  }

  async register({ email, password, firstName, lastName, createdAt }) {
    const { User } = this.db;

    const existingUser = await this.checkIfUserExists({ email });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      createdAt,
    });

    return user;
  }
}

module.exports = UserService;

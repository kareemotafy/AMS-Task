const bcrypt = require("bcryptjs");

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
      return undefined;
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

  async login({ email, password }) {
    const { User } = this.db;

    const existingUser = await this.checkIfUserExists({ email });

    if (!existingUser) {
      return undefined;
    }
    const user = await User.findOne({ email }).select("+password");
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return undefined;
    }
    return user;
  }
}

module.exports = UserService;

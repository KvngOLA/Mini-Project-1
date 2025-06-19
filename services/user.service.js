const userModel = require("../model/user.model");

class UserService {
  static async findOne(email) {
    return userModel.findOne({ email });
  }
  static async create(data) {
    return userModel.create(data);
  }
  static async update(email, data) {
    return userModel.findOneAndUpdate({ email }, data, {
      new: true,
    });
  }
}

module.exports = UserService;

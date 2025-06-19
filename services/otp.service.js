const otpModel = require("../model/otp.model");

class OtpService {
  static async create(data) {
    return otpModel.create(data);
  }
  static async findOne(author) {
    return otpModel.findOne({ author });
  }
}

module.exports = OtpService;

const nodeCron = require("node-cron");
const userModel = require("../model/user.model");
const emitter = require("../mailer/mailer");

const remindInactiveUsers = () => {
  console.log("Reminder Schdule Started");
  nodeCron.schedule("*/30 * * * * ", async () => {
    try {
      const inactiveUsers = await userModel.find({ verified: false });
      await Promise.all(
        inactiveUsers.map(async (user) => {
          const options = {
            email: user.email,
            subject: "Account activation",
            message: `Hello ${user.name}, your account has not been verified, Please verify your account with the otp sent to you`,
          };

          emitter.emit("send-mail", options);
        })
      );
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports = remindInactiveUsers;

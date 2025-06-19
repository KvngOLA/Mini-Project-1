const nodeCron = require("node-cron");
const userModel = require("../model/user.model");

const deleteInactiveUsers = () => {
  console.log(" Delete Task Scheduler started");
  nodeCron.schedule("0 * * * *", async () => {
    try {
      await userModel.deleteMany({ verified: false });
      console.log(" Inactive users deleted ");
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports = deleteInactiveUsers;

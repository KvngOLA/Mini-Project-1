const generateToken = async () => {
  const otp = Math.floor(Math.random() * 900000) + 10000;
  console.log("Generated Otp");
  return otp;
};

module.exports = generateToken;

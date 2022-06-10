const hospitalSubAdmindb = require("../models/hospitalSubAdmin");
exports.isMHospitalSubAdmin = async (req, res, next) => {
  const mHospitalSubAdmin = await hospitalSubAdmindb.findOne({
    uid: req.user.uid,
    duty: "management",
  });
  if (!mHospitalSubAdmin) {
    res.send("You are not management sub admin");
  } else {
    next();
  }
};

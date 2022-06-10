const hospitalSubAdmindb = require("../models/hospitalSubAdmin");
exports.isFHospitalSubAdmin = async (req, res, next) => {
  const fHospitalSubAdmin = await hospitalSubAdmindb.findOne({
    uid: req.user.uid,
    duty: "finance",
  });
  if (!fHospitalSubAdmin) {
    res.send("You are not finance sub admin");
  } else {
    next();
  }
};

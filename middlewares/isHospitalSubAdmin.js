const hospitalSubAdmindb = require("../models/hospitalSubAdmin");

exports.isHospitalSubAdmin = async (req, res, next) => {
  const hospitalSubAdmin = await hospitalSubAdmindb.findOne({
    uid: req.user.uid,
    password: req.user.password,
  });
  if (!hospitalSubAdmin) {
    res.send("You are not hospital sub-admin");
  } else {
    req.hospitalCode = hospitalSubAdmin.hospitalCode;
    req.typeOfSubAdmin = hospitalSubAdmin.duty;
    next();
  }
};

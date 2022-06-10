const hospitalAdmindb = require("../models/hospitalAdmin");

exports.isHospitalAdmin = async (req, res, next) => {
  const hospitalAdmin = await hospitalAdmindb.findOne({
    uid: req.user.uid,
    password: req.user.password,
  });
  if (!hospitalAdmin) {
    res.status(403).send({ message: "You are not hospital admin" });
  } else {
    req.hospitalCode = hospitalAdmin.hospitalCode;
    next();
  }
};

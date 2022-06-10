const subAdmindb = require("../models/subAdmin");

exports.isSubAdmin = async (req, res, next) => {
  const subAdmin = await subAdmindb.findOne({
    uid: req.user.uid,
    password: req.user.password,
  });
  if (!subAdmin) {
    res.send("You are not sub admin");
  } else {
    next();
  }
};

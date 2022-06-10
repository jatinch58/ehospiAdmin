const subAdmindb = require("../models/subAdmin");
exports.isMSubAdmin = async (req, res, next) => {
  const mSubAdmin = await subAdmindb.findOne({
    uid: req.user.uid,
    duty: "management",
  });
  if (!mSubAdmin) {
    res.send("You are not management sub admin");
  } else {
    next();
  }
};

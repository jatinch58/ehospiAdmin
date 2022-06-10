const subAdmindb = require("../models/subAdmin");
exports.isFSubAdmin = async (req, res, next) => {
  const fSubAdmin = await subAdmindb.findOne({
    uid: req.user.uid,
    duty: "finance",
  });
  if (!fSubAdmin) {
    res.send("You are not finance sub admin");
  } else {
    next();
  }
};

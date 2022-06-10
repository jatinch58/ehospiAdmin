const admindb = require("../models/admin");

exports.isAdmin = async (req, res, next) => {
  const admin = await admindb.findOne({
    uid: req.user.uid,
    password: req.user.password,
  });
  if (!admin) {
    res.send("You are not admin");
  } else {
    next();
  }
};

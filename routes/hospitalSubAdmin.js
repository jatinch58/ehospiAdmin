const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const hospitalSubAdmin = require("../controllers/hospitalSubAdmin");
router.post("/login/hospitalSubAdmin", hospitalSubAdmin.hospitalSubAdminLogin);
router.get(
  "/isHospitalSubAdmin",
  auth.verifyToken,
  hospitalSubAdmin.isHospitalSubAdmin
);
router.put(
  "/edit/hospitalSubAdminPassword",
  auth.verifyToken,
  hospitalSubAdmin.changeHospitalSubAdminPassword
);
router.get(
  "/requests/hospitalSubAdmin",
  auth.verifyToken,
  hospitalSubAdmin.hospitalSubAdminGetRequests
);
router.get(
  "/pendingRequests/hospitalSubAdmin",
  auth.verifyToken,
  hospitalSubAdmin.hospitalSubAdminPendingRequests
);
router.put(
  "/updateRequest/hospitalSubAdmin",
  auth.verifyToken,
  hospitalSubAdmin.hospitalSubAdminUpdateRequests
);
router.post(
  "/addHosRequests/hospitalSubAdmin",
  auth.verifyToken,
  hospitalSubAdmin.hospitalSubAdminAddHosRequests
);
router.get(
  "/getHosRequests/hospitalSubAdmin",
  auth.verifyToken,
  hospitalSubAdmin.hospitalSubAdminHosRequests
);
router.get(
  "/getHosPendingRequests/hospitalSubAdmin",
  auth.verifyToken,
  hospitalSubAdmin.hospitalSubAdminHosPendingRequests
);

module.exports = router;

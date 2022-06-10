const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { isSubAdmin } = require("../middlewares/isSubAdmin");
const { isFSubAdmin } = require("../middlewares/isFSubAdmin");
const { isMSubAdmin } = require("../middlewares/isMSubAdmin");
const subAdmin = require("../controllers/subAdmin");
router.post("/subAdmin/login", subAdmin.subAdminLogin);
router.get("/isSubAdmin", auth.verifyToken, isSubAdmin, subAdmin.isSubAdmin);
router.put(
  "/subAdmin/changePassword",
  auth.verifyToken,
  isSubAdmin,
  subAdmin.changeSubAdminPassword
);
router.get(
  "/subAdmin/getHospitalAdmin",
  auth.verifyToken,
  isMSubAdmin,
  subAdmin.subAdminGetHospitalAdmin
);
router.post(
  "/subAdmin/addHospitalAdmin",
  auth.verifyToken,
  isMSubAdmin,
  subAdmin.subAdminAddHospitalAdmin
);
router.put(
  "/subAdmin/editHospitalAdmin",
  auth.verifyToken,
  isMSubAdmin,
  subAdmin.subAdminEditHospitalAdmin
);
router.delete(
  "/subAdmin/deleteHospitalAdmin",
  auth.verifyToken,
  isMSubAdmin,
  subAdmin.subAdminDeleteHospitalAdmin
);
router.post(
  "/subAdmin/addHospitalSubAdmin",
  auth.verifyToken,
  isMSubAdmin,
  subAdmin.subAdminAddHospitalSubAdmin
);
router.get(
  "/subAdmin/getHospitalSubAdmin",
  auth.verifyToken,
  isMSubAdmin,
  subAdmin.subAdminGetHospitalSubAdmin
);
router.put(
  "/subAdmin/editHospitalSubAdmin",
  auth.verifyToken,
  isMSubAdmin,
  subAdmin.subAdminEditHospitalSubAdmin
);
router.delete(
  "/subAdmin/deleteHospitalSubAdmin",
  auth.verifyToken,
  isMSubAdmin,
  subAdmin.subAdminDeleteHospitalSubAdmin
);
router.get(
  "/subAdmin/getAllRequests",
  auth.verifyToken,
  isMSubAdmin,
  subAdmin.subAdminGetRequests
);
router.get(
  "/subAdmin/getPendingRequests",
  auth.verifyToken,
  isMSubAdmin,
  subAdmin.subAdminPendingRequests
);
router.get(
  "/subAdmin/getHosRequests",
  auth.verifyToken,
  isMSubAdmin,
  subAdmin.subAdminHosRequests
);
router.get(
  "/subAdmin/getHosPendingRequests",
  auth.verifyToken,
  isMSubAdmin,
  subAdmin.subAdminHosPendingRequests
);

module.exports = router;

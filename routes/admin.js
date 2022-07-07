const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { isAdmin } = require("../middlewares/isAdmin");
const admin = require("../controllers/admin");
router.post("/admin/login", admin.adminLogin);
// router.post("/admin/signup", admin.signup);
router.get("/isAdmin", auth.verifyToken, isAdmin, admin.isAdmin);
router.put(
  "/admin/updateProfile",
  auth.verifyToken,
  isAdmin,
  admin.changeAdminProfile
);
router.post("/admin/addSubAdmin", auth.verifyToken, isAdmin, admin.addSubAdmin);
router.get(
  "/admin/getAllSubAdmins",
  auth.verifyToken,
  isAdmin,
  admin.allSubAdmins
);
router.put(
  "/admin/editSubAdminPassword",
  auth.verifyToken,
  isAdmin,
  admin.adminChangeSubAdminPassword
);
router.delete(
  "/admin/deleteSubAdmin",
  auth.verifyToken,
  isAdmin,
  admin.deleteSubAdmin
);
router.get(
  "/admin/getHospitalAdmin",
  auth.verifyToken,
  isAdmin,
  admin.adminGetHospitalAdmin
);
router.post(
  "/admin/addHospitalAdmin",
  auth.verifyToken,
  isAdmin,
  admin.adminAddHospitalAdmin
);
router.put(
  "/admin/editHospitalAdmin",
  auth.verifyToken,
  isAdmin,
  admin.adminEditHospitalAdmin
);
router.delete(
  "/admin/deleteHospitalAdmin",
  auth.verifyToken,
  isAdmin,
  admin.adminDeleteHospitalAdmin
);
router.post(
  "/admin/addHospitalSubAdmin",
  auth.verifyToken,
  isAdmin,
  admin.adminAddHospitalSubAdmin
);
router.get(
  "/admin/getHospitalSubAdmin",
  auth.verifyToken,
  isAdmin,
  admin.adminGetHospitalSubAdmin
);
router.put(
  "/admin/editHospitalSubAdmin",
  auth.verifyToken,
  isAdmin,
  admin.adminEditHospitalSubAdmin
);
router.delete(
  "/admin/deleteHospitalSubAdmin",
  auth.verifyToken,
  isAdmin,
  admin.adminDeleteHospitalSubAdmin
);
router.get(
  "/admin/getAllBookingRequests",
  auth.verifyToken,
  isAdmin,
  admin.adminGetBookingRequests
);
router.get(
  "/admin/getPendingBookingRequests",
  auth.verifyToken,
  isAdmin,
  admin.adminPendingBookingRequests
);
router.get(
  "/admin/getAcceptedBookingRequests",
  auth.verifyToken,
  isAdmin,
  admin.adminAcceptedBookingRequests
);
router.get(
  "/admin/getRejectedBookingRequests",
  auth.verifyToken,
  isAdmin,
  admin.adminRejectedBookingRequests
);
router.put(
  "/admin/updateRejectedRequests",
  auth.verifyToken,
  isAdmin,
  admin.adminRejectedPendingBookingRequests
);
router.get("/admin/getAllUsers", auth.verifyToken, isAdmin, admin.showAllUsers);
router.get(
  "/admin/getAllHospitalBookings",
  auth.verifyToken,
  isAdmin,
  admin.showAllBookings
);

router.post("/addAmenities", auth.verifyToken, isAdmin, admin.addAmenities);
router.get("/getAmenities", auth.verifyToken, isAdmin, admin.getAmenities);
router.delete(
  "/deleteAmenities",
  auth.verifyToken,
  isAdmin,
  admin.deleteAmenities
);

router.post("/addFacilities", auth.verifyToken, isAdmin, admin.addFacilities);
router.get("/getFacilities", auth.verifyToken, isAdmin, admin.getFacilities);
router.delete(
  "/deleteFacilities",
  auth.verifyToken,
  isAdmin,
  admin.deleteFacilities
);
router.post("/addServices", auth.verifyToken, isAdmin, admin.addServices);
router.get("/getServices", auth.verifyToken, isAdmin, admin.getServices);
router.delete(
  "/deleteServices",
  auth.verifyToken,
  isAdmin,
  admin.deleteServices
);
router.get(
  "/admin/signupAllHospital",
  auth.verifyToken,
  isAdmin,
  admin.adminSignupHosAllRequests
);
router.get(
  "/admin/signupPendingHospital",
  auth.verifyToken,
  isAdmin,
  admin.adminSignupHosPendingRequests
);
router.get(
  "/admin/signupAcceptHospital",
  auth.verifyToken,
  isAdmin,
  admin.adminSignupHosAcceptedRequests
);
router.get(
  "/admin/signupRejectHospital",
  auth.verifyToken,
  isAdmin,
  admin.adminSignupHosRejectedRequests
);
router.put(
  "/admin/accept/signupHospital",
  auth.verifyToken,
  isAdmin,
  admin.updateAcceptSignupHosRequests
);
router.put(
  "/admin/reject/signupHospital",
  auth.verifyToken,
  isAdmin,
  admin.updateRejectSignupHosRequests
);

router.post("/addInsurance", auth.verifyToken, isAdmin, admin.addInsurance);
router.get("/getInsurance", auth.verifyToken, isAdmin, admin.getInsurance);
router.delete(
  "/deleteInsurance",
  auth.verifyToken,
  isAdmin,
  admin.deleteInsurance
);
router.post("/addDepartment", auth.verifyToken, isAdmin, admin.addDepartment);
router.get("/getDepartment", auth.verifyToken, isAdmin, admin.getDepartment);
router.delete(
  "/deleteDepartment",
  auth.verifyToken,
  isAdmin,
  admin.deleteDepartment
);
router.post("/addHospital", auth.verifyToken, isAdmin, admin.addHospital);
router.get("/getHospital", auth.verifyToken, isAdmin, admin.getHospital);
router.get(
  "/admin/hospitalDetails/:hospitalCode",
  auth.verifyToken,
  isAdmin,
  admin.getHospitalDetails
);
router.get(
  "/admin/hospitalCount",
  auth.verifyToken,
  isAdmin,
  admin.getHospitalCount
);
router.delete(
  "/admin/deleteBedImages",
  auth.verifyToken,
  isAdmin,
  admin.deleteHospitalImages
);
router.get("/admin/totalBeds", auth.verifyToken, isAdmin, admin.getTotalBeds);
router.get(
  "/admin/totalPatients",
  auth.verifyToken,
  isAdmin,
  admin.getTotalPatients
);
router.get(
  "/admin/totalEarning",
  auth.verifyToken,
  isAdmin,
  admin.getTotalEarning
);
module.exports = router;

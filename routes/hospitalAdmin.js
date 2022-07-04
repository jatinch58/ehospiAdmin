const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const hospitalAdmin = require("../controllers/hospitalAdmin");
const { isHospitalAdmin } = require("../middlewares/isHospitalAdmin");
const { upload } = require("../middlewares/fileUpload");
router.post("/login/hospitalAdmin", hospitalAdmin.hospitalAdminLogin);
router.get(
  "/isHospitalAdmin",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.isHospitalAdmin
);
router.put(
  "/edit/hospitalAdminPassword",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.changeHospitalAdminPassword
);
router.post(
  "/hospitalAdmin/addHospitalSubAdmin",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.hospitalAdminAddHospitalSubAdmin
);
router.get(
  "/hospitalAdmin/getHospitalSubAdmin",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.hospitalAdminGetHospitalSubAdmin
);
router.put(
  "/hospitalAdmin/editHospitalSubAdmin",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.hospitalAdminEditHospitalSubAdmin
);
router.delete(
  "/hospitalAdmin/deleteHospitalSubAdmin",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.hospitalAdminDeleteHospitalSubAdmin
);
router.get(
  "/hospitalAdmin/getAmenities",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.getAmenities
);
router.post(
  "/hospitalAdmin/addAmenities",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.addAmenities
);
router.put(
  "/hospitalAdmin/updateAmenityPrice",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.updateAmenityPrice
);
router.get(
  "/hospitalAdmin/getFullAmenities",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.getFullAmenities
);
router.put(
  "/hospitalAdmin/deleteAmenities/:id",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.deleteAmenities
);
router.get(
  "/hospitalAdmin/getFacilities",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.getFacilities
);
router.post(
  "/hospitalAdmin/addFacilities",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.addFacilities
);
router.get(
  "/hospitalAdmin/getFullFacilities",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.getFullFacilities
);
router.put(
  "/hospitalAdmin/updateFacilityPrice",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.updateFacilityPrice
);
router.put(
  "/hospitalAdmin/deleteFacilities/:id",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.deleteFacilities
);
router.put(
  "/hospitalAdmin/rejectToPending",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.rejectToPending
);
router.get(
  "/hospitalAdmin/getServices",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.getServices
);
router.post(
  "/hospitalAdmin/addServices",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.addServices
);
router.get(
  "/hospitalAdmin/getFullServices",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.getFullServices
);
router.put(
  "/hospitalAdmin/deleteServices/:services",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.deleteServices
);
router.post(
  "/hospitalAdmin/addBedTypes",
  auth.verifyToken,
  isHospitalAdmin,
  upload,
  hospitalAdmin.addBedTypes
);

router.get(
  "/hospitalAdmin/getBedTypes",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.getBedTypes
);
router.put(
  "/hospitalAdmin/deleteBedTypes/:id",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.deleteBedTypes
);
router.get(
  "/hospitalAdmin/getInsurance",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.getInsurance
);
router.post(
  "/hospitalAdmin/addInsurance",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.addInsurance
);
router.get(
  "/hospitalAdmin/getFullInsurance",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.getFullInsurance
);
router.put(
  "/hospitalAdmin/deleteInsurance/:insurance/:tpa",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.deleteInsurance
);
router.get(
  "/hospitalAdmin/getDepartment",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.getDepartment
);
router.post(
  "/hospitalAdmin/addDepartment",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.addDepartment
);

router.get(
  "/hospitalAdmin/getFullDepartment",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.getFullDepartment
);
router.put(
  "/hospitalAdmin/deleteDepartment/:department",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.deleteDepartment
);
router.get(
  "/hospitalAdmin/getAllBookingRequests",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.hospitalAdminGetBookingRequests
);
router.get(
  "/hospitalAdmin/getPendingBookingRequests",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.hospitalAdminPendingBookingRequests
);
router.get(
  "/hospitalAdmin/getAcceptedBookingRequests",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.hospitalAdminAcceptedBookingRequests
);
router.get(
  "/hospitalAdmin/getRejectedBookingRequests",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.hospitalAdminRejectedBookingRequests
);
router.put(
  "/hospitalAdmin/accept/bookingRequests",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.updateAcceptRequests
);
router.put(
  "/hospitalAdmin/reject/bookingRequests",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.updateRejectRequests
);
router.post(
  "/hospitalAdmin/completeBooking",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.completeBookings
);
router.get(
  "/hospitalAdmin/getCompleteBooking",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.getCompletedBooking
);
router.get(
  "/hospitalAdmin/getAllPatients",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.getTotalPatients
);
router.get(
  "/hospitalAdmin/getAllBeds",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.getTotalBeds
);
router.get(
  "/hospitalAdmin/getIncome",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.totalIncome
);
router.post(
  "/hospitalAdmin/uploadPicture",
  auth.verifyToken,
  isHospitalAdmin,
  upload,
  hospitalAdmin.uploadPicture
);
router.delete(
  "/hospitalAdmin/deletePicture",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.deletePicture
);
router.get(
  "/hospitalAdmin/getPicture",
  auth.verifyToken,
  isHospitalAdmin,
  hospitalAdmin.getPictures
);
router.post("/hospitalAdmin/addBedPhoto");
router.delete("/hospitalAdmin/deleteBedPhoto");
module.exports = router;

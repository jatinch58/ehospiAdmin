const express = require("express");
const router = express.Router();
const { signUpHospital } = require("../controllers/hospitalSignup");

router.post("/hospitalSignup", signUpHospital);

module.exports = router;

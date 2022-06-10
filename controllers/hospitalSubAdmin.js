const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const hospitalSubAdmindb = require("../models/hospitalSubAdmin");
const hospitalForm = require("../models/hospitalForm");
const hospitalRequest = require("../models/hospitalRequest");
exports.hospitalSubAdminLogin = async (req, res) => {
  const { body } = req;
  const hospitalSubAdminSchema = Joi.object()
    .keys({
      uid: Joi.string().required(),
      password: Joi.string().required(),
    })
    .required();
  let result = hospitalSubAdminSchema.validate(body);
  if (result.error) {
    res.send("Please enter a valid details");
  } else {
    try {
      const user = await hospitalSubAdmindb.findOne({ uid: req.body.uid });
      if (user) {
        const validPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (validPassword) {
          const token = jwt.sign({ uid: user.uid }, "123456", {
            expiresIn: "24h",
          });
          res.send({ token: token });
        } else {
          res.send("Invalid credentials");
        }
      } else {
        res.send("Invalid credentials");
      }
    } catch (e) {
      res.send(e.name);
    }
  }
};
exports.isHospitalSubAdmin = async (req, res) => {
  res.send("Hi hospital subAdmin");
};
exports.changeHospitalSubAdminPassword = async (req, res) => {
  const { body } = req;
  const passwordSchema = Joi.object()
    .keys({
      password: Joi.string().required(),
    })
    .required();
  let result = passwordSchema.validate(body);
  if (result.error) {
    res.send("Please enter valid details");
  } else {
    try {
      const salt = await bcrypt.genSalt(10);
      hashpassword = await bcrypt.hash(req.body.password, salt);
      const status = await hospitalSubAdmindb.findOneAndUpdate(
        { uid: req.user.uid },
        {
          password: hashpassword,
        }
      );
      if (status) {
        res.send("Password changed sucessfully");
      } else {
        res.send("Something bad happened");
      }
    } catch (e) {
      res.send(e.name);
    }
  }
};
exports.hospitalSubAdminGetRequests = async (req, res) => {
  try {
    const allHospitalRequests = await hospitalForm.find(
      { hospitalCode: req.hospitalCode },
      { _id: 0, __v: 0 }
    );
    res.send(allHospitalRequests);
  } catch (e) {
    res.send(e.name);
  }
};
exports.hospitalSubAdminPendingRequests = async (req, res) => {
  const hospitalSubAdmin = await hospitalSubAdmindb.findOne({
    uid: req.user.uid,
  });
  if (!hospitalSubAdmin) {
    res.send("You are not hospital sub admin");
  } else if (hospitalSubAdmin && hospitalSubAdmin.duty === "management") {
    try {
      const allHospitalPendingRequests = await hospitalForm.find(
        {
          hospitalCode: hospitalSubAdmin.hospitalCode,
          bookingStatus: "pending",
        },
        { _id: 0, __v: 0 }
      );
      res.send(allHospitalPendingRequests);
    } catch (e) {
      res.send(e.name);
    }
  } else {
    res.send("You are not allowed to see this data");
  }
};
exports.hospitalSubAdminUpdateRequests = async (req, res) => {
  const { body } = req;
  const hospitalSubAdmin = await hospitalSubAdmindb.findOne({
    uid: req.user.uid,
  });
  if (!hospitalSubAdmin) {
    res.send("You are not hospital sub admin");
  } else if (hospitalSubAdmin && hospitalSubAdmin.duty === "management") {
    const bookingSchema = Joi.object()
      .keys({
        bookingId: Joi.string().required(),
        bookingStatus: Joi.string().valid("confirmed", "rejected").required(),
      })
      .required();
    let result = bookingSchema.validate(body);
    if (result.error) {
      res.send("Please enter valid details");
    } else {
      try {
        const status = await hospitalForm.findOneAndUpdate(
          {
            bookingId: req.body.bookingId,
            hospitalCode: hospitalSubAdmin.hospitalCode,
          },
          {
            bookingStatus: req.body.bookingStatus,
          }
        );
        if (status) {
          res.send("Booking status changed sucessfully");
        } else {
          res.send("Something bad happened");
        }
      } catch (e) {
        res.send(e.name);
      }
      b;
    }
  } else {
    res.send("you are not allowed to edit this data");
  }
};
exports.hospitalSubAdminAddHosRequests = async (req, res) => {
  const hospitalSubAdmin = await hospitalSubAdmindb.findOne({
    uid: req.user.uid,
  });
  if (!hospitalSubAdmin) {
    res.send("You are not hospital sub admin");
  } else if (hospitalSubAdmin && hospitalSubAdmin.duty === "management") {
    try {
      const { body } = req;
      const hospitalRequestSchema = Joi.object()
        .keys({
          requestType: Joi.string().valid("Bed", "Doctor").required(),
          requestNumber: Joi.number().required(),
        })
        .required();
      let result = hospitalRequestSchema.validate(body);
      if (result.error) {
        res.send("Please enter valid details");
      } else {
        const createHospitalRequest = new hospitalRequest({
          requestId: req.body.requestId,
          requestStatus: "pending",
          hospitalCode: hospitalSubAdmin.hospitalCode,
          requestType: req.body.requestType,
          requestNumber: req.body.requestNumber,
        });
        await createHospitalRequest.save();
        res.send("Added subAdmin sucessfully");
      }
    } catch (e) {
      res.send(e.name);
    }
  } else {
    res.send("you are not allowed to add this data");
  }
};
exports.hospitalSubAdminHosRequests = async (req, res) => {
  const hospitalSubAdmin = await hospitalSubAdmindb.findOne({
    uid: req.user.uid,
  });
  if (!hospitalSubAdmin) {
    res.send("You are not hospital sub admin");
  } else if (hospitalSubAdmin && hospitalSubAdmin.duty === "management") {
    try {
      const allHospitalRequests = await hospitalRequest.find(
        {
          hospitalCode: hospitalSubAdmin.hospitalCode,
        },
        { _id: 0, __v: 0 }
      );
      res.send(allHospitalRequests);
    } catch (e) {
      res.send(e.name);
    }
  } else {
    res.send("You are not allowed to see this data");
  }
};
exports.hospitalSubAdminHosPendingRequests = async (req, res) => {
  const hospitalSubAdmin = await hospitalSubAdmindb.findOne({
    uid: req.user.uid,
  });
  if (!hospitalSubAdmin) {
    res.send("You are not hospital sub admin");
  } else if (hospitalSubAdmin && hospitalSubAdmin.duty === "management") {
    try {
      const allHospitalPendingRequests = await hospitalRequest.find(
        {
          hospitalCode: hospitalSubAdmin.hospitalCode,
          bookingStatus: "pending",
        },
        { _id: 0, __v: 0 }
      );
      res.send(allHospitalPendingRequests);
    } catch (e) {
      res.send(e.name);
    }
  } else {
    res.send("You are not allowed to see this data");
  }
};

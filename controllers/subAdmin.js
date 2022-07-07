const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const subAdmindb = require("../models/subAdmin");
const hospitalAdmindb = require("../models/hospitalAdmin");
const hospitalSubAdmindb = require("../models/hospitalSubAdmin");
const hospitalForm = require("../models/hospitalForm");
const hospitalRequest = require("../models/hospitalRequest");

exports.subAdminLogin = async (req, res) => {
  const { body } = req;
  const subAdminSchema = Joi.object()
    .keys({
      uid: Joi.string().required(),
      password: Joi.string().required(),
    })
    .required();
  let result = subAdminSchema.validate(body);
  if (result.error) {
    res.send("Please enter a valid details");
  } else {
    try {
      const user = await subAdmindb.findOne({ uid: req.body.uid });
      if (user) {
        const validPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );

        if (validPassword) {
          const token = jwt.sign(
            { uid: user.uid, password: user.password },
            process.env.TOKEN_KEY,
            {
              expiresIn: "24h",
            }
          );
          res.send({ token: token });
        } else {
          res.send("Invalid password");
        }
      } else {
        res.send("Invalid username");
      }
    } catch (e) {
      res.send(e.name);
    }
  }
};
exports.isSubAdmin = async (req, res) => {
  res.send("Hi sub Admin");
};
exports.changeSubAdminPassword = async (req, res) => {
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
      const status = await subAdmindb.findOneAndUpdate(
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
exports.subAdminAddHospitalAdmin = async (req, res) => {
  try {
    const { body } = req;
    const hospitalAdminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
        password: Joi.string().required(),
        hospitalCode: Joi.string().required(),
      })
      .required();
    let result = hospitalAdminSchema.validate(body);
    if (result.error) {
      res.send("Please enter valid details");
    } else {
      const user = await hospitalAdmindb.findOne({ uid: req.body.uid });
      if (user) {
        res.send(
          "Hospital admin for this uid already present please make another"
        );
      } else {
        const salt = await bcrypt.genSalt(10);
        hashpassword = await bcrypt.hash(req.body.password, salt);
        const createHospitalAdmin = new hospitalAdmindb({
          uid: req.body.uid,
          password: hashpassword,
          hospitalCode: req.body.hospitalCode,
        });
        await createHospitalAdmin.save();
        res.send("Added hospital admin sucessfully");
      }
    }
  } catch (e) {
    res.send(e.name);
  }
};
exports.subAdminGetHospitalAdmin = async (req, res) => {
  try {
    const allHospitalAdmins = await hospitalAdmindb.find(
      {},
      { _id: 0, __v: 0, password: 0 }
    );
    res.send(allHospitalAdmins);
  } catch (e) {
    res.send(e.name);
  }
};
exports.subAdminEditHospitalAdmin = async (req, res) => {
  try {
    const { body } = req;
    const hospitalAdminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
        password: Joi.string().required(),
        hospitalCode: Joi.string().required(),
      })
      .required();
    let result = hospitalAdminSchema.validate(body);
    if (result.error) {
      res.send("Please enter valid details");
    } else {
      const salt = await bcrypt.genSalt(10);
      hashpassword = await bcrypt.hash(req.body.password, salt);
      const user = await hospitalAdmindb.findOneAndUpdate(
        { uid: req.body.uid },
        {
          password: hashpassword,
          hospitalCode: req.body.hospitalCode,
        }
      );
      if (user) {
        res.send("Profile updated sucessfully");
      } else {
        res.send("There is no matching uid");
      }
    }
  } catch (e) {
    res.send(e.name);
  }
};
exports.subAdminDeleteHospitalAdmin = async (req, res) => {
  try {
    const { body } = req;
    const hospitalAdminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
      })
      .required();
    let result = hospitalAdminSchema.validate(body);
    if (result.error) {
      res.send("Please enter valid details");
    } else {
      const user = await hospitalAdmindb.findOneAndDelete({
        uid: req.body.uid,
      });
      if (user) {
        res.send("Hospital admin deleted sucessfully");
      } else {
        res.send("No Hospital admin found of this id");
      }
    }
  } catch (e) {
    res.send(e.name);
  }
};
exports.subAdminAddHospitalSubAdmin = async (req, res) => {
  try {
    const { body } = req;
    const hospitalSubAdminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
        password: Joi.string().required(),
        hospitalCode: Joi.string().required(),
        duty: Joi.string().valid("management", "finance").required(),
      })
      .required();
    let result = hospitalSubAdminSchema.validate(body);
    if (result.error) {
      res.send("Please enter valid details");
    } else {
      const user = await hospitalSubAdmindb.findOne({ uid: req.body.uid });
      if (user) {
        res.send(
          "Hospital sub-admin for this uid already present please make another"
        );
      } else {
        const salt = await bcrypt.genSalt(10);
        hashpassword = await bcrypt.hash(req.body.password, salt);
        const createHospitalSubAdmin = new hospitalSubAdmindb({
          uid: req.body.uid,
          password: hashpassword,
          hospitalCode: req.body.hospitalCode,
          duty: req.body.duty,
        });
        await createHospitalSubAdmin.save();
        res.send("Added hospital admin sucessfully");
      }
    }
  } catch (e) {
    res.send(e.name);
  }
};
exports.subAdminGetHospitalSubAdmin = async (req, res) => {
  try {
    const allHospitalSubAdmins = await hospitalSubAdmindb.find(
      {},
      { _id: 0, __v: 0, password: 0 }
    );
    res.send(allHospitalSubAdmins);
  } catch (e) {
    res.send(e.name);
  }
};
exports.subAdminEditHospitalSubAdmin = async (req, res) => {
  try {
    const { body } = req;
    const hospitalSubAdminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
        password: Joi.string().required(),
        hospitalCode: Joi.string().required(),
        duty: Joi.string().valid("management", "finance").required(),
      })
      .required();
    let result = hospitalSubAdminSchema.validate(body);
    if (result.error) {
      res.send("Please enter valid details");
    } else {
      const salt = await bcrypt.genSalt(10);
      hashpassword = await bcrypt.hash(req.body.password, salt);
      const user = await hospitalSubAdmindb.findOneAndUpdate(
        { uid: req.body.uid },
        {
          password: hashpassword,
          hospitalCode: req.body.hospitalCode,
          duty: req.body.duty,
        }
      );
      if (user) {
        res.send("Hospital subAdmin profile updated sucessfully");
      } else {
        res.send("There is no matching hospital subadmin uid");
      }
    }
  } catch (e) {
    res.send(e.name);
  }
};
exports.subAdminDeleteHospitalSubAdmin = async (req, res) => {
  try {
    const { body } = req;
    const hospitalSubAdminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
      })
      .required();
    let result = hospitalSubAdminSchema.validate(body);
    if (result.error) {
      res.send("Please enter valid details");
    } else {
      const user = await hospitalSubAdmindb.findOneAndDelete({
        uid: req.body.uid,
      });
      if (user) {
        res.send("Hospital subAdmin deleted sucessfully");
      } else {
        res.send("No Hospital subAdmin found of this id");
      }
    }
  } catch (e) {
    res.send(e.name);
  }
};
exports.subAdminGetRequests = async (req, res) => {
  try {
    const allHospitalRequests = await hospitalForm.find({}, { _id: 0, __v: 0 });
    res.send(allHospitalRequests);
  } catch (e) {
    res.send(e.name);
  }
};
exports.subAdminPendingRequests = async (req, res) => {
  try {
    const allHospitalPendingRequests = await hospitalForm.find(
      {
        bookingStatus: "pending",
      },
      { _id: 0, __v: 0 }
    );
    res.send(allHospitalPendingRequests);
  } catch (e) {
    res.send(e.name);
  }
};
exports.subAdminHosRequests = async (req, res) => {
  try {
    const allHospitalRequests = await hospitalRequest.find(
      {},
      { _id: 0, __v: 0 }
    );
    res.send(allHospitalRequests);
  } catch (e) {
    res.send(e.name);
  }
};
exports.subAdminHosPendingRequests = async (req, res) => {
  try {
    const allHospitalPendingRequests = await hospitalRequest.find(
      {
        bookingStatus: "pending",
      },
      { _id: 0, __v: 0 }
    );
    res.send(allHospitalPendingRequests);
  } catch (e) {
    res.send(e.name);
  }
};

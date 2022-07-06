const Joi = require("joi");
const admindb = require("../models/admin");
const userdb = require("../models/userProfile.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const AWS = require("aws-sdk");
const subAdmindb = require("../models/subAdmin");
const hospitalAdmindb = require("../models/hospitalAdmin");
const hospitaldb = require("../models/hospital");
const hospitalSubAdmindb = require("../models/hospitalSubAdmin");
const hospitalForm = require("../models/hospitalForm");
const Amenities = require("../models/amenities");
const Facilities = require("../models/facilities");
const Services = require("../models/services");
const signupHospitaldb = require("../models/signupHospital");
const insurancedb = require("../models/insurance");
const departmentdb = require("../models/adminDepartment");
const bedTypes = require("../models/bedTypes");
const hospitalImagedb = require("../models/hospitalImage");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
  Bucket: process.env.BUCKET_NAME,
});
exports.adminLogin = async (req, res) => {
  try {
    const { body } = req;
    const adminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
        password: Joi.string().required(),
      })
      .required();
    let result = adminSchema.validate(body);
    if (result.error) {
      res.status(403).send({ message: "Please enter a valid details" });
    } else {
      const user = await admindb.findOne({ uid: req.body.uid });
      if (user) {
        const validPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );

        if (validPassword) {
          const token = jwt.sign(
            { uid: user.uid, password: user.password },
            "123456",
            {
              expiresIn: "24h",
            }
          );
          res.status(200).send({ token: token });
        } else {
          res.status(401).send({ message: "Invalid password" });
        }
      } else {
        res.status(401).send({ message: "Invalid username" });
      }
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.isAdmin = async (req, res) => {
  res.status(200).send({ message: "Hi Admin" });
};
exports.changeAdminProfile = async (req, res) => {
  try {
    const { body } = req;
    const adminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
        password: Joi.string().required(),
      })
      .required();
    let result = adminSchema.validate(body);
    if (result.error) {
      res.status(403).send({ message: "Please enter valid details" });
    } else {
      const salt = await bcrypt.genSalt(10);
      hashpassword = await bcrypt.hash(req.body.password, salt);
      const status = await admindb.findOneAndUpdate(
        { uid: req.user.uid },
        {
          uid: req.body.uid,
          password: hashpassword,
        }
      );
      if (status) {
        res.status(200).send({ message: "Profile updated sucessfully" });
      } else {
        res.status(500).send({ message: "Something bad happened" });
      }
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.addSubAdmin = async (req, res) => {
  try {
    const { body } = req;
    const subAdminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
        password: Joi.string().required(),
        duty: Joi.string().valid("management", "finance").required(),
      })
      .required();
    let result = subAdminSchema.validate(body);
    if (result.error) {
      res.status(403).send({ message: "Please enter valid details" });
    } else {
      const user = await subAdmindb.findOne({ uid: req.body.uid });
      if (user) {
        res.status(409).send({
          message: "Sub admin for this uid already present please make another",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        hashpassword = await bcrypt.hash(req.body.password, salt);
        const createSubAdmin = new subAdmindb({
          uid: req.body.uid,
          password: hashpassword,
          duty: req.body.duty,
        });
        await createSubAdmin.save();
        res.status(200).send({ message: "Added subAdmin sucessfully" });
      }
    }
  } catch (e) {
    req.status(500).send({ message: e.name });
  }
};
exports.allSubAdmins = async (req, res) => {
  try {
    const subadmins = await subAdmindb.find(
      {},
      { _id: 0, password: 0, __v: 0 }
    );
    res.status(200).send(subadmins);
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.adminChangeSubAdminPassword = async (req, res) => {
  try {
    const { body } = req;
    const passwordSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
        password: Joi.string().required(),
      })
      .required();
    let result = passwordSchema.validate(body);
    if (result.error) {
      res.status(403).send({ message: "Please enter valid details" });
    } else {
      const salt = await bcrypt.genSalt(10);
      hashpassword = await bcrypt.hash(req.body.password, salt);
      const status = await subAdmindb.findOneAndUpdate(
        { uid: req.body.uid },
        {
          password: hashpassword,
        }
      );
      if (status) {
        res.status(200).send({ message: "Password changed sucessfully" });
      } else {
        res.status(404).send({ message: "There is no subAdmin of this uid" });
      }
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.deleteSubAdmin = async (req, res) => {
  try {
    const status = await subAdmindb.findOneAndDelete({ uid: req.body.uid });
    if (status) {
      res.status(200).send({ message: "sub-admin deleted sucessfully" });
    } else {
      res.status(404).send({ message: "No sub admin found of this id" });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.adminAddHospitalAdmin = async (req, res) => {
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
      res.status(403).send({ message: "Please enter valid details" });
    } else {
      const hospitalAdmin = await hospitalAdmindb.findOne({
        uid: req.body.uid,
      });
      if (hospitalAdmin) {
        res.status(409).send({
          message:
            "Hospital admin for this uid already present please make another",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        hashpassword = await bcrypt.hash(req.body.password, salt);
        const createHospitalAdmin = new hospitalAdmindb({
          uid: req.body.uid,
          password: hashpassword,
          hospitalCode: req.body.hospitalCode,
        });
        await createHospitalAdmin.save();
        res.status(200).send({ message: "Added hospital admin sucessfully" });
      }
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.adminGetHospitalAdmin = async (req, res) => {
  try {
    const allHospitalAdmins = await hospitalAdmindb.find(
      {},
      { _id: 0, __v: 0, password: 0 }
    );
    res.status(200).send(allHospitalAdmins);
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.adminEditHospitalAdmin = async (req, res) => {
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
      res.status(403).send({ message: "Please enter valid details" });
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
        res.status(200).send({ message: "Profile updated sucessfully" });
      } else {
        res.status(404).send({ message: "There is no matching uid" });
      }
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.adminDeleteHospitalAdmin = async (req, res) => {
  try {
    const { body } = req;
    const hospitalAdminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
      })
      .required();
    let result = hospitalAdminSchema.validate(body);
    if (result.error) {
      res.status(403).send({ message: "Please enter valid details" });
    } else {
      const status = await hospitalAdmindb.findOneAndDelete({
        uid: req.body.uid,
      });
      if (status) {
        res.status(200).send({ message: "Hospital admin deleted sucessfully" });
      } else {
        res.status(404).send({ message: "No Hospital admin found of this id" });
      }
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.adminAddHospitalSubAdmin = async (req, res) => {
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
      res.status(403).send({ message: "Please enter valid details" });
    } else {
      const user = await hospitalSubAdmindb.findOne({ uid: req.body.uid });
      if (user) {
        res.status(409).send({
          message:
            "Hospital sub-admin for this uid already present please make another",
        });
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
        res
          .status(200)
          .send({ message: "Added hospital subAdmin sucessfully" });
      }
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.adminEditHospitalSubAdmin = async (req, res) => {
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
      res.status(403).send({ message: "Please enter valid details" });
    } else {
      const salt = await bcrypt.genSalt(10);
      hashpassword = await bcrypt.hash(req.body.password, salt);
      const status = await hospitalSubAdmindb.findOneAndUpdate(
        { uid: req.body.uid },
        {
          password: hashpassword,
          duty: req.body.duty,
          hospitalCode: req.body.hospitalCode,
        }
      );
      if (status) {
        res
          .status(200)
          .send({ message: "Hospital subAdmin profile updated sucessfully" });
      } else {
        res
          .status(404)
          .send({ message: "No hospital subAdmin found of this uid" });
      }
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.adminGetHospitalSubAdmin = async (req, res) => {
  try {
    const allHospitalSubadmins = await hospitalSubAdmindb.find(
      {},
      { _id: 0, __v: 0, password: 0 }
    );
    res.status(200).send(allHospitalSubadmins);
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.adminDeleteHospitalSubAdmin = async (req, res) => {
  try {
    const { body } = req;
    const hospitalSubAdminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
      })
      .required();
    let result = hospitalSubAdminSchema.validate(body);
    if (result.error) {
      res.status(403).send({ message: "Please enter valid details" });
    } else {
      const status = await hospitalSubAdmindb.findOneAndDelete({
        uid: req.body.uid,
      });
      if (status) {
        res
          .status(200)
          .send({ message: "Hospital subAdmin deleted sucessfully" });
      } else {
        res
          .status(404)
          .send({ message: "No Hospital subAdmin found of this id" });
      }
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.adminGetBookingRequests = async (req, res) => {
  try {
    const allHospitalRequests = await hospitalForm.find({}, { _id: 0, __v: 0 });
    res.status(200).send(allHospitalRequests);
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.adminPendingBookingRequests = async (req, res) => {
  try {
    const allHospitalPendingRequests = await hospitalForm.find(
      {
        bookingStatus: "pending",
      },
      { _id: 0, __v: 0 }
    );
    res.status(200).send(allHospitalPendingRequests);
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.adminAcceptedBookingRequests = async (req, res) => {
  try {
    const allHospitalAcceptedRequests = await hospitalForm.find(
      {
        bookingStatus: "accepted",
      },
      { _id: 0, __v: 0 }
    );
    res.status(200).send(allHospitalAcceptedRequests);
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.adminRejectedBookingRequests = async (req, res) => {
  try {
    const allHospitalRejectedRequests = await hospitalForm.find(
      {
        bookingStatus: "rejected",
      },
      { _id: 0, __v: 0 }
    );
    res.status(200).send(allHospitalRejectedRequests);
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.adminRejectedPendingBookingRequests = async (req, res) => {
  try {
    const allHospitalAcceptedRequests = await signupHospitaldb.findOneAndUpdate(
      {
        hospitalCode: req.body.hospitalCode,
        status: "rejected",
      },
      {
        status: "pending",
      }
    );
    res.status(200).send(allHospitalAcceptedRequests);
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.adminSignupHosAllRequests = async (req, res) => {
  try {
    const allHospitalRequests = await signupHospitaldb.find(
      {},
      { _id: 0, __v: 0 }
    );
    res.status(200).send(allHospitalRequests);
  } catch (e) {
    res.status(401).send({ message: e.name });
  }
};
exports.adminSignupHosPendingRequests = async (req, res) => {
  try {
    const allHospitalPendingRequests = await signupHospitaldb.find(
      {
        status: "pending",
      },
      { _id: 0, __v: 0 }
    );
    res.status(200).send(allHospitalPendingRequests);
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.adminSignupHosAcceptedRequests = async (req, res) => {
  try {
    const allHospitalPendingRequests = await signupHospitaldb.find(
      {
        status: "accepted",
      },
      { _id: 0, __v: 0 }
    );
    res.status(200).send(allHospitalPendingRequests);
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.adminSignupHosRejectedRequests = async (req, res) => {
  try {
    const allHospitalPendingRequests = await signupHospitaldb.find(
      {
        status: "rejected",
      },
      { _id: 0, __v: 0 }
    );
    res.status(200).send(allHospitalPendingRequests);
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.updateAcceptSignupHosRequests = async (req, res) => {
  try {
    const request = await signupHospitaldb.findOneAndUpdate(
      { hospitalCode: req.body.hospitalCode },
      { status: "accepted" }
    );
    if (request) {
      res.status(200).send({ message: "Accepted Sucessfully" });
    } else {
      res.status(404).send({ message: "Hospital ID not found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.updateRejectSignupHosRequests = async (req, res) => {
  try {
    const { body } = req;
    const request = await signupHospitaldb.findOneAndUpdate(
      { hospitalCode: req.body.hospitalCode },
      { status: "rejected" }
    );
    if (request) {
      res.status(200).send({ message: "Updated Sucessfully" });
    } else {
      res.status(404).send({ message: "Hospital ID not found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.showAllUsers = async (req, res) => {
  try {
    const allUsers = await userdb.find();
    if (allUsers.length == 0) {
      res.status(404).send({ message: "No user found" });
    } else {
      res.status(200).send(allUsers);
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.showAllBookings = async (req, res) => {
  try {
    const allBookings = await hospitalForm.find();
    if (allBookings.length == 0) {
      res.status(404).send({ message: "No bookings found" });
    } else {
      res.status(200).send(allBookings);
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.addAmenities = async (req, res) => {
  try {
    const { body } = req;
    const amenitySchema = Joi.object()
      .keys({
        amenities: Joi.string().required(),
      })
      .required();
    let result = amenitySchema.validate(body);
    if (result.error) {
      res.status(403).send({ message: "Please enter valid details" });
    } else {
      const am = await Amenities.findOne({ amenities: req.body.amenities });
      if (am) {
        res.status(409).send({
          message: "Amenity already present please make another",
        });
      } else {
        const createAmenity = new Amenities({
          amenities: req.body.amenities,
        });
        await createAmenity.save();
        res.status(200).send({ message: "Added amenity sucessfully" });
      }
    }
  } catch (e) {
    req.status(500).send({ message: e.name });
  }
};
exports.getAmenities = async (req, res) => {
  try {
    const findAmenities = await Amenities.find();
    res.status(200).send(findAmenities);
  } catch (err) {
    res.status(500).send({ message: err.name });
  }
};
exports.deleteAmenities = async (req, res) => {
  try {
    const am = await Amenities.findOneAndDelete({
      amenities: req.body.amenities,
    });
    if (am) {
      res.status(200).send({ message: "amenity deleted sucessfully" });
    } else {
      res.status(404).send({ message: "No amenity found of this name" });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.addFacilities = async (req, res) => {
  try {
    const { body } = req;
    const facilitySchema = Joi.object()
      .keys({
        facilities: Joi.string().required(),
      })
      .required();
    let result = facilitySchema.validate(body);
    if (result.error) {
      res.status(403).send({ message: "Please enter valid details" });
    } else {
      const fc = await Facilities.findOne({ facilities: req.body.facilities });
      if (fc) {
        res.status(409).send({
          message: "Amenity already present please make another",
        });
      } else {
        const createFacility = new Facilities({
          facilities: req.body.facilities,
        });
        await createFacility.save();
        res.status(200).send({ message: "Added facility sucessfully" });
      }
    }
  } catch (e) {
    req.status(500).send({ message: e.name });
  }
};
exports.getFacilities = async (req, res) => {
  try {
    const findFacilities = await Facilities.find();
    res.status(200).send(findFacilities);
  } catch (err) {
    res.status(500).send({ message: err.name });
  }
};
exports.deleteFacilities = async (req, res) => {
  try {
    const fc = await Facilities.findOneAndDelete({
      facilities: req.body.facilities,
    });
    if (fc) {
      res.status(200).send({ message: "facility deleted sucessfully" });
    } else {
      res.status(404).send({ message: "No facility found of this name" });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.addServices = async (req, res) => {
  try {
    const { body } = req;
    const serviceSchema = Joi.object()
      .keys({
        services: Joi.string().required(),
      })
      .required();
    let result = serviceSchema.validate(body);
    if (result.error) {
      res.status(403).send({ message: "Please enter valid details" });
    } else {
      const sv = await Services.findOne({ services: req.body.services });
      if (sv) {
        res.status(409).send({
          message: "Service already present please make another",
        });
      } else {
        const createService = new Services({
          services: req.body.services,
        });
        await createService.save();
        res.status(200).send({ message: "Added service sucessfully" });
      }
    }
  } catch (e) {
    req.status(500).send({ message: e.name });
  }
};
exports.getServices = async (req, res) => {
  try {
    const getServices = await Services.find();
    res.status(200).send(getServices);
  } catch (err) {
    res.status(500).send({ message: err.name });
  }
};
exports.deleteServices = async (req, res) => {
  try {
    const sv = await Services.findOneAndDelete({
      services: req.body.services,
    });
    if (sv) {
      res.status(200).send({ message: "Service deleted sucessfully" });
    } else {
      res.status(404).send({ message: "No service found of this name" });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.updateAcceptBedTypes = async (req, res) => {
  try {
    const bedTypes = await bedTypedb.findOneAndUpdate(
      { hospitalCode: req.body.hospitalCode },
      { status: "accepted" }
    );
    if (bedTypes) {
      res.send("Accepted Sucessfully");
    } else {
      res.send("Something bad happened");
    }
  } catch (e) {
    res.send(e.name);
  }
};
exports.updateRejectBedTypes = async (req, res) => {
  try {
    const { body } = req;
    const bedTypes = await bedTypedb.findOneAndUpdate(
      { hospitalCode: req.body.hospitalCode },
      { status: "rejected" }
    );
    if (!bedTypes) {
      res.send("Updated Sucessfully");
    } else {
      res.send("Something bad happened");
    }
  } catch (e) {
    res.send(e.name);
  }
};
exports.addInsurance = async (req, res) => {
  try {
    const { body } = req;
    const insuranceSchema = Joi.object()
      .keys({
        insurance: Joi.string().required(),
        tpa: Joi.string().required(),
      })
      .required();
    let result = insuranceSchema.validate(body);
    if (result.error) {
      res
        .status(403)
        .send({ message: "Please enter insurance name and tpa name" });
    } else {
      const ins = await insurancedb.findOne({
        insurance: req.body.insurance,
        tpa: req.body.tpa,
      });
      if (ins) {
        res.status(409).send({
          message: "This insurance already present please make another",
        });
      } else {
        const createInsurance = new insurancedb({
          insurance: req.body.insurance,
          tpa: req.body.tpa,
        });
        await createInsurance.save();
        res.status(200).send({ message: "Added insurance sucessfully" });
      }
    }
  } catch (e) {
    req.status(500).send({ message: e.name });
  }
};
exports.getInsurance = async (req, res) => {
  try {
    const findInsurance = await insurancedb.find();
    res.status(200).send(findInsurance);
  } catch (err) {
    res.status(500).send({ message: err.name });
  }
};
exports.deleteInsurance = async (req, res) => {
  try {
    const ins = await insurancedb.findOneAndDelete({
      insurance: req.body.insurance,
      tpa: req.body.tpa,
    });
    if (ins) {
      res.status(200).send({ message: "insurance deleted sucessfully" });
    } else {
      res.status(404).send({
        message:
          "No insurance found of this name: " +
          req.body.insurance +
          " and tpa: " +
          req.body.tpa,
      });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.addDepartment = async (req, res) => {
  try {
    const { body } = req;
    const departmentSchema = Joi.object()
      .keys({
        department: Joi.string().required(),
      })
      .required();
    let result = departmentSchema.validate(body);
    if (result.error) {
      res.status(403).send({ message: "Please enter department name" });
    } else {
      const ins = await departmentdb.findOne({
        department: req.body.department,
      });
      if (ins) {
        res.status(409).send({
          message: "This department already present please make another",
        });
      } else {
        const createDepartment = new departmentdb({
          department: req.body.department,
        });
        await createDepartment.save();
        res.status(200).send({ message: "Added department sucessfully" });
      }
    }
  } catch (e) {
    req.status(500).send({ message: e.name });
  }
};
exports.getDepartment = async (req, res) => {
  try {
    const findDepartment = await departmentdb.find();
    res.status(200).send(findDepartment);
  } catch (err) {
    res.status(500).send({ message: err.name });
  }
};
exports.deleteDepartment = async (req, res) => {
  try {
    const ins = await departmentdb.findOneAndDelete({
      department: req.body.department,
    });
    if (ins) {
      res.status(200).send({ message: "department deleted sucessfully" });
    } else {
      res.status(404).send({ message: "No department found of this name" });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.addHospital = async (req, res) => {
  try {
    const { body } = req;
    const hospitalSchema = Joi.object()
      .keys({
        hospitalName: Joi.string().required(),
        hospitalCode: Joi.string().required(),
        hospitalType: Joi.string().required(),
        hospitalAddress: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        phone: Joi.string().required(),
        numberOfBeds: Joi.number().required(),
      })
      .required();
    let result = hospitalSchema.validate(body);
    if (result.error) {
      res.status(403).send({ message: "Please enter valid details" });
    } else {
      const createHospital = new hospitaldb({
        hospitalName: req.body.hospitalName,
        hospitalCode: req.body.hospitalCode,
        hospitalType: req.body.hospitalType,
        hospitalAddress: req.body.hospitalAddress,
        city: req.body.city,
        state: req.body.state,
        phone: req.body.phone,
        numberOfBeds: req.body.numberOfBeds,
      });
      await createHospital.save();
      res.status(200).send({ message: "Added hospital sucessfully" });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.getHospital = async (req, res) => {
  try {
    const findHospital = await hospitaldb.find();
    res.status(200).send(findHospital);
  } catch (err) {
    res.status(500).send({ message: err.name });
  }
};
exports.getHospitalDetails = async (req, res) => {
  try {
    const result = await hospitaldb.findOne(
      {
        hospitalCode: req.params.hospitalCode,
      },
      { _id: 0, __v: 0 }
    );
    const result2 = await bedTypes.findOne(
      {
        hospitalCode: req.params.hospitalCode,
      },
      { _id: 0, __v: 0 }
    );
    const result3 = await hospitalImagesdb.findOne({
      hospitalCode: req.params.hospitalCode,
    });
    if (!result && !result2 && !result3) {
      res.status(404).send({
        message:
          "No hospital found of hospital code: " + req.params.hospitalCode,
      });
    } else {
      res.status(200).send({
        hospitalDetails: result,
        bedDetails: result2,
        hospitalImages: result3,
      });
    }
  } catch (err) {
    res.status(500).send({ message: err.name });
  }
};
exports.getHospitalCount = async (req, res) => {
  try {
    const numberOfHospitals = await hospitaldb.find().count();
    const numberofBookings = await hospitalForm.find().count();
    res.status(200).send({ numberOfHospitals, numberofBookings });
  } catch (e) {
    res.status(500).send({ message: err.name });
  }
};
exports.deleteHospitalImages = async (req, res) => {
  try {
    let p = req.body.fileUrl;
    p = p.split("/");
    p = p[p.length - 1];
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: p,
    };
    const s3delete = function (params) {
      return new Promise((resolve, reject) => {
        s3.createBucket(
          {
            Bucket: params.Bucket,
          },
          function () {
            s3.deleteObject(params, async function (err, data) {
              if (err) res.status(500).send({ message: err });
              else {
                const result = await imagedb.findOneAndUpdate(
                  { hospitalCode: req.body.hospitalCode },
                  { $pull: { imageUrl: req.body.fileUrl } }
                );
                if (result) {
                  res.status(200).send({ message: "Deleted successfully" });
                } else {
                  res.status(500).send({ message: "Something bad happened" });
                }
              }
            });
          }
        );
      });
    };
    s3delete(params);
  } catch (e) {
    res.status(500).send({ message: err.name });
  }
};
////////////////////////////////////////////////
// exports.signup = async (req, res) => {
//   try {
//     const { body } = req;
//     const adminSchema = Joi.object()
//       .keys({
//         uid: Joi.string().required(),
//         password: Joi.string().required(),
//       })
//       .required();
//     const result = adminSchema.validate(body);
//     if (result.error) {
//       res.status(400).send({ message: result.error.details[0].message });
//     } else {
//       const salt = await bcrypt.genSalt(10);
//       hashpassword = await bcrypt.hash(req.body.password, salt);
//       const createAdmin = new admindb({
//         uid: req.body.uid,
//         password: hashpassword,
//       });
//       createAdmin
//         .save()
//         .then(() => {
//           res.status(200).send({ message: "Added admin sucessfully" });
//         })
//         .catch(() => {
//           res.status(500).send({ message: "Something bad happened" });
//         });
//     }
//   } catch (e) {
//     res.status(500).send({ message: e.name });
//   }
// };

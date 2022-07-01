const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const hospitalAdmindb = require("../models/hospitalAdmin");
const hospitalSubAdmindb = require("../models/hospitalSubAdmin");
const hospitalForm = require("../models/hospitalForm");
const adminAmenitiesdb = require("../models/amenities");
const hospitalAmenitiesdb = require("../models/hospitalAmenities");
const adminFacilitiesdb = require("../models/facilities");
const hospitalFacilitiesdb = require("../models/hospitalFacility");
const adminServicesdb = require("../models/services");
const hospitalServicesdb = require("../models/hospitalServices");
const myBedTypesdb = require("../models/bedTypes");
const hospitalInsurancedb = require("../models/hospitalInsurance");
const adminInsurancedb = require("../models/insurance");
const adminDepartmentdb = require("../models/adminDepartment");
const hospitalDepartmentdb = require("../models/hospitalDepartment");
const hospitaldb = require("../models/hospital");
const completeBookingdb = require("../models/completeBooking");
exports.hospitalAdminLogin = async (req, res) => {
  try {
    const { body } = req;
    const hospitalAdminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
        password: Joi.string().required(),
      })
      .required();
    let result = hospitalAdminSchema.validate(body);
    if (result.error) {
      res.status(403).send({ message: "Please enter a valid details" });
    } else {
      const user = await hospitalAdmindb.findOne({ uid: req.body.uid });
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
          const hospitalName = await hospitaldb.findOne({
            hospitalCode: user.hospitalCode,
          });
          res
            .status(200)
            .send({ token: token, hospitalName: hospitalName.hospitalName });
        } else {
          res.status(401).send("Invalid password");
        }
      } else {
        res.status(401).send("Invalid username");
      }
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.isHospitalAdmin = async (req, res) => {
  res.status(200).send({ message: "Hi hospital Admin" });
};
exports.changeHospitalAdminPassword = async (req, res) => {
  try {
    const { body } = req;
    const passwordSchema = Joi.object()
      .keys({
        password: Joi.string().required(),
      })
      .required();
    let result = passwordSchema.validate(body);
    if (result.error) {
      res.status(403).send({ message: "Please enter valid details" });
    } else {
      const salt = await bcrypt.genSalt(10);
      hashpassword = await bcrypt.hash(req.body.password, salt);
      const status = await hospitalAdmindb.findOneAndUpdate(
        { uid: req.user.uid },
        {
          password: hashpassword,
        }
      );
      if (status) {
        res.status(200).send({ message: "Password changed sucessfully" });
      } else {
        res.status(500).send({ message: "Something bad happened" });
      }
    }
  } catch (e) {
    req.status(500).send({ message: e.name });
  }
};
exports.hospitalAdminAddHospitalSubAdmin = async (req, res) => {
  try {
    const { body } = req;
    const hospitalSubAdminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
        password: Joi.string().required(),
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
          hospitalCode: req.hospitalCode,
          duty: req.body.duty,
        });
        await createHospitalSubAdmin.save();
        res.status(200).send({ message: "Added subAdmin sucessfully" });
      }
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.hospitalAdminEditHospitalSubAdmin = async (req, res) => {
  try {
    const { body } = req;
    const hospitalSubAdminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
        password: Joi.string().required(),
        duty: Joi.string().valid("management", "finance").required(),
      })
      .required();
    let result = hospitalSubAdminSchema.validate(body);
    if (result.error) {
      res.status(403).send({ message: "Please enter valid details" });
    } else {
      const salt = await bcrypt.genSalt(10);
      hashpassword = await bcrypt.hash(req.body.password, salt);
      const user = await hospitalSubAdmindb.findOneAndUpdate(
        { uid: req.body.uid, hospitalCode: req.hospitalCode },
        {
          password: hashpassword,
          duty: req.body.duty,
        }
      );
      if (user) {
        res
          .status(200)
          .send({ message: "Hospital subAdmin profile updated sucessfully" });
      } else {
        res
          .status(404)
          .send({ message: "There is no matching hospital subadmin uid" });
      }
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.hospitalAdminGetHospitalSubAdmin = async (req, res) => {
  try {
    const allHospitalSubAdmins = await hospitalSubAdmindb.find(
      { hospitalCode: req.hospitalCode },
      { _id: 0, __v: 0, password: 0 }
    );
    res.status(200).send(allHospitalSubAdmins);
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.hospitalAdminDeleteHospitalSubAdmin = async (req, res) => {
  try {
    const { body } = req;
    const hospitalSubAdminSchema = Joi.object()
      .keys({
        uid: Joi.string().required(),
      })
      .required();
    const result = hospitalSubAdminSchema.validate(body);

    if (result.error) {
      res.status(403).send({ message: "Please enter valid details" });
    } else {
      const user = await hospitalSubAdmindb.findOneAndDelete({
        uid: req.body.uid,
        hospitalCode: req.hospitalCode,
      });
      if (user) {
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
exports.hospitalAdminGetRequests = async (req, res) => {
  try {
    const allHospitalRequests = await hospitalForm.find(
      { hospitalCode: req.hospitalCode },
      { _id: 0, __v: 0 }
    );
    res.status(200).send(allHospitalRequests);
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.hospitalAdminPendingRequests = async (req, res) => {
  try {
    const allHospitalPendingRequests = await hospitalForm.find(
      {
        hospitalCode: req.hospitalCode,
        bookingStatus: "pending",
      },
      { _id: 0, __v: 0 }
    );
    res.status(200).send(allHospitalPendingRequests);
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.hospitalAdminUpdateAcceptRequests = async (req, res) => {
  try {
    const { body } = req;
    const bookingSchema = Joi.object()
      .keys({
        bookingId: Joi.string().required(),
      })
      .required();
    let result = bookingSchema.validate(body);
    if (result.error) {
      res.status(403).send({ message: "Please enter valid details" });
    } else {
      try {
        const status = await hospitalForm.findOneAndUpdate(
          {
            bookingId: req.body.bookingId,
            hospitalCode: req.hospitalCode,
          },
          {
            bookingStatus: "accepted",
          }
        );
        if (status) {
          res
            .status(200)
            .send({ message: "Booking status updated sucessfully" });
        } else {
          res.status(404).send({ message: "No booking found for this id" });
        }
      } catch (e) {
        res.status(500).send({ message: e.name });
      }
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.hospitalAdminUpdateRejectRequests = async (req, res) => {
  try {
    const { body } = req;
    const bookingSchema = Joi.object()
      .keys({
        bookingId: Joi.string().required(),
      })
      .required();
    let result = bookingSchema.validate(body);
    if (result.error) {
      res.status(403).send({ message: "Please enter valid details" });
    } else {
      try {
        const status = await hospitalForm.findOneAndUpdate(
          {
            bookingId: req.body.bookingId,
            hospitalCode: req.hospitalCode,
          },
          {
            bookingStatus: "rejected",
          }
        );
        if (status) {
          res
            .status(200)
            .send({ message: "Booking status updated sucessfully" });
        } else {
          res.status(404).send({ message: "No booking found for this id" });
        }
      } catch (e) {
        res.status(500).send({ message: e.name });
      }
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.getAmenities = async (req, res) => {
  try {
    const a = await hospitalAmenitiesdb.findOne({
      hospitalCode: req.hospitalCode,
    });
    if (a) {
      let am = a.details.map((v) => v.amenities);
      let b = await adminAmenitiesdb.find({ amenities: { $nin: am } });
      let av = b.map((v) => v.amenities);
      res.status(200).send(av);
    } else {
      const pc = await adminAmenitiesdb.find();
      let arr = pc.map((v) => v.amenities);
      res.status(200).send(arr);
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.addAmenities = async (req, res) => {
  try {
    const a = await hospitalAmenitiesdb.find({
      hospitalCode: req.hospitalCode,
    });
    if (a.length === 0) {
      let arr = req.body.arr;
      let p = arr.map((v) => {
        return { amenities: v, price: 0 };
      });
      const createHospitalAmenities = new hospitalAmenitiesdb({
        hospitalCode: req.hospitalCode,
        details: p,
      });
      await createHospitalAmenities.save();
      res.status(200).send({ message: "Done" });
    } else {
      let arr = req.body.arr;
      let p = arr.map((v) => {
        return { amenities: v, price: 0 };
      });
      const pusha = await hospitalAmenitiesdb.findOneAndUpdate(
        { hospitalCode: req.hospitalCode },
        {
          $push: {
            details: {
              $each: p,
            },
          },
        }
      );
      if (pusha) {
        res.status(200).send({ message: "New Amenities pushed sucessfully" });
      } else {
        res.status(500).send({ message: "Something bad happened" });
      }
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.getFullAmenities = async (req, res) => {
  try {
    const a = await hospitalAmenitiesdb.findOne({
      hospitalCode: req.hospitalCode,
    });
    if (a) {
      res.status(200).send(a.details);
    } else {
      res.status(200).send({ message: "No amenities found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.updateAmenityPrice = async (req, res) => {
  try {
    const { body } = req;
    const priceSchema = Joi.object()
      .keys({
        amenity: Joi.string().required(),
        price: Joi.number().required(),
      })
      .required();
    let result = priceSchema.validate(body);
    if (result.error) {
      res.status(403).send({ message: "Please enter valid details" });
    } else {
      const rs = await hospitalAmenitiesdb.findOneAndUpdate(
        {
          hospitalCode: req.hospitalCode,
          "details.amenities": req.body.amenity,
        },
        {
          $set: {
            "details.$.price": req.body.price,
          },
        }
      );
      if (rs) {
        res.status(200).send({ message: "Price updated Sucessfully" });
      } else {
        res.status(500).send({ message: "Something bad happened" });
      }
    }
  } catch (e) {
    res.status(500).send(e);
  }
};
exports.deleteAmenities = async (req, res) => {
  try {
    const a = await hospitalAmenitiesdb.findOneAndUpdate(
      {
        hospitalCode: req.hospitalCode,
      },
      {
        $pull: {
          details: { _id: req.params.id },
        },
      }
    );
    if (a) {
      res.status(200).send({ message: "Deleted sucessfully" });
    } else {
      res.status(404).send({ message: "No amenitiy found of this id" });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.getFacilities = async (req, res) => {
  try {
    const a = await hospitalFacilitiesdb.findOne({
      hospitalCode: req.hospitalCode,
    });
    if (a) {
      let am = a.details.map((v) => v.facilities);
      let b = await adminFacilitiesdb.find({ facilities: { $nin: am } });
      let av = b.map((v) => v.facilities);
      res.status(200).send(av);
    } else {
      const pc = await adminFacilitiesdb.find();
      let arr = pc.map((v) => v.facilities);
      res.status(200).send(arr);
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.addFacilities = async (req, res) => {
  try {
    const a = await hospitalFacilitiesdb.find({
      hospitalCode: req.hospitalCode,
    });
    if (a.length === 0) {
      let arr = req.body.arr;
      let p = arr.map((v) => {
        return { facilities: v, price: 0 };
      });
      const createHospitalFacilities = new hospitalFacilitiesdb({
        hospitalCode: req.hospitalCode,
        details: p,
      });
      await createHospitalFacilities.save();
      res.status(200).send({ message: "Done" });
    } else {
      let arr = req.body.arr;
      let p = arr.map((v) => {
        return { facilities: v, price: 0 };
      });
      const pusha = await hospitalFacilitiesdb.findOneAndUpdate(
        { hospitalCode: req.hospitalCode },
        {
          $push: {
            details: {
              $each: p,
            },
          },
        }
      );
      if (pusha) {
        res.status(200).send({ message: "New facilities pushed sucessfully" });
      } else {
        res.status(500).send({ message: "Something bad happened" });
      }
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.getFullFacilities = async (req, res) => {
  try {
    const a = await hospitalFacilitiesdb.findOne({
      hospitalCode: req.hospitalCode,
    });
    if (a) {
      res.status(200).send(a.details);
    } else {
      res.status(200).send({ message: "No facilities found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.updateFacilityPrice = async (req, res) => {
  try {
    const { body } = req;
    const priceSchema = Joi.object()
      .keys({
        facility: Joi.string().required(),
        price: Joi.number().required(),
      })
      .required();
    let result = priceSchema.validate(body);
    if (result.error) {
      res.status(403).send({ message: "Please enter valid details" });
    } else {
      const rs = await hospitalFacilitiesdb.findOneAndUpdate(
        {
          hospitalCode: req.hospitalCode,
          "details.facilities": req.body.facility,
        },
        {
          $set: {
            "details.$.price": req.body.price,
          },
        }
      );
      if (rs) {
        res.status(200).send({ message: "Price updated Sucessfully" });
      } else {
        res.status(500).send({ message: "Something bad happened" });
      }
    }
  } catch (e) {
    res.status(500).send(e);
  }
};
exports.deleteFacilities = async (req, res) => {
  try {
    const a = await hospitalFacilitiesdb.findOneAndUpdate(
      {
        hospitalCode: req.hospitalCode,
      },
      {
        $pull: {
          details: { _id: req.params.id },
        },
      }
    );
    if (a) {
      res.status(200).send({ message: "Deleted sucessfully" });
    } else {
      res.status(404).send({ message: "No facility found of this id" });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.getServices = async (req, res) => {
  try {
    const a = await hospitalServicesdb.findOne({
      hospitalCode: req.hospitalCode,
    });
    if (a) {
      let am = a.details.map((v) => v.services);
      let b = await adminServicesdb.find({ services: { $nin: am } });
      let av = b.map((v) => v.services);
      res.status(200).send(av);
    } else {
      const pc = await adminServicesdb.find();
      let arr = pc.map((v) => v.services);
      res.status(200).send(arr);
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.addServices = async (req, res) => {
  try {
    const a = await hospitalServicesdb.find({
      hospitalCode: req.hospitalCode,
    });
    if (a.length === 0) {
      let arr = req.body.arr;
      let p = arr.map((v) => {
        return { services: v };
      });
      const createHospitalServices = new hospitalServicesdb({
        hospitalCode: req.hospitalCode,
        details: p,
      });
      await createHospitalServices.save();
      res.status(200).send({ message: "Done" });
    } else {
      let arr = req.body.arr;
      let p = arr.map((v) => {
        return { services: v };
      });
      const pusha = await hospitalServicesdb.findOneAndUpdate(
        { hospitalCode: req.hospitalCode },
        {
          $push: {
            details: {
              $each: p,
            },
          },
        }
      );
      if (pusha) {
        res.status(200).send({ message: "New services pushed sucessfully" });
      } else {
        res.status(500).send({ message: "Something bad happened" });
      }
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.getFullServices = async (req, res) => {
  try {
    const a = await hospitalServicesdb.findOne({
      hospitalCode: req.hospitalCode,
    });
    if (a) {
      res.status(200).send(a.details);
    } else {
      res.status(200).send({ message: "No services found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.deleteServices = async (req, res) => {
  try {
    const a = await hospitalServicesdb.findOneAndUpdate(
      {
        hospitalCode: req.hospitalCode,
        "details.services": req.params.services,
      },
      {
        $pull: {
          details: { services: req.params.services },
        },
      }
    );
    if (a) {
      res.status(200).send({ message: "Service deleted sucessfully" });
    } else {
      res.status(404).send({ message: "Service not found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.addBedTypes = async (req, res) => {
  try {
    const { body } = req;
    const bedTypeSchema = Joi.object()
      .keys({
        bedName: Joi.string().required(),
        facilities: Joi.array().required(),
        amenities: Joi.array().required(),
        facilitiesCharges: Joi.number().required(),
        amenitiesCharges: Joi.number().required(),
        bedCharges: Joi.number().required(),
        totalCharges: Joi.number().required(),
      })
      .required();
    let result = bedTypeSchema.validate(body);
    if (result.error) {
      res.status(403).send({ message: "Please enter valid details" });
    } else {
      const a = await myBedTypesdb.find({
        hospitalCode: req.hospitalCode,
      });
      if (a.length == 0) {
        const createBedTypes = new myBedTypesdb({
          hospitalCode: req.hospitalCode,
          beds: [
            {
              bedName: req.body.bedName,
              facilities: req.body.facilities,
              amenities: req.body.amenities,
              charges: {
                facilitiesCharges: req.body.facilitiesCharges,
                amenitiesCharges: req.body.amenitiesCharges,
                bedCharges: req.body.bedCharges,
                totalCharges: req.body.totalCharges,
              },
            },
          ],
        });
        await createBedTypes.save();
        res.status(200).send({ message: "Done" });
      } else {
        const pusha = await myBedTypesdb.findOneAndUpdate(
          { hospitalCode: req.hospitalCode },
          {
            $push: {
              beds: {
                bedName: req.body.bedName,
                facilities: req.body.facilities,
                amenities: req.body.amenities,
                charges: {
                  facilitiesCharges: req.body.facilitiesCharges,
                  amenitiesCharges: req.body.amenitiesCharges,
                  bedCharges: req.body.bedCharges,
                  totalCharges: req.body.totalCharges,
                },
              },
            },
          }
        );
        if (pusha) {
          res.status(200).send({ message: "New services pushed sucessfully" });
        } else {
          res.status(500).send({ message: "Something bad happened" });
        }
      }
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};

exports.getBedTypes = async (req, res) => {
  try {
    const a = await myBedTypesdb.findOne({
      hospitalCode: req.hospitalCode,
    });
    if (a) {
      res.status(200).send(a.beds);
    } else {
      res.status(200).send({ message: "No beds found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.deleteBedTypes = async (req, res) => {
  try {
    const del = await myBedTypesdb.findOneAndUpdate(
      { hospitalCode: req.hospitalCode },
      {
        $pull: { beds: { _id: req.params.id } },
      }
    );
    if (del) {
      res.status(200).send({ message: "Deleted sucessfully" });
    } else {
      res.status(404).send({ message: "Id not found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.getInsurance = async (req, res) => {
  try {
    const a = await hospitalInsurancedb.findOne({
      hospitalCode: req.hospitalCode,
    });
    if (a) {
      let am = { insurance: [], tpa: [] };
      a.details.map((v) => {
        am.insurance.push(v.insurance);
        am.tpa.push(v.tpa);
      });

      let b = await adminInsurancedb.find({
        $or: [{ insurance: { $nin: am.insurance } }, { tpa: { $nin: am.tpa } }],
      });
      res.status(200).send(b);
    } else {
      const pc = await adminInsurancedb.find();
      res.status(200).send(pc);
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.addInsurance = async (req, res) => {
  try {
    const a = await hospitalInsurancedb.find({
      hospitalCode: req.hospitalCode,
    });
    if (a.length === 0) {
      let arr = req.body.arr;
      let p = arr.map((v) => {
        return { insurance: v.insurance, tpa: v.tpa };
      });

      const createHospitalInsurance = new hospitalInsurancedb({
        hospitalCode: req.hospitalCode,
        details: p,
      });
      await createHospitalInsurance.save();
      res.status(200).send({ message: "Done" });
    } else {
      let arr = req.body.arr;
      let p = arr.map((v) => {
        return { insurance: v.insurance, tpa: v.tpa };
      });
      const pusha = await hospitalInsurancedb.findOneAndUpdate(
        { hospitalCode: req.hospitalCode },
        {
          $push: {
            details: {
              $each: p,
            },
          },
        }
      );
      if (pusha) {
        res.status(200).send({ message: "New insurance pushed sucessfully" });
      } else {
        res.status(500).send({ message: "Something bad happened" });
      }
    }
  } catch (e) {
    res.status(500).send({ message: e });
  }
};
exports.getFullInsurance = async (req, res) => {
  try {
    const a = await hospitalInsurancedb.findOne({
      hospitalCode: req.hospitalCode,
    });
    if (a) {
      res.status(200).send(a.details);
    } else {
      res.status(404).send({ message: "No Insurance found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.deleteInsurance = async (req, res) => {
  try {
    const a = await hospitalInsurancedb.findOneAndUpdate(
      {
        hospitalCode: req.hospitalCode,
        "details.insurance": req.params.insurance,
        "details.tpa": req.params.tpa,
      },
      {
        $pull: {
          details: { insurance: req.params.insurance, tpa: req.params.tpa },
        },
      }
    );
    if (a) {
      res.status(200).send({ message: "Insurance deleted sucessfully" });
    } else {
      res.status(404).send({ message: "Insurance not found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.getDepartment = async (req, res) => {
  try {
    const a = await hospitalDepartmentdb.findOne({
      hospitalCode: req.hospitalCode,
    });
    if (a) {
      let am = a.details.map((v) => v.department);
      let b = await adminDepartmentdb.find({ department: { $nin: am } });
      let av = b.map((v) => v.department);
      res.status(200).send(av);
    } else {
      const pc = await adminDepartmentdb.find();
      let arr = pc.map((v) => v.department);
      res.status(200).send(arr);
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.addDepartment = async (req, res) => {
  try {
    const a = await hospitalDepartmentdb.find({
      hospitalCode: req.hospitalCode,
    });
    if (a.length === 0) {
      let arr = req.body.arr;
      let p = arr.map((v) => {
        return { department: v };
      });
      const createHospitalDepartment = new hospitalDepartmentdb({
        hospitalCode: req.hospitalCode,
        details: p,
      });
      await createHospitalDepartment.save();
      res.status(200).send({ message: "Done" });
    } else {
      let arr = req.body.arr;
      let p = arr.map((v) => {
        return { department: v };
      });
      const pusha = await hospitalDepartmentdb.findOneAndUpdate(
        { hospitalCode: req.hospitalCode },
        {
          $push: {
            details: {
              $each: p,
            },
          },
        }
      );
      if (pusha) {
        res.status(200).send({ message: "New department pushed sucessfully" });
      } else {
        res.status(500).send({ message: "Something bad happened" });
      }
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.getFullDepartment = async (req, res) => {
  try {
    const a = await hospitalDepartmentdb.findOne({
      hospitalCode: req.hospitalCode,
    });
    if (a) {
      res.status(200).send(a.details);
    } else {
      res.status(500).send({ message: "No department found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const a = await hospitalDepartmentdb.findOneAndUpdate(
      {
        hospitalCode: req.hospitalCode,
        "details.department": req.params.department,
      },
      {
        $pull: {
          details: { department: req.params.department },
        },
      }
    );
    if (a) {
      res.status(200).send({ message: "Department deleted sucessfully" });
    } else {
      res.status(404).send({ message: "Department not found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.hospitalAdminGetBookingRequests = async (req, res) => {
  try {
    const allHospitalRequests = await hospitalForm.find({
      hospitalCode: req.hospitalCode,
    });
    res.status(200).send(allHospitalRequests);
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.hospitalAdminPendingBookingRequests = async (req, res) => {
  try {
    const allHospitalPendingRequests = await hospitalForm.find(
      {
        hospitalCode: req.hospitalCode,
        bookingStatus: "pending",
      },
      { _id: 0, __v: 0 }
    );
    res.status(200).send(allHospitalPendingRequests);
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.hospitalAdminAcceptedBookingRequests = async (req, res) => {
  try {
    const allHospitalAcceptedRequests = await hospitalForm.find(
      {
        hospitalCode: req.hospitalCode,
        bookingStatus: "accepted",
      },
      { _id: 0, __v: 0 }
    );
    res.status(200).send(allHospitalAcceptedRequests);
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.hospitalAdminRejectedBookingRequests = async (req, res) => {
  try {
    const allHospitalRejectedRequests = await hospitalForm.find(
      {
        hospitalCode: req.hospitalCode,
        bookingStatus: "rejected",
      },
      { _id: 0, __v: 0 }
    );
    res.status(200).send(allHospitalRejectedRequests);
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.updateRejectRequests = async (req, res) => {
  try {
    const allHospitalRejectedRequests = await hospitalForm.findOneAndUpdate(
      {
        hospitalCode: req.hospitalCode,
        bookingStatus: "pending",
        bookingId: req.body.bookingId,
      },
      { bookingStatus: "rejected" }
    );
    if (allHospitalRejectedRequests) {
      res.status(200).send({ message: "Rejected sucessfully" });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.updateAcceptRequests = async (req, res) => {
  try {
    const allHospitalRejectedRequests = await hospitalForm.findOneAndUpdate(
      {
        hospitalCode: req.hospitalCode,
        bookingStatus: "pending",
        bookingId: req.body.bookingId,
      },
      { bookingStatus: "accepted" }
    );
    if (allHospitalRejectedRequests) {
      await hospitaldb.findOneAndUpdate(
        {
          hospitalCode: req.hospitalCode,
        },
        {
          $inc: { vacantBeds: -1 },
        }
      );
      res.status(200).send({ message: "Accepted sucessfully" });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.rejectToPending = async (req, res) => {
  try {
    const allHospitalRejectedRequests = await hospitalForm.findOneAndUpdate(
      {
        hospitalCode: req.hospitalCode,
        bookingStatus: "rejected",
        bookingId: req.body.bookingId,
      },
      { bookingStatus: "pending" }
    );
    if (allHospitalRejectedRequests) {
      res.status(200).send({ message: "Sent to pending request sucessfully" });
    } else {
      res.status(404).send({ message: "given id not found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.completeBookings = async (req, res) => {
  try {
    const { body } = req;
    const hospitalAdminSchema = Joi.object()
      .keys({
        bookingId: Joi.string().required(),
        patientName: Joi.string().required(),
        date: Joi.date().required(),
        time: Joi.string().required(),
      })
      .required();
    let result = hospitalAdminSchema.validate(body);

    if (result.error) {
      res.status(422).send({ message: result.error });
    } else {
      const allHospitalAcceptedRequests = await hospitalForm.findOneAndUpdate(
        {
          hospitalCode: req.hospitalCode,
          bookingStatus: "accepted",
          bookingId: req.body.bookingId,
        },
        { bookingStatus: "completed" }
      );
      if (allHospitalAcceptedRequests) {
        const newCompletedBooking = new completeBookingdb({
          bookingId: req.body.bookingId,
          patientName: req.body.patientName,
          hospitalCode: req.hospitalCode,
          date: req.body.date,
          time: req.body.time,
        });
        await newCompletedBooking.save();
        await hospitaldb.findOneAndUpdate(
          {
            hospitalCode: req.hospitalCode,
            bookingId: req.body.bookingId,
            patientName: req.body.patientName,
          },
          {
            $inc: { vacantBeds: 1 },
          }
        );
        res.status(200).send({ message: "Completed sucessfully" });
      } else {
        res.status(404).send({ message: "Given details not found" });
      }
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.getCompletedBooking = async (req, res) => {
  try {
    const allHospitalRequests = await hospitalForm.find({
      hospitalCode: req.hospitalCode,
      bookingStatus: "completed",
    });
    res.status(200).send(allHospitalRequests);
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.getTotalPatients = async (req, res) => {
  try {
    const totalPatients = await hospitalForm
      .find({ hospitalCode: req.hospitalCode })
      .count();
    res.status(200).send({ count: totalPatients });
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.getTotalBeds = async (req, res) => {
  try {
    const totalBeds = await hospitaldb.findOne({
      hospitalCode: req.hospitalCode,
    });
    res.status(200).send({ beds: totalBeds.numberOfBeds });
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
exports.totalIncome = async (req, res) => {
  try {
    const totalIncome = await hospitalForm.aggregate([
      { $match: { hospitalCode: req.hospitalCode } },
      { $group: { _id: null, sum: { $sum: "$bedPrice" } } },
    ]);
    res.status(200).send({ income: totalIncome[0].sum });
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};

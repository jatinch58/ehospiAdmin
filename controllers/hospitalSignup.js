const Joi = require("joi");
const hospitalSignupdb = require("../models/signupHospital");

exports.signUpHospital = async (req, res) => {
  try {
    const { body } = req;
    const hospitalSchema = Joi.object()
      .keys({
        hospitalName: Joi.string().required(),
        hospitalType: Joi.string().required(),
        hospitalAddress: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        phone: Joi.string().required(),
      })
      .required();
    let result = hospitalSchema.validate(body);
    if (result.error) {
      res.status(403).send({ message: result.error });
    } else {
      function bookID() {
        let p = [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
          "P",
          "Q",
          "R",
          "S",
          "T",
          "U",
          "V",
          "W",
          "X",
          "Y",
          "Z",
        ];
        let uid = "";
        for (let i = 0; i < 6; i++) {
          let c = Math.floor(Math.random() * (35 + 1));
          uid = uid.concat(p[c]);
        }
        return uid;
      }
      let n = bookID();
      let hc = await hospitalSignupdb.findOne({ hospitalCode: n });
      if (hc) {
        while (hc) {
          n = bookID();
          hc = await hospitalSignupdb.findOne({ hospitalCode: n });
        }
      }
      const createHospitalSignUp = new hospitalSignupdb({
        hospitalName: req.body.hospitalName,
        status: "pending",
        hospitalCode: n,
        hospitalType: req.body.hospitalType,
        hospitalAddress: req.body.hospitalAddress,
        city: req.body.city,
        state: req.body.state,
        phone: req.body.phone,
      });
      await createHospitalSignUp.save();
      res.status(200).send({ message: "Registered Successfully" });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};

const yup = require("yup");
var express = require("express");
var router = express.Router();

// Write file
const { write } = require("../helpers/FileHelper");
let data = require("../data/customer.json");
const fileName = "./data/customer.json";

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send(data);
});
router.delete("/:id", function (req, res, next) {
  const id = req.params.id;
  data = data.filter((x) => x.id != id);

  res.send({ ok: true, message: "Deleted" });
});
router.post("/", function (req, res, next) {
  const validationSchema = yup.object({
    body: yup.object({
      firstname: yup.string().required(),
      lastname: yup.string().required(),
      phonenumber: yup.string().length(10).required(),
      address: yup.string().required(),
      birthday: yup.date().required(),
      email: yup.string().email().required(),
    }),
  });
  validationSchema
    .validate({ body: req.body }, { abortEarly: false })
    .then(() => {
      const newCustomer = req.body;

      // Get max id
      let max = 0;
      data.forEach((item) => {
        if (max < item.id) {
          max = item.id;
        }
      });

      newCustomer.id = max + 1;

      data.push(newCustomer);
      write(fileName, data);
      res.send({ ok: true, message: "Created" });
    })
    .catch((err) => {
      return res.status(400).json({
        type: err.name,
        errors: err.errors,
        message: err.message,
        provider: "yup",
      });
    });
});
router.patch("/:id", function (req, res, next) {
  let maxId = data[data.length - 1].id;
  const validationSchema = yup.object({
    params: yup.object({
      id: yup.number().max(maxId),
    }),
    body: yup.object({
      firstname: yup.string(),
      lastname: yup.string(),
      phonenumber: yup.string().length(10),
      address: yup.string(),
      birthday: yup.date(),
      email: yup.string().email(),
    }),
  });
  validationSchema
    .validate({ params: req.params }, { body: req.body }, { abortEarly: false })
    .then(() => {
      const id = req.params.id;
      const patchData = req.body;

      let found = data.find((x) => x.id == id);

      if (found) {
        for (let propertyName in patchData) {
          found[propertyName] = patchData[propertyName];
        }
      }
      write(fileName, data);
      res.send({ ok: true, message: "Updated" });
    })
    .catch((err) => {
      return res.status(400).json({
        type: err.name,
        errors: err.errors,
        message: err.message,
        provider: "yup",
      });
    });
});
module.exports = router;

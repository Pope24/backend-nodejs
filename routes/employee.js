var express = require("express");
var router = express.Router();
let { write } = require("../helpers/FileHelper");
let data = require("../data/employee.json");
let fileName = "./data/employee.json";
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
  const newEmployee = req.body;

  // Get max id
  let max = 0;
  data.forEach((item) => {
    if (max < item.id) {
      max = item.id;
    }
  });

  newEmployee.id = max + 1;

  data.push(newEmployee);
  write(fileName, data);

  res.send({ ok: true, message: "Created" });
});
router.patch("/:id", function (req, res, next) {
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
});

module.exports = router;

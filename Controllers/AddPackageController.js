const AdminModel = require("../Models/AdminModel");
const FormModel = require("../Models/FormModel");

const Controller = async (req, res) => {
  let { name, rate } = req.body;

  console.log("Body ", req.body);

  if (!name) {
    return res.status(400).json({ error: "Package name is required." });
  }

  name = name.replace(/MB/gi, "mb");

  console.log(name);

  let userID = req.headers["userID"];

  console.log(userID);

  let find = await AdminModel.findById(userID);

  if (!find) {
    return res.status(401).json({ error: "Invalid admin." });
  }

  if (
    !find.access.ass.includes("All") &&
    !find.access.ass.includes("Update Form")
  ) {
    return res
      .status(403)
      .json({ error: "You are not authorized to perform this action." });
  }

  let packageExists = await FormModel.findOne({
    type: "package",
    name: name,
  });

  if (packageExists) {
    return res.status(409).json({ error: "Package name already exists." });
  }

  let package = new FormModel({ type: "package", name: name, rate: rate });

  package
    .save()
    .then(() => {
      FormModel.find({ type: "package" }).then((package) => {
        const AllPackages = package;
        return res.status(201).json({
          success: "Package created successfully.",
          data: AllPackages,
        });
      });
    })
    .catch((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to create area." });
      }
    });
};

module.exports = Controller;

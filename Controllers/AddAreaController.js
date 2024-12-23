const AdminModel = require("../Models/AdminModel");
const FormModel = require("../Models/FormModel");

const Controller = async (req, res) => {
  let { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Area name is required." });
  }

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

  let areaExists = await FormModel.findOne({ type: "area", name: name });

  if (areaExists) {
    return res.status(409).json({ error: "Area name already exists." });
  }

  let area = new FormModel({ type: "area", name: name });

  area
    .save()
    .then(() => {
      FormModel.find({ type: "area" }).then((area) => {
        const AllAreas = area;
        return res
          .status(201)
          .json({ success: "Area created successfully.", data: AllAreas });
      });
    })
    .catch((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to create area." });
      }
    });
};

module.exports = Controller;

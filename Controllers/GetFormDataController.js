const AdminModel = require("../Models/AdminModel");
const FormModel = require("../Models/FormModel");

const Controller = async (req, res) => {
  let userID = req.headers["userID"];

  let find = await AdminModel.findById(userID);

  console.log("====================================");
  console.log("Find data", find, "UserID", userID);
  console.log("====================================");

  if (!find) {
    return res.status(401).json({ error: "Invalid admin." });
  }

  if (
    !find.access.ass.includes("All") &&
    !find.access.ass.includes("Add User") &&
    !find.access.ass.includes("Edit User") &&
    // !find.access.ass.includes("View User") &&
    !find.access.ass.includes("Upload File") &&
    !find.access.ass.includes("Update Form")
  ) {
    return res
      .status(403)
      .json({ error: "You are not authorized to perform this action." });
  }

  FormModel.find({}).then((formData) => {
    return res
      .status(200)
      .json({ message: "All Form data get successfully", data: formData });
  });
};

module.exports = Controller;

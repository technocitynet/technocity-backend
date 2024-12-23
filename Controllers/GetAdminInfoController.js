const AdminModel = require("../Models/AdminModel");

const Controller = async (req, res) => {
  console.log(req.headers["userID"]);
  let id = req.headers["userID"];

  let findAdminData = await AdminModel.findById(id).select("-password  -_id");

  if (!findAdminData) {
    return res.status(404).json({ error: "Admin Not Found" });
  }

  res.json({ message: "Admin Data Get Successfully", data: findAdminData });
};

module.exports = Controller;

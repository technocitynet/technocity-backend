const AdminModel = require("../Models/AdminModel");
const AuthorizationModel = require("../Models/AuthorizationModel");

const Controller = async (req, res) => {
  console.log(req.headers["userID"]);

  let id = req.headers["userID"];

  let Admin = await AdminModel.findById(id).select("role access _id");

  if (!Admin) {
    return res.status(404).json({ error: "Admin Not Found" });
  }

  let token = req.query.token;

  if (!token) {
    return res.status(401).json({ error: "Authorization Token Not Found" });
  }

  let findToken = await AuthorizationModel.findOne({
    token: token,
  });

  if (!findToken) {
    return res.status(406).json({ error: "Invalid Authorization Token" });
  }

  if (findToken.accountID.toString() !== Admin._id.toString()) {
    return res
      .status(401)
      .json({ error: "Token does not belong to this account" });
  }

  if (Admin.role == "admin" || Admin.access.ass.includes("All") || Admin.access.ass.includes("Manage Accounts")) {
    let AccountsData = await AdminModel.find({
      _id: { $ne: id },
    }).select("-password");

    if (!AccountsData) {
      return res.status(404).json({ error: "Admin Not Found" });
    }

    res.json({ message: "Accounts Data Get Successfully", data: AccountsData });
  } else {
    res.status(403).json({ error: "You don't have access to this feature" });
  }
};

module.exports = Controller;

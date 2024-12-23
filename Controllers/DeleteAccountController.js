const AdminModel = require("../Models/AdminModel");
const AuthorizationModel = require("../Models/AuthorizationModel");

const Controller = async (req, res) => {
  let id = req.headers["userID"];

  let Admin = await AdminModel.findById(id).select("role access");

  if (!Admin) {
    return res.status(401).json({ error: "Invalid token." });
  }

  if (
    !Admin.access.ass.includes("All") &&
    !Admin.access.ass.includes("Manage Accounts")
  ) {
    return res
      .status(403)
      .json({ error: "You are not authorized to perform this action." });
  }

  let accountid = req.query.accountid;
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
    return res.status(401).json({
      error: "Token does not belong to this account Your Token Expired",
    });
  }

  let user = await AdminModel.deleteOne({ _id: accountid });

  if (!user) {
    return res.status(404).json({ error: "Account not found." });
  }

  return res.status(201).json({
    message: "Account Deleted Successfully.",
    id: accountid,
  });
};

module.exports = Controller;

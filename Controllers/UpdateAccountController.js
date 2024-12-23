const { dummyProfile } = require("../Helper/helper");
const AdminModel = require("../Models/AdminModel");
const bcrypt = require("bcryptjs");
const AuthorizationModel = require("../Models/AuthorizationModel");

const Controller = async (req, res) => {
  let { username, password, role, access, profilePicture } = req.body;

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

  if (!username || !role || !access) {
    return res
      .status(400)
      .json({ error: "Username, role and access  are required." });
  }

  let accountId = req.query.accountid;

  let user = await AdminModel.findById(accountId);

  if (!user) {
    return res.status(404).json({ error: "Account not found." });
  }

  let salt = await bcrypt.genSalt(10);

  if (username) {
    user.name = username;
  }
  if (role) {
    user.role = role;
  }
  if (access) {
    user.access = access;
  }
  if (profilePicture) {
    user.profilePicture = profilePicture;
  }
  if (password) {
    user.password = await bcrypt.hash(password, salt);
  }

  let newUser = await AdminModel.findByIdAndUpdate(
    user._id,
    { $set: user },
    { new: true }
  );

  return res.status(201).json({
    message: "Account updated successfully.",
    user: {
      _id: newUser._id,
      name: newUser.name,
      role: newUser.role,
      access: newUser.access,
      profilePicture: newUser.profilePicture,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    },
  });
};

module.exports = Controller;

const { dummyProfile } = require("../Helper/helper");
const AdminModel = require("../Models/AdminModel");
const bcrypt = require("bcryptjs");
const AuthorizationModel = require("../Models/AuthorizationModel");

const Controller = async (req, res) => {
  let { username, password, role, access } = req.body;

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

  if (!username || !password || !role || !access) {
    return res
      .status(400)
      .json({ error: "Username, password, role and access  are required." });
  }

  let user = await AdminModel.findOne({ username: username });

  if (user) {
    return res.status(409).json({ error: "Username already exists." });
  }

  let salt = await bcrypt.genSalt(10);
  let hashedPassword = await bcrypt.hash(password, salt);

  let newUser = new AdminModel({
    name: username,
    password: hashedPassword,
    profilePicture: dummyProfile,
    role,
    access: access,
  });

  await newUser.save();

  return res.status(201).json({
    message: "Account created successfully.",
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

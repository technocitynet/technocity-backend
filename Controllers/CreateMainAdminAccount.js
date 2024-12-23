const { dummyProfile } = require("../Helper/helper");
const AdminModel = require("../Models/AdminModel");
const bcrypt = require("bcryptjs");

const Controller = async (req, res) => {
  let { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username, password are required." });
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
    access: {
      ass: ["All"],
      area: ["All Area"],
    },
  });

  await newUser.save();

  return res.status(201).json({
    message: "User created successfully.",
  });
};

module.exports = Controller;

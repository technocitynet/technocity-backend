const UserModel = require("../Models/UserModel");
const AdminModel = require("../Models/AdminModel");
const UserStatmentModel = require("../Models/UserStatmentModel");

const Controller = async (req, res) => {
  let userID = req.headers["userID"];

  let find = await AdminModel.findById(userID);

  if (!find) {
    return res.status(401).json({ error: "Invalid token." });
  }

  if (find.role !== "admin") {
    return res
      .status(403)
      .json({ error: "You are not authorized to perform this action." });
  }

  try {
    const userId = req.query.userId;
    let data = await UserModel.findOne({ userId : userId });
    let statements = await UserStatmentModel.find({
      userID: data._id.toString(),
    });
    if (data) {
      res
        .status(200)
        .json({ message: "User Info found successfully", data, statements });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to get user info." });
  }
};

module.exports = Controller;

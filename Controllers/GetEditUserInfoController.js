const UserModeld = require("../Models/UserModel");
const AdminModel = require("../Models/AdminModel");

const Controller = async (req, res) => {
  let userID = req.headers["userID"];

  let find = await AdminModel.findById(userID);

  if (!find) {
    return res.status(401).json({ error: "Invalid token." });
  }

  if (
    !find.access.ass.includes("All") &&
    !find.access.ass.includes("Edit User")
  ) {
    return res
      .status(403)
      .json({ error: "You are not authorized to perform this action." });
  }
  try {
    const userID = req.query.userId;
    let data = await UserModeld.find({ userId: userID });
    if (data.length > 0) {
      res.status(200).json({ message: "User Info found successfully", data });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to get user info." });
  }
};

module.exports = Controller;

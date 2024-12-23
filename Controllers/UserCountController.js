const UserModel = require("../Models/UserModel");
const AdminModel = require("../Models/AdminModel");

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
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(startOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    let newCount = await UserModel.countDocuments({
      createdAt: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    });

    let allCount = await UserModel.countDocuments();

    res
      .status(200)
      .json({ message: "User count successfully", allCount, newCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to get user count." });
  }
};

module.exports = Controller;

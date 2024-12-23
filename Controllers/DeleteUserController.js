const AdminModel = require("../Models/AdminModel");
const UserModel = require("../Models/UserModel");
const UserStatmentModel = require("../Models/UserStatmentModel");

const Controller = async (req, res) => {
  let userID = req.headers["userID"];

  let find = await AdminModel.findById(userID);

  if (!find) {
    return res.status(401).json({ error: "Invalid token." });
  }

  if (
    !find.access.ass.includes("All") &&
    !find.access.ass.includes("Delete User")
  ) {
    return res
      .status(403)
      .json({ error: "You are not authorized to perform this action." });
  }

  let { userId } = req.params;

  let findUser = await UserModel.findOne({ userId }).select("_id");

  if (!findUser) {
    return res.status(404).json({ error: "User not found." });
  }

  try {
    await UserModel.deleteOne({ _id: findUser._id });
    await UserStatmentModel.deleteMany({ userID: findUser._id.toString() });

    // User Count
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

    res.status(200).json({
      success: "User deleted successfully.",
      data: { id: findUser._id },
      newCount,
      allCount,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to delete user." });
  }
};

module.exports = Controller;

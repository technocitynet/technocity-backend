const { addUser } = require("../Helper/manageData");
const AdminModel = require("../Models/AdminModel");
const PaymentModel = require("../Models/PaymentModel");
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
    !find.access.ass.includes("Add User")
  ) {
    return res
      .status(403)
      .json({ error: "You are not authorized to perform this action." });
  }

  const findUserID = await UserModel.find({ userId: req.body.userId }).select(
    "userId"
  );

  if (findUserID.length > 0) {
    return res.status(403).json({ error: "User ID already exists." });
  }

  try {
    let bodyData = req.body;
    if (
      !find.access.ass.includes("All") &&
      !find.access.ass.includes("Add Discount")
    ) {
      bodyData.discount = "";
    }

    let respon = await addUser(bodyData);

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

    res.status(201).json({
      success: "User added successfully!",
      data: respon.user,
      allCount,
      newCount,
      paymentReport: respon.paymentReport,
    });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateKey = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ error: `${duplicateKey} already exists.` });
    }
    console.log(error);

    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0].message;
      return res.status(400).json({ error: firstError });
    }

    res.status(500).json({ error: "An unexpected error occurred." });
  }
};

module.exports = Controller;

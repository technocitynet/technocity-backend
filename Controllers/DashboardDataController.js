const AdminModel = require("../Models/AdminModel");
const PaymentModel = require("../Models/PaymentModel");
const UserModel = require("../Models/UserModel");

const Controller = async (req, res) => {
  let userID = req.headers["userID"];

  console.log(userID);

  let find = await AdminModel.findById(userID);

  if (!find) {
    return res.status(401).json({ error: "Invalid admin." });
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

    let allCount = await UserModel.countDocuments({
      active: true,
    });
    let deActiveUsers = await UserModel.countDocuments({ active: false });

    let paymentReport = await PaymentModel.findOneAndUpdate({
      type: "PaymentReport",
    });

    const data = await UserModel.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("userId username createdAt balancedAmount");

    res.send({
      usersCount: allCount,
      newUserCounts: newCount,
      paymentReport: paymentReport,
      recentUsers: data,
      deActiveUsers: deActiveUsers,
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

module.exports = Controller;

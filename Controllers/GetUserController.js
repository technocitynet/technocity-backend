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
    !find.access.ass.includes("Edit User") &&
    !find.access.ass.includes("Edit Amount") &&
    !find.access.ass.includes("View Users Statement") &&
    !find.access.ass.includes("View Users")
  ) {
    return res
      .status(403)
      .json({ error: "You are not authorized to perform this action." });
  }

  try {
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;

    const skip = (page - 1) * limit;

    let query = {
      active: true,
    };

    if (
      !find.access.ass.includes("All") &&
      !find.access.area.includes("All Area")
    ) {
      query.area = { $in: find.access.area };
    }

    let data = await UserModeld.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .select(
        "userId username createdAt updatedAt package totalAmount amountPaid balancedAmount lastMonthDue otherAmount discount decribeOtherAmount monthEndDate"
      );

    let totalDocuments = await UserModeld.countDocuments(query);

    res.status(200).json({
      message: "User data fetched successfully.",
      currentPage: page,
      limit: limit,
      totalPages: Math.ceil(totalDocuments / limit),
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user data." });
  }
};

module.exports = Controller;

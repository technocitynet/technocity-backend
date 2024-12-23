const AdminModel = require("../Models/AdminModel");
const UserModel = require("../Models/UserModel");

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

  const {
    startDate,
    endDate,
    area,
    lastMonthDue,
    minAmount,
    maxAmount,
    page = 1,
    limit = 20,
  } = req.query;

  try {
    let filterConditions = {};

    if (startDate || endDate) {
      let dateFilter = {};

      if (startDate) {
        dateFilter.$gte = new Date(startDate);
      }

      if (endDate) {
        dateFilter.$lte = new Date(endDate);
      }

      filterConditions.createdAt = dateFilter;
    }

    if (area) {
      let areasArray = area.split(",").map((areaItem) => areaItem.trim());
      if (
        !find.access.area.includes("All") &&
        !find.access.area.includes("All Area")
      ) {
        areasArray = areasArray.map((ar) => {
          if (find.access.area.includes(ar)) {
            return ar;
          }
        });
      }
      filterConditions.area = { $in: areasArray };
    } else {
      if (
        !find.access.area.includes("All") &&
        !find.access.area.includes("All Area")
      ) {
        filterConditions.area = { $in: find.access.area };
      }
    }

    if (lastMonthDue) {
      filterConditions.lastMonthDue =
        lastMonthDue === "receive" ? { $gt: 0 } : { $lt: 0 };
    }

    if (minAmount || maxAmount) {
      let amountFilter = {};
      if (minAmount) amountFilter.$gte = parseFloat(minAmount);
      if (maxAmount) amountFilter.$lte = parseFloat(maxAmount);

      filterConditions.balancedAmount = amountFilter;
    }

    const skip = (page - 1) * limit;

    const users = await UserModel.find(filterConditions)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }).select("userId phoneNumber createdAt monthEndDate package amountPaid lastMonthDue balancedAmount totalAmount")

    const totalDocuments = await UserModel.countDocuments(filterConditions);

    res.status(200).json({
      message: "Filtered users fetched successfully.",
      currentPage: parseFloat(page),
      limit: limit,
      totalPages: Math.ceil(totalDocuments / limit),
      totalUsers: totalDocuments,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch filtered users." });
  }
};

module.exports = Controller;

const UserModel = require("../Models/UserModel");
const AdminModel = require("../Models/AdminModel");

const Controller = async (req, res) => {
  let userID = req.headers["userID"];

  let find = await AdminModel.findById(userID);

  if (!find) {
    return res.status(401).json({ error: "Invalid token." });
  }

  if (
    !find.access.ass.includes("All") &&
    !find.access.ass.includes("View Users")
  ) {
    return res
      .status(403)
      .json({ error: "You are not authorized to perform this action." });
  }

  try {
    console.log("Request Url is :", req.url);

    const q = req.query.q;
    const filterArea = req.query.filterarea;
    let limit = parseFloat(req.query.limit || 10);
    let page = parseFloat(req.query.page || 1);

    console.log("Query : ", q);
    console.log("Filter Area : ", filterArea);
    console.log("Limit : ", limit);
    console.log("Page : ", page);

    let query = {
      $or: [
        { userId: { $regex: String(q), $options: "i" } },
        { username: { $regex: String(q), $options: "i" } },
      ],
    };

    if (filterArea) {
      query.area = filterArea;
    }

    const data = await UserModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select(
        "userId username area active amountPaid balancedAmount totalAmount updatedAt otherAmount decribeOtherAmount"
      );

    let totalDocuments = await UserModel.countDocuments(query);

    let totalPages = Math.ceil(totalDocuments / limit);

    res.status(200).json({
      message: "User Search successfully",
      data,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.log("Error: ", err);
    res.status(500).json({ error: "Failed to get user." });
  }
};

module.exports = Controller;

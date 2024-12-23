const AdminModel = require("../Models/AdminModel");
const AmmountStatement = require("../Models/AmmountStatement");
const TotalStatement = require("../Models/TotalStatement");

const Controller = async (req, res) => {
  let userID = req.headers["userID"];

  let find = await AdminModel.findById(userID);

  if (!find) {
    return res.status(401).json({ error: "Invalid token." });
  }

  if (
    !find.access.ass.includes("All") &&
    !find.access.ass.includes("View Sale Statement")
  ) {
    return res
      .status(403)
      .json({ error: "You are not authorized to perform this action." });
  }

  let AmmountStatement = await TotalStatement.find();

  res.json({ statement: AmmountStatement });
};

module.exports = Controller;

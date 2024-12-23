const AdminModel = require("../Models/AdminModel");
const FormModel = require("../Models/FormModel");

const Controller = async (req, res) => {
  let userID = req.headers["userID"];

  console.log(userID);

  let find = await AdminModel.findById(userID);

  if (!find) {
    return res.status(401).json({ error: "Invalid admin." });
  }

  if (
    !find.access.ass.includes("All") &&
    !find.access.ass.includes("Update Form")
  ) {
    return res
      .status(403)
      .json({ error: "You are not authorized to perform this action." });
  }

  let { id, type } = req.params;

  await FormModel.deleteOne({
    _id: id,
  });

  return res.json({
    message: `${type} deleted successfully.`,
    id: id,
    type: type,
  });
};

module.exports = Controller;

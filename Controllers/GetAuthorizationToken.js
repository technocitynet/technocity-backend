const AdminModel = require("../Models/AdminModel");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const AuthorizationModel = require("../Models/AuthorizationModel");

const Controller = async (req, res) => {
  const { password } = req.body;

  let userID = req.headers["userID"];

  let find = await AdminModel.findById(userID);

  if (!find) {
    return res.status(404).json({ error: "Account Not Found" });
  }

  if (
    !find.access.ass.includes("All") &&
    !find.access.ass.includes("Manage Accounts")
  ) {
    return res
      .status(403)
      .json({ error: "You are not authorized to perform this action" });
  }

  bcrypt
    .compare(password, find.password)
    .then((response) => {
      console.log("Pasword bycrypt", response);
      if (response) {
        (async () => {
          let tokenID = uuidv4();
          let newAuthorizationToken = new AuthorizationModel({
            accountID: find._id,
            token: tokenID,
          });
          await newAuthorizationToken.save();
          res.status(200).send({
            success: "Authorized Successfully",
            token: tokenID,
          });
        })();
      } else {
        return res.status(401).json({ error: "Invalid Password" });
      }
    })
    .catch((err) => {
      return res.status(401).json({ error: "Error While Decrypt Password" });
    });
};

module.exports = Controller;

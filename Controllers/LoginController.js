const AdminModel = require("../Models/AdminModel");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../Helper/helper");

const Controller = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  let data = await AdminModel.findOne({ name: username.trim() });

  if (!data) {
    return res.status(404).json({ error: "Invalid Credential" });
  }

  bcrypt
    .compare(password, data.password)
    .then((response) => {
      console.log("Pasword bycrypt", response);

      if (response) {
        (async () => {
          let findData = await AdminModel.findById(data._id.toString()).select(
            "-password -_id"
          );
          res.status(200).send({
            success: "Login Successfully",
            data: findData,
            token: generateToken(data._id.toString()),
          });
        })();
      } else {
        return res.status(401).json({ error: "Invalid Password" });
      }
    })
    .catch((err) => {
      console.log("password does not match", err);
      return res.status(401).json({ error: "Invalid Password" });
    });
};

module.exports = Controller;

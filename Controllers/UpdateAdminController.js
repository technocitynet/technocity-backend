const AdminModel = require("../Models/AdminModel");
const bcrypt = require("bcryptjs");

const Controller = async (req, res) => {
  let { profilePicture, username, password, lastPassword } = req.body;
  let error = "";

  let userID = req.headers["userID"];
  console.log("UserID:", userID);

  try {
    let userData = await AdminModel.findById(userID);

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    if (profilePicture || username || password) {
      if (profilePicture) {
        userData.profilePicture = profilePicture;
      }

      if (username) {
        userData.name = username.trim();
      }

      if (password) {
        if (lastPassword) {
          try {
            const isMatch = await bcrypt.compare(
              lastPassword,
              userData.password
            );

            if (isMatch) {
              const salt = await bcrypt.genSalt(10);
              const hashedPassword = await bcrypt.hash(password, salt);
              userData.password = hashedPassword;
            } else {
              error = "Last Password is Incorrect";
              return res.status(400).json({ error });
            }
          } catch (err) {
            console.error("Error during password comparison:", err);
            return res.status(500).json({ error: "Password comparison error" });
          }
        } else {
          error = "Last Password is Required";
          return res.status(400).json({ error });
        }
      }

      if (error === "") {
        console.log("Updated user data:", userData);
        await userData.save();

        let finduserData = await AdminModel.findById(
          userData._id.toString()
        ).select("-password -_id");
        res.status(200).send({
          success: "Updated Successfully",
          data: finduserData,
        });
      }
    } else {
      return res.status(400).json({ error: "An Error Occurred!!" });
    }
  } catch (err) {
    console.error("Error during user update:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = Controller;

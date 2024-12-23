const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    name: String,
    password: String,
    profilePicture: String,
    role: String,
    access: { type: Object, default: {} },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AdminAccount", Schema);

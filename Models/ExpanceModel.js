const { default: mongoose } = require("mongoose");

const Schema = new mongoose.Schema(
  {
    date: String,
    amount: { type: Number, default: 0 },
    name: String,
    reason: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expance", Schema);

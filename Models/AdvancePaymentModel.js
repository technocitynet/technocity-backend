const { default: mongoose } = require("mongoose");

const Schema = new mongoose.Schema({
  userId: string,
  username: string,
  amount: number,
});

module.exports = mongoose.model("AdvancePayment", Schema);
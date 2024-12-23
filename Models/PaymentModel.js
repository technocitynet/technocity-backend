const { default: mongoose } = require("mongoose");

const Schema = new mongoose.Schema({
  totaSale: {
    type: Number,
    default: 0,
  },
  totalBalanced: {
    type: Number,
    default: 0,
  },
  advanceBalanced: {
    type: Number,
    default: 0,
  },
  expanseAmount: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    default: "PaymentReport",
  },
});

module.exports = mongoose.model("PaymentReport", Schema);

const { default: mongoose } = require("mongoose");

const Schema = new mongoose.Schema(
  {
    saleDaysHistory: { type: Array, default: [] },
    expanseDaysHistory: { type: Array, default: [] },
    totalSale: { type: Number, default: 0 },
    totalExpanse: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("totalStatement", Schema);
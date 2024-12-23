const { default: mongoose } = require("mongoose");

const Schema = new mongoose.Schema({
  userID: String,
  statementHistory: Array,
  toDate: { type: Date, default: new Date() },
  endDate: {
    type: Date,
    default: new Date().setMonth(new Date().getMonth() + 1),
  },
});

module.exports = mongoose.model("StatementHsitory", Schema);
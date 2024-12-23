const { formatDate } = require("../Helper/helper");
const AdminModel = require("../Models/AdminModel");
const ExpanceModel = require("../Models/ExpanceModel");
const PaymentModel = require("../Models/PaymentModel");
const TotalStatement = require("../Models/TotalStatement");

const Controller = async (req, res) => {
  let userID = req.headers["userID"];

  console.log(userID);

  let find = await AdminModel.findById(userID);

  if (!find) {
    return res.status(401).json({ error: "Invalid admin." });
  }

  if (
    !find.access.ass.includes("All") &&
    !find.access.ass.includes("Add Expanse") 
  ) {
    return res
      .status(403)
      .json({ error: "You are not authorized to perform this action." });
  }

  let data = req.body;

  let newExpance = new ExpanceModel({
    amount: parseFloat(data.amount || 0),
    date: formatDate(new Date()),
    name: find.name,
    reason: data.reason,
  });

  await newExpance.save();

  let PaymentHistory = await TotalStatement.findOne({
    createdAt: {
      $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    },
  });

  let totalSale = parseFloat(data.amount || 0);

  if (totalSale !== 0) {
    console.log("Amount is greator Than 0");
    if (PaymentHistory) {
      PaymentHistory.totalExpanse += totalSale;
      let findDayIndex = PaymentHistory.expanseDaysHistory.findIndex(
        (t) => t.date === formatDate(new Date())
      );
      if (findDayIndex > -1) {
        PaymentHistory.expanseDaysHistory[findDayIndex].amount += totalSale;
        PaymentHistory.markModified("expanseDaysHistory");
      } else {
        PaymentHistory.expanseDaysHistory.push({
          date: formatDate(new Date()),
          amount: totalSale,
        });
      }
    } else {
      PaymentHistory = new TotalStatement({
        totalExpanse: totalSale,
        expanseDaysHistory: [
          {
            date: formatDate(new Date()),
            amount: totalSale,
          },
        ],
      });
    }

    await PaymentHistory.save();
  }

  let paymentReport = await PaymentModel.findOneAndUpdate(
    { type: "PaymentReport" },
    {
      $inc: {
        expanseAmount: parseFloat(data.amount || 0),
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

  res.send({
    message: "Expance added successfully.",
    paymentReport: paymentReport,
  });
};

module.exports = Controller;

const AmmountStatement = require("../Models/AmmountStatement");
const PaymentModel = require("../Models/PaymentModel");
const TotalStatement = require("../Models/TotalStatement");
const UserModel = require("../Models/UserModel");
const UserStatmentModel = require("../Models/UserStatmentModel");
const { formatDate } = require("./helper");

module.exports.addUser = async (data) => {
  const user = new UserModel(data);
  await user.save();

  let subTotalAmmount =
    parseFloat(user.packageRate || 0) +
    parseFloat(user.otherAmount || 0) +
    parseFloat(user.staticIPAmmount || 0) +
    parseFloat(user.lastMonthDue || 0);

  let totalAmmount =
    parseFloat(user.packageRate || 0) +
    parseFloat(user.lastMonthDue || 0) +
    parseFloat(user.otherAmount || 0) -
    parseFloat(user.discount || 0);

  if (user.staticIP) {
    totalAmmount += Number(user.staticIPAmmount);
  }

  let monthEndDate =
    user.monthEndDate ||
    new Date(user.createdAt).setMonth(new Date(user.createdAt).getMonth() + 1);
  const statementHistory = new UserStatmentModel({
    userID: user._id.toString(),
    statementHistory: [
      {
        type: "userAdd",
        date: new Date(),
        staticIPAmount: user.staticIPAmmount,
        packageAmount: user.packageRate,
        otherAmount: user.otherAmount,
        subTotalAmount: subTotalAmmount,
        discount: user.discount,
        totalAmount: totalAmmount,
        amountPaid: user.amountPaid,
        balance: totalAmmount - parseFloat(user.amountPaid || 0),
        packagename: user.package,
        ipAddress: user.staticIPAddress,
        describe: user.decribeOtherAmount,
      },
    ],
    toDate: new Date(),
    endDate: monthEndDate,
  });

  await statementHistory.save();

  let totalAmount =
    parseFloat(user.packageRate || 0) +
    parseFloat(user.lastMonthDue || 0) +
    parseFloat(user.otherAmount || 0) -
    parseFloat(user.discount || 0);
  if (user.staticIP) {
    totalAmount += parseFloat(user.staticIPAmmount || 0);
  }

  let amountPaid = parseFloat(user.amountPaid || 0);
  let totalSale = amountPaid;
  let advanceBalanced = 0;
  let balanced = 0;

  if (totalAmount < amountPaid) {
    advanceBalanced = amountPaid - totalAmount;
  } else {
    balanced = totalAmount - amountPaid;
  }

  let paymentReport = await PaymentModel.findOneAndUpdate(
    { type: "PaymentReport" },
    {
      $inc: {
        totalBalanced: balanced,
        totaSale: totalSale,
        advanceBalanced: advanceBalanced,
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

    let PaymentHistory = await TotalStatement.findOne({
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      },
    });

  if (totalSale !== 0) {
      if (PaymentHistory) {
        PaymentHistory.totalSale += totalSale;
        let findDayIndex = PaymentHistory.saleDaysHistory.findIndex(
          (t) => t.date === formatDate(new Date())
        );
        if (findDayIndex > -1) {
          PaymentHistory.saleDaysHistory[findDayIndex].amount += totalSale;
          PaymentHistory.markModified("saleDaysHistory");
        } else {
          PaymentHistory.saleDaysHistory.push({
            date: formatDate(new Date()),
            amount: totalSale,
          });
        }
      } else {
        PaymentHistory = new TotalStatement({
          totalSale: totalSale,
          saleDaysHistory: [
            {
              date: formatDate(new Date()),
              amount: totalSale,
            },
          ],
        });
      }
      await PaymentHistory.save();
    }

  if (user.amountPaid !== "") {
    let NewAmountStatement = new AmmountStatement({
      userID: user.userId,
      amount: user.amountPaid,
      name: user.username,
      date: formatDate(new Date()),
    });
    await NewAmountStatement.save();
  }

  return {
    user,
    paymentReport,
  };
};

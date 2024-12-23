const { formatDate } = require("../Helper/helper");
const AdminModel = require("../Models/AdminModel");
const AmmountStatement = require("../Models/AmmountStatement");
const PaymentModel = require("../Models/PaymentModel");
const TotalStatement = require("../Models/TotalStatement");
const UserModel = require("../Models/UserModel");
const UserStatmentModel = require("../Models/UserStatmentModel");

const Controller = async (req, res) => {
  let userID = req.headers["userID"];

  let find = await AdminModel.findById(userID).select(
    "-profilePicture -createdAt -updatedAt"
  );

  if (!find) {
    return res.status(401).json({ error: "Invalid token." });
  }

  let { data, editedStatement } = req.body;

  console.log("Body", req.body);

  if (!data.connectionType) {
    if (
      !find.access.ass.includes("All") &&
      !find.access.ass.includes("Edit Amount")
    ) {
      console.log(find);
      return res
        .status(403)
        .json({ error: "You are not authorized to perform this action." });
    }
    let foundUserData = await UserModel.findOne({ userId: data.userId }).select(
      "staticIPAmmount lastMonthDue packageRate otherAmount discount username"
    );

    if (data.amountAdd > 0) {
      await AmmountStatement.findOneAndUpdate(
        {
          userID: data.userId,
          name: foundUserData.username,
          date: formatDate(new Date()),
        },
        {
          $inc: {
            amount: data.amountAdd,
          },
        },
        {
          new: true,
          upsert: true,
        }
      );
    }

    if (!foundUserData) {
      return res.status(404).json({ error: "User not found." });
    }

    data = {
      amountPaid: data.amountPaid,
      staticIPAmmount: foundUserData.staticIPAmmount,
      lastMonthDue: foundUserData.lastMonthDue,
      packageRate: foundUserData.packageRate,
      otherAmount: data.otherAmount,
      decribeOtherAmount: data.decribeOtherAmount,
      discount: foundUserData.discount,
      userId: data.userId,
    };
  } else {
    if (
      !find.access.ass.includes("All") &&
      !find.access.ass.includes("Edit User")
    ) {
      return res
        .status(403)
        .json({ error: "You are not authorized to perform this action." });
    }
  }

  let statements = editedStatement.statements;

  let balanced = editedStatement.balancedAmount;
  let totalSale = editedStatement.totalSaleAmount;
  let advanceBalanced = editedStatement.advanceBalancedAmount;

  if (!data || !statements || !Array.isArray(statements)) {
    return res.status(400).json({ error: "Invalid data or statements." });
  }

  let userdataid = data.userId;

  let findUserDataWithUserID = await UserModel.findOne({ userId: userdataid });

  if (!findUserDataWithUserID) {
    return res.status(404).json({ error: "User not found." });
  }

  let statementHistory = await UserStatmentModel.findOne({
    userID: findUserDataWithUserID._id.toString(),
    endDate: findUserDataWithUserID.monthEndDate,
  });

  if (!statementHistory) {
    let totalAmmount =
      Number(findUserDataWithUserID.packageRate) +
      Number(findUserDataWithUserID.lastMonthDue) +
      parseFloat(findUserDataWithUserID.otherAmount || 0) -
      parseFloat(findUserDataWithUserID.discount || 0);

    if (findUserDataWithUserID.staticIP) {
      totalAmmount += Number(findUserDataWithUserID.staticIPAmmount);
    }

    statementHistory = new UserStatmentModel({
      userID: findUserDataWithUserID._id.toString(),
      statementHistory: [],
    });
  }

  if (statements.length > 0) {
    statementHistory.statementHistory =
      statementHistory.statementHistory.concat(statements);
    statements.map((obj) => {
      if (obj.type === "userStatus") {
        statementHistory.active = obj.newUserStatus;
      } else {
        statementHistory.totalAmmount = obj.newTotalAmount;
      }
    });
  }

  try {
    let userData = await UserModel.findOneAndUpdate(
      { _id: findUserDataWithUserID._id.toString() },
      { $set: { ...data } },
      { new: true, runValidators: true }
    );

    await statementHistory.save();

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
      console.log("Amount is greator Than 0");
      if (PaymentHistory) {
        PaymentHistory.totalSale += totalSale;
        console.log("Find Index ");
        let findDayIndex = PaymentHistory.saleDaysHistory.findIndex(
          (t) => t.date === formatDate(new Date())
        );
        if (findDayIndex > -1) {
          console.log("Statement Alredy Find Index is ", findDayIndex);
          PaymentHistory.saleDaysHistory[findDayIndex].amount += totalSale;
          PaymentHistory.markModified("saleDaysHistory");
          console.log(
            "Statement Amount updated to ",
            PaymentHistory.saleDaysHistory[findDayIndex].amount
          );
        } else {
          console.log(
            "Statement Index Not Found ",
            findDayIndex,
            " Creating New data"
          );
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

      console.log("Updated PaymentHistory object: ", PaymentHistory);
      await PaymentHistory.save();
    }

    res.status(200).json({
      success: "User Updated successfully.",
      data: userData,
      paymentReport,
    });
  } catch (err) {
    console.log("Error updating user data : ", err);
    return res.status(500).json({ error: "Failed to update user data." });
  }
};

module.exports = Controller;

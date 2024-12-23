const { addUser } = require("../Helper/manageData");
const UserModel = require("../Models/UserModel");

const Controller = async (req, res) => {
  const { data } = req.body;

  const totalRecords = data.length;
  let recordsProcessed = 0;
  let skippedRecords = 0;

  res.setHeader("Content-Type", "application/json");

  try {
    // Start response stream
    res.write(JSON.stringify({ message: "Processing started..." }));

    let dataOF = [];

    for (let i = 0; i < totalRecords; i++) {
      const row = data[i];
      console.log(`Checking userId: ${row.userId}`);

      // Check if connection is still active
      if (!res.writableEnded) {
        const existingUser = await UserModel.findOne({
          userId: row.userId,
        }).select("userId");

        if (existingUser) {
          console.log(
            `User with userId ${row.userId} already exists. Skipping...`
          );
          skippedRecords++;
        } else {
          const newUser = await addUser({
            userId: row.userId,
            username: row.username,
            connectionType: row.connectionType,
            port: row.port || "",
            vlan: row.vlan || "",
            package: row.package,
            packageRate: row.packageRate,
            amountPaid: row.amountPaid,
            cnicNumber: row.cnicNumber,
            phoneNumber: row.phoneNumber,
            cellNumber: row.cellNumber,
            address: row.address,
            area: row.area,
            staticIP: row.staticIP,
            staticIPAmmount: row.staticIPAmmount || "",
            staticIPAddress: row.staticIPAddress || "",
            remark: row.remark || "",
            lastMonthDue: row.lastMonthDue || "",
            active: row.active,
            createdAt: row.createdAt || new Date(),
            monthEndDate:
              row.monthEndDate ||
              new Date().setMonth(new Date().getMonth() + 1),
          });

          dataOF.push({
            _id: newUser._id,
            userId: newUser.user.userId,
            username: newUser.user.username,
            createdAt: newUser.user.createdAt,
            updatedAt: newUser.user.updatedAt,
            package: newUser.user.package,
            totalAmount: newUser.user.totalAmount,
            amountPaid: newUser.user.amountPaid,
            balancedAmount: newUser.user.balancedAmount,
            lastMonthDue: newUser.user.lastMonthDue,
            active: newUser.user.active,
            otherAmount: newUser.user.otherAmount,
            discount: newUser.user.discount,
            decribeOtherAmount: newUser.user.decribeOtherAmount,
            monthEndDate: newUser.user.monthEndDate,
          });

          recordsProcessed++;
        }

        const progress = Math.round(
          ((recordsProcessed + skippedRecords) / totalRecords) * 100
        );

        // Send progress update

        res.write(
          JSON.stringify({
            progress,
            message: `Processed ${
              recordsProcessed + skippedRecords
            } of ${totalRecords} records`,
          })
        );

        // Throttle the response
        if (i % 10 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      } else {
        console.log("Connection closed by client, stopping processing.");
        break; // Exit the loop if the connection is closed
      }
    }

    // End response stream if connection is still active
    if (!res.writableEnded) {
      res.end(
        JSON.stringify({
          data: dataOF,
          message: " Upload File Data  Successfully",
          skippedRecords,
          progress: 100,
        })
      );
    }
  } catch (error) {
    console.error("Error inserting data:", error);
    if (!res.writableEnded) {
      res.end(
        JSON.stringify({
          message: "Error uploading data",
          error: error.message,
        })
      );
    }
  }
};

module.exports = Controller;

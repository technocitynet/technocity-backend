const { faker } = require("@faker-js/faker");
const UserModel = require("../Models/UserModel");

async function generateDummyData() {
  const users = [];
  const packageRates = {
    "8mb": 1000,
    "12mb": 1500,
    "16mb": 2000,
    "20mb": 2500,
    "25mb": 3000,
  };

  const connectionTypes = ["FTTH", "UDP", "Wireless"];

  for (let i = 0; i < 100; i++) {
    const connectionType = faker.helpers.arrayElement(connectionTypes);

    const selectedPackage = faker.helpers.arrayElement([
      "8mb",
      "12mb",
      "16mb",
      "20mb",
      "25mb",
    ]);
    const packageRate = packageRates[selectedPackage];

    const amountPaid = faker.number.int({
      min: Math.floor(packageRate * 0.5),
      max: packageRate,
    });

    const staticIP = faker.datatype.boolean();
    const staticIPAmmount = staticIP
      ? faker.number.int({ min: 500, max: 2000 }).toString()
      : undefined;

    const areas = ["Godhra Colony", "11 - G New Karachi", "11 - F New Karachi"];

    const user = {
      userId: `user${i + 14545454}`,
      username: faker.internet.displayName(),
      connectionType: connectionType,
      port: connectionType === "FTTH" ? "e-pone" : "",
      vlan: connectionType === "FTTH" ? "none" : "",
      package: selectedPackage.toString(),
      packageRate: packageRate.toString(),
      amountPaid: amountPaid.toString(),
      cnicNumber: faker.number
        .int({ min: 100000000000, max: 999999999999 })
        .toString(),
      phoneNumber: faker.phone.number().toString(),
      cellNumber: faker.phone.number().toString(),
      address: faker.location.streetAddress().toString(),
      area: faker.helpers.arrayElement(areas).toString(),
      staticIP: staticIP,
      staticIPAmmount: staticIP ?  staticIPAmmount : "",
      staticIPAddress: staticIP ? faker.internet.ip().toString() : "",
      remark: faker.lorem.sentence().toString(),
      lastMonthDue: faker.datatype.boolean()
        ? faker.number.int({ min: 100, max: 500 }).toString()
        : "",
      active: faker.datatype.boolean(),
    };

    users.push(user);
  }

  try {
    console.log("Dummy users inserted successfully.");
    return users;
  } catch (err) {
    console.error("Error inserting dummy users:", err);
    return false;
  }
}

module.exports = generateDummyData;

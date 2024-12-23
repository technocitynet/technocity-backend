const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Routes = require("./Routes/Routes");
require("dotenv").config();
const { connectToDatabase } = require("./Config/config");
const UserModel = require("./Models/UserModel");
const generateDummyData = require("./utils/GenerateDummyData");
const UpdateUserData = require("./AutoUpdateData/UpdateUsersData");
const AmmountStatement = require("./Models/AmmountStatement");
const UserStatmentModel = require("./Models/UserStatmentModel");
const ExpanceModel = require("./Models/ExpanceModel");
const PaymentModel = require("./Models/PaymentModel");
const TotalStatement = require("./Models/TotalStatement");

// Database Connection
connectToDatabase();

// Auto Update data Method Call
UpdateUserData();

// App Variable Express
const app = express();
   
// Cors Defined
app.use(
  cors({
    origin: "*",
    methods: "GET, POST , DELETE , PUT",
  })
);

// BodyParser Request body data to json
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// Port Variable
const port = process.env.PORT || 5888;

// Api Request Simple
app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

// generate dummy Data In Mongo DB
app.get("/generateDummyData", async (req, res) => {
  let generate = await generateDummyData();

  if (generate) {
    res.json({ message: "Dummy data generated successfully.", data: generate });
  } else {
    res.json({ error: "Failed to generate dummy data." });
  }
});

app.get("/delete/all", async (_, res) => {
   await UserModel.deleteMany({});
   await AmmountStatement.deleteMany({});
   await UserStatmentModel.deleteMany({});
   await PaymentModel.deleteMany({});
   await ExpanceModel.deleteMany({});
   await TotalStatement.deleteMany({});
  res.json({ message: "All users deleted successfully." });
});

// Response To Json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// All Api Route Define default Start with /api/v1/....
app.use("/api/v1", Routes);

async function del() {
  try {
    // REmover all user data from database
    await UserModel.deleteMany({});
  } catch (e) {
    console.log(e);
  }
}

// del();
// Reun Server
app.listen(port, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running on port ${port}`);
});

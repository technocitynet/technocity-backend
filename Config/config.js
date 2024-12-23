const mongoose = require("mongoose");
require("dotenv").config();

const dbUri = process.env.DB_URI;
const dbUriLocal = process.env.DB_URI_LOCAL;

const connectToDatabase = () => {
  mongoose
    .connect(dbUri, {
      dbName: "Network",
    })
    .then(() => {
      console.log("MongoDB connected...");
    });
};

module.exports = { connectToDatabase };
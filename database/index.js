const mongoose = require("mongoose");

let connectDB = async () => {
  try {
    let success = await mongoose.connect(process.env.DB_URI);
    console.log("mongodb connected succesfully");
  } catch (error) {
    console.log("mongo does not connected", error);
  }
};

module.exports = connectDB;

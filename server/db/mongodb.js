const mongoose = require('mongoose');
require("dotenv").config();


const dbConnect = async (uri) => {
  mongoose.set('strictQuery', true)
  try {
    await mongoose.connect(uri);
    console.log("Conección a la base de datos activa")
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

module.exports = {
  dbConnect
};
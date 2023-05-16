const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path:'.env'});

const DB_URI = process.env.DB_URI;

const dbConnection = () => {
  mongoose
    .connect(DB_URI)
    .then((conn) => {
      console.log(`Database Connected: ${conn.connection.host}`);
      
    })
    .catch((err) => {
      console.error(`Database Error: ${err}`);
      process.exit(1);
    });
};

module.exports = dbConnection;
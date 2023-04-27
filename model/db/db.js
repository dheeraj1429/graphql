const mongoose = require('mongoose');
const mongodbUri = process.env.MONGODB_URI;

const databaseConnection = function (callback) {
   mongoose
      .connect(mongodbUri, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      })
      .then((res) => {
         console.log('database connected');
         callback();
      })
      .catch((err) => {
         console.log(err);
      });
};

module.exports = databaseConnection;

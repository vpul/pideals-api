const mongoose = require('mongoose');

const connectWithRetry = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log('Connected to the MongoDB successfully.');
    })
    .catch((err) => {
      console.error(err);
      console.log(
        'MongoDB connection unsuccessful, retry after 5 seconds.',
        err,
      );
      setTimeout(connectWithRetry, 5000);
    });
};

module.exports = connectWithRetry;

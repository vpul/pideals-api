require('dotenv').config();

const express = require('express');
const createError = require('http-errors');
// logger
const cors = require('cors');
const connectToDB = require('./config/connectToDB');
const deals = require('./routes/deals');
const categories = require('./routes/categories');
const auth = require('./routes/auth');
const user = require('./routes/user');

const app = express();
connectToDB();

const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? 'http://pideals.com'
      : 'http://127.0.0.1:3000',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => res.send('API running successfully.'));
app.use('/api/deals', deals);
app.use('/api/categories', categories);
app.use('/api/auth', auth);
app.use('/api/user', user);

app.use((req, res, next) => {
  next(createError(404, 'Not found'));
});

// Central Error Handler
app.use((err, req, res, next) => {
  // handle mongoose errors
  // if (err.name === 'MongoError') {

  // }
  console.error(err);
  err.status = err.status || 500;

  // hide internal server error logs in production mode
  if (process.env.NODE_ENV === 'production' && err.status === 500) {
    err.message = 'Internal Server Error';
  }

  res.status(err.status).json({
    status: 'error',
    message: err.message,
  });
});

const serverPort = process.env.PORT || 3000;
app.listen(serverPort, () =>
  console.log(`Server listening on port ${serverPort}`),
);

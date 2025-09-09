const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const Auth = require('./router/Auth');
const User = require('./router/User');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms')
);
app.use(cors({
  origin: process.env.API_BASE_URL,
  credentials: true,
}));

app.use('/api/v1/', Auth);
app.use('/api/v1/user', User);

module.exports = app;
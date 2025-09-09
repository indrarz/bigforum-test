require('dotenv').config();
const app = require('./app');
const { db, connectDb } = require('./config/db');

function normalizePort(port) {
  if (typeof port === 'string') {
    return parseInt(port);
  } else if (typeof port === 'undefined') {
    return 5000;
  }

  return port;
}

(async () => {
  await connectDb();
  await db.sync({});
})();

const port = normalizePort(process.env.PORT);
app.listen(port, () => console.log(`Application running on port ${port}`));
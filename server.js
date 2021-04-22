const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path: './config.env'});

const app = require('./app');

//----- Connection to hosted database ---------//
const DB = process.env.MONGO_DATABASE.replace(
  '<PASSWORD>',
  process.env.MONGO_DATABASE_PASSWORD
);

// Connecting to MongoDB Atlas
mongoose
  .connect(DB, {
    // Deprecation warnings
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  })
  .then(() => {
    console.log('DB connection successful');
  })
  .catch((err) => {
    console.log('DB connection failed.');
  });

//----- Server is started on port --------//
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Running on port:${port}.`);
});

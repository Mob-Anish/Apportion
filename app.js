const express = require('express');  // express framework.
const morgan = require('morgan');
const path = require('path');
const fileRouter = require('./routes/fileRoutes');
const downloadViewRouter = require('./routes/downloadViewRoutes');
const downloadFileRouter = require('./routes/downloadFileRoutes');
const app = express();

app.use(express.static('public'));

// Set template engine
app.set('views', path.join(__dirname, '/views')); // Setting the path for views folder
app.set('view engine', 'ejs');  // Using ejs for rendering templates

app.use(express.json());
app.use(morgan('dev'));  // Third-party middleware

//--- Defining routes using middleware ---//
app.use('/api/v1/files', fileRouter);  // uploading file
app.use('/files', downloadViewRouter);   // Link to the download page
app.use('/files/download', downloadFileRouter);  // Download file

module.exports = app;

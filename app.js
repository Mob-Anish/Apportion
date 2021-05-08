const express = require('express'); // express framework.
const morgan = require('morgan');
const path = require('path');
const fileRouter = require('./routes/fileRoutes');
const downloadViewRouter = require('./routes/downloadViewRoutes');
const downloadFileRouter = require('./routes/downloadFileRoutes');
const app = express();

// Using static files in public folder.
app.use(express.static('public'));

// Set template engine
app.set('view engine', 'pug'); // Using pug for rendering templates
app.set('views', path.join(__dirname, '/views')); // Setting the path for views folder

app.use(express.json());
app.use(morgan('dev')); // Third-party middleware

//--- Defining routes using middleware ---//
app.use('/api/v1/files', fileRouter); // uploading file
app.use('/files', downloadViewRouter); // Link to the download page
app.use('/files/download', downloadFileRouter); // Download file

module.exports = app;

const express = require('express');
const fileController = require('./../controllers/fileController');

// Creating Router for fileRoutes.
const router = express.Router();

//----- File Route -----//
router.route('/').post(fileController.uploads);

// Send email
router.route('/send').post(fileController.sendMail);

module.exports = router;
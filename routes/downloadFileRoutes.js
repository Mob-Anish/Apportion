const express = require('express');
const downloadFileController = require('../controllers/downloadFileController');

const router = express.Router();

router.route('/:uuid').get(downloadFileController.downloadFile);

module.exports = router;
const express = require('express');
const downloadViewContoller = require('../controllers/downloadViewController');

const router = express.Router();

router.route('/:uuid').get(downloadViewContoller.downloadView);

module.exports = router;
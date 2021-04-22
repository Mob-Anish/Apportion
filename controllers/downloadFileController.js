const File = require('../models/fileModel');

//---- Download File Route -----//
exports.downloadFile = async (req, res, next) => {
  const file = await File.findOne({uuid: req.params.uuid});

  // Check file exist
  if (!file) {
    return res.render('download', {
      error: 'Link is invalid or expired',
    });
  }

  // Path to file storage
  const filePath = `${__dirname}/../${file.path}`;

  // Download the file in device
  res.download(filePath);
};

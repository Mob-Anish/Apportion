const File = require('../models/fileModel');

//----- Download page route ------//
exports.downloadView = async (req, res, next) => {
  try {
    const file = await File.findOne({uuid: req.params.uuid});

    // Check if file exist in db
    if (!file) {
      return res.status(400).render('download', {
        error: 'Link is invalid or expired',
      });
    }

    // Returning file
    res.status(200).render('download', {
      uuid: file.uuid,
      fileName: file.fileName,
      fileSize: file.size,
      // Link to download actual file
      downloadURL: `${process.env.APP_URL}/files/download/${file.uuid}`,
    });
  } catch (err) {
    res.status(500).render('download', {
      error: 'Something went wrong!!',
    });
  }
};

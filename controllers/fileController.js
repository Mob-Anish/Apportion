const multer = require('multer'); // middleware for handling multipart/form-data
const File = require('../models/fileModel');
const {v4: uuid4} = require('uuid');
const sendEmail = require('../utils/email');
const emailBody = require('../utils/emailBody');

// Storage and naming for file into disk(uploads dir)
let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const namingFile = `${file.originalname}`;
    cb(null, namingFile);
  },
});

// Setting the multer // It will be single file per req.
let upload = multer({
  storage,
  // 100mb = 1000000 byte(1mb) * 100
  limit: {fileSize: 1000000 * 100},
}).single('myfile');

// ------------ Upload route ------------//
// For storing the files data into database
exports.uploads = (req, res, next) => {
  // 1) Store file
  upload(req, res, async (err) => {
    // 2) Validate request
    if (!req.file) {
      return res.status(400).json({
        error: 'Fields are empty!!',
      });
    }

    // Error
    if (err) {
      return res.status(500).send({
        error: err.message,
      });
    }

    // Store into database
    const file = await File.create({
      fileName: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });

    // Returning download link
    res.status(200).json({
      file: `${process.env.APP_URL}/files/${file.uuid}`,
    });
  });
};

// ------- Send Email Route -------- //
exports.sendMail = async (req, res, next) => {
  const {uuid, mailTo, mailFrom} = req.body;

  // Check the fields
  if (!uuid || !mailTo || !mailFrom) {
    return res.status(400).json({
      error: 'Fields are empty!!',
    });
  }

  // Get data from db
  const file = await File.findOne({uuid});

  // Check if the file is already send
  if (file.sender || file.receiver) {
    return res.status(422).json({
      error: 'Email has been already sent!',
    });
  }

  // Saving post data to db
  file.sender = mailFrom;
  file.receiver = mailTo;
  await file.save();

  // Send email
  try {
    // sendEmail is an async function
    await sendEmail({
      mailFrom,
      mailTo,
      subject: 'Apportion',
      message: `${mailFrom} shared a file with you.`,
      html: emailBody({
        mailFrom,
        downloadLink: `${process.env.APP_URL}/files/download/${file.uuid}`,
        size: parseInt(file.size / 1000) + 'kb',
      }),
    });

    res.status(200).json({
      status: 'success',
      message: 'File sent to email',
    });
  } catch (err) {
    file.sender = undefined;
    file.receiver = undefined;
    await file.save({validateBeforeSave: false});
    console.log(err);

    return res.status(500).json({
      error: 'There was an error sending the email. Try again later!',
    });
  }
};

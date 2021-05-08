const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text'); 

module.exports = class Email {
  constructor(mailFrom, mailTo, downloadLink, size) {
    this.mailFrom = mailFrom;
    this.mailTo = mailTo;
    this.downloadLink = downloadLink;
    this.size = size;
  }

  // 1) Create a transporter(medium)
  transporter() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // 1) Render HTML based on a pug template.
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        url: this.downloadLink,
        size: this.size,
      }
    );

    // 2) Define the email options
    const mailOptions = {
      from: `Apportion <${this.mailFrom}>`,
      to: this.mailTo,
      subject,
      html,
      text: htmlToText(html, {
        wordwrap: 130,
      }),
    };

    // 3) Create a tansport and send a email
    await this.transporter().sendMail(mailOptions);
  }

  async sendMessage() {
    await this.send('message', 'The file has been shared to you!');
  }
};

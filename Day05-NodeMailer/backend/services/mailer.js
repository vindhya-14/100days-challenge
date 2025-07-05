const nodemailer = require('nodemailer');
require('dotenv').config();

exports.sendEmail = async ({ to, subject, url }) => {
  const emailHtml = `<p>Click the link below:</p><a href="${url}">Go to site</a>`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: emailHtml,
  });
};

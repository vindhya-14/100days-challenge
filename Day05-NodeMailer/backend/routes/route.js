const express = require('express');
const router = express.Router();
const { sendEmail } = require('../services/mailer');

router.post('/send-email', async (req, res) => {
  const { to, subject, url } = req.body;

  try {
    console.log(" Sending email to:", to);
    await sendEmail({ to, subject, url });
    res.status(200).send('Email sent!');
  } catch (err) {
    console.error("Error sending email:", err); 
    res.status(500).send('Failed to send email');
  }
});


module.exports = router; 

require('dotenv').config();
const nodemailer = require('nodemailer');
const Cryptr = require('cryptr');

const sendEmail = async (params, res) => {
  let {subject, text, email} = params;
  const cryptr = new Cryptr(process.env.EMAIL_AUTH_SECRET_KEY);
  let pass = cryptr.decrypt(process.env.EMAIL_ENCRYPTED);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject,
    html:text,
        
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({
        error: 'Failed to send reset token',
        errorMessage: error.message,
      });
    }
    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Reset token sent to your email' });
  });
};

module.exports = {
  sendEmail,
};

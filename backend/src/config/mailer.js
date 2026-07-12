const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (toEmail, otpCode) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Your Authentication OTP Code',
    text: `Your verification code is: ${otpCode}. It will expire in 10 minutes.`,
    html: `<h3>Your verification code is: <strong>${otpCode}</strong></h3><p>It will expire in 10 minutes.</p>`,
  };


  
  await transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (toEmail, resetCode) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Password Reset Request',
    text: `Your password reset code is: ${resetCode}. It expires in 15 minutes.`,
    html: `<h3>Password Reset Code: <strong>${resetCode}</strong></h3><p>If you did not request this, please ignore this email. This code expires in 15 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTP, sendPasswordResetEmail };
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendPasswordResetLink = async (toEmail, resetToken) => {
  // In a real application, you would have a frontend URL configured
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Password Reset Request',
    text: `You have requested to reset your password. Please click the link below to proceed:\n${resetUrl}\nThis link will expire in 1 hour.`,
    html: `<p>You have requested to reset your password. Please click the button below to proceed:</p><a href="${resetUrl}" style="background-color: #ff6b35; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a><p>If you did not request this, please ignore this email. This link will expire in 1 hour.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendPasswordResetLink };
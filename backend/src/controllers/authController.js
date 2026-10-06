const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');
const { sendPasswordResetLink } = require('../config/mailer');
const crypto = require('crypto');


const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists. Please login.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user without OTP fields
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      },
    });

    res.status(201).json({ message: 'Account created successfully. Please login.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process registration.' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

   try {
     const user = await prisma.user.findUnique({ where: { email } });

     if (!user || !(await bcrypt.compare(password, user.password))) {
       return res.status(401).json({ error: 'Invalid credentials.' });
     }

     const secret = process.env.JWT_SECRET;
     if (!secret) {
       console.error('FATAL: JWT_SECRET is not configured.');
       return res.status(500).json({ error: 'Server authentication configuration error.' });
     }

     const token = jwt.sign(
       { userId: user.id, email: user.email, name: user.name, role: user.role },
       secret,
       { expiresIn: '2h' }
     );

     res.json({
       message: 'Login successful',
       token,
       user: {
         id: user.id,
         email: user.email,
         name: user.name,
         role: user.role
       }
     });
   } catch (error) {
     res.status(500).json({ error: 'Internal server error.' });
   }
};

// Generate random token for password reset
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// --- Forgot Password ---
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return a generic message for security (prevents email enumeration)
      return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }

    const resetToken = generateResetToken();
    const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiresAt
      },
    });

    // In a real app, you would send an email with a link like:
    // `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    // For now, we'll just indicate that an email would be sent
    await sendPasswordResetLink(user.email, resetToken);

    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// --- Reset Password ---
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiresAt: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token.' });
    }

    // Hash the new password and clear the reset fields
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiresAt: null
      },
    });

    res.json({ message: 'Password successfully reset. You can now log in with your new password.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// --- Dashboard (Protected) ---
const getDashboard = (req, res) => {
  res.json({
    message: 'Welcome to your private dashboard data!',
    user: req.user,
  });
};

module.exports = { register, login, forgotPassword, resetPassword, getDashboard };
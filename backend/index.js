const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const vehicleRoutes = require('./src/routes/vehicleRoutes');
const driverRoutes = require('./src/routes/driverRoutes');
const { authenticateToken } = require('./src/middlewares/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

// Public Routes
app.use('/api/auth', authRoutes);

// Protected Routes
app.use('/api/vehicles', authenticateToken, vehicleRoutes);
app.use('/api/drivers', authenticateToken, driverRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Production server running smoothly on port ${PORT}`);
});
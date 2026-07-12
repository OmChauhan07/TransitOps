const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const vehicleRoutes = require('./src/routes/vehicleRoutes');
const driverRoutes = require('./src/routes/driverRoutes');
const tripRoutes = require('./src/routes/tripRoutes');
const maintenanceRoutes = require('./src/routes/maintenanceRoutes');
const financeRoutes = require('./src/routes/financeRoutes');
const { authenticateToken } = require('./src/middlewares/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

// Public Routes
app.use('/api/auth', authRoutes);

// Protected Routes
app.use('/api/vehicles', authenticateToken, vehicleRoutes);
app.use('/api/drivers', authenticateToken, driverRoutes);
app.use('/api/trips', authenticateToken, tripRoutes);
app.use('/api/maintenance', authenticateToken, maintenanceRoutes);
app.use('/api/finance', authenticateToken, financeRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Production server running smoothly on port ${PORT}`);
});
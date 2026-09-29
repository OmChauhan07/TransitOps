const express = require('express');
const { getVehicleAnalytics } = require('../controllers/analyticsController');
const { authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authorizeRoles('FLEET_MANAGER', 'FINANCIAL_ANALYST', 'SAFETY_OFFICER'));

router.get('/vehicles', getVehicleAnalytics);

module.exports = router;

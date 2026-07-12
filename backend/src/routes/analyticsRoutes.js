const express = require('express');
const { getVehicleAnalytics } = require('../controllers/analyticsController');

const router = express.Router();

router.get('/vehicles', getVehicleAnalytics);

module.exports = router;

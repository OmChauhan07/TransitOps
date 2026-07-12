const express = require('express');
const { getDashboardKPIs } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/kpis', getDashboardKPIs);

module.exports = router;

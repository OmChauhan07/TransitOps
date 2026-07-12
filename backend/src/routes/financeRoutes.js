const express = require('express');
const { getRecentLogs, getVehicleCosts, addFuelLog, addExpense } = require('../controllers/financeController');

const router = express.Router();

router.get('/logs', getRecentLogs);
router.get('/costs', getVehicleCosts);
router.post('/fuel', addFuelLog);
router.post('/expense', addExpense);

module.exports = router;

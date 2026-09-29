const express = require('express');
const { getRecentLogs, getVehicleCosts, addFuelLog, addExpense } = require('../controllers/financeController');
const { authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authorizeRoles('FLEET_MANAGER', 'FINANCIAL_ANALYST'));

router.get('/logs', getRecentLogs);
router.get('/costs', getVehicleCosts);
router.post('/fuel', addFuelLog);
router.post('/expense', addExpense);

module.exports = router;

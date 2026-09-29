const express = require('express');
const { getDrivers, createDriver, updateDriver, deleteDriver } = require('../controllers/driverController');
const { authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authorizeRoles('FLEET_MANAGER', 'SAFETY_OFFICER', 'DRIVER'), getDrivers);
router.post('/', authorizeRoles('FLEET_MANAGER', 'SAFETY_OFFICER'), createDriver);
router.put('/:id', authorizeRoles('FLEET_MANAGER', 'SAFETY_OFFICER'), updateDriver);
router.delete('/:id', authorizeRoles('FLEET_MANAGER', 'SAFETY_OFFICER'), deleteDriver);

module.exports = router;

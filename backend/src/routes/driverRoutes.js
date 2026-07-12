const express = require('express');
const { getDrivers, createDriver, updateDriver, deleteDriver } = require('../controllers/driverController');

const router = express.Router();

router.get('/', getDrivers);
router.post('/', createDriver);
router.put('/:id', updateDriver);
router.delete('/:id', deleteDriver);

module.exports = router;

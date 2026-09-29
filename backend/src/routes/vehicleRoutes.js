const express = require('express');
const { getVehicles, createVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');
const { authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getVehicles);
router.post('/', authorizeRoles('FLEET_MANAGER'), createVehicle);
router.put('/:id', authorizeRoles('FLEET_MANAGER'), updateVehicle);
router.delete('/:id', authorizeRoles('FLEET_MANAGER'), deleteVehicle);

module.exports = router;

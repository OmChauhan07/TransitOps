const express = require('express');
const { getTrips, createTrip, dispatchTrip, completeTrip, cancelTrip, deleteTrip } = require('../controllers/tripController');
const { authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authorizeRoles('FLEET_MANAGER', 'DRIVER'));

router.get('/', getTrips);
router.post('/', createTrip);
router.post('/:id/dispatch', dispatchTrip);
router.post('/:id/complete', completeTrip);
router.post('/:id/cancel', cancelTrip);
router.delete('/:id', deleteTrip);

module.exports = router;
